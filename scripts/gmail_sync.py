"""
wanderly Gmail Sync
Fetches emails from Gmail label "Reisen", parses them with GPT-4o-mini,
and writes structured inbox items to Firestore.
"""

import base64
import email
import email.header
import email.utils
import hashlib
import imaplib
import json
import os
import re
import sys
from datetime import datetime, timezone

import firebase_admin
from firebase_admin import credentials, firestore
from openai import OpenAI

GMAIL_ADDRESS     = os.environ['GMAIL_ADDRESS']
GMAIL_APP_PASSWORD = os.environ['GMAIL_APP_PASSWORD']
GMAIL_LABEL       = os.environ.get('GMAIL_LABEL', 'Reisen')
OPENAI_API_KEY    = os.environ['OPENAI_API_KEY']

_sa_raw = os.environ['FIREBASE_SERVICE_ACCOUNT']
FIREBASE_SA = json.loads(_sa_raw)

# ---------------------------------------------------------------------------
# Init
# ---------------------------------------------------------------------------
cred = credentials.Certificate(FIREBASE_SA)
firebase_admin.initialize_app(cred)
db = firestore.client()

openai_client = OpenAI(api_key=OPENAI_API_KEY)

# ---------------------------------------------------------------------------
# MIME helpers
# ---------------------------------------------------------------------------

def decode_header_str(raw):
    parts = email.header.decode_header(raw or '')
    decoded = []
    for chunk, charset in parts:
        if isinstance(chunk, bytes):
            decoded.append(chunk.decode(charset or 'utf-8', errors='replace'))
        else:
            decoded.append(chunk)
    return ' '.join(decoded)


def extract_plain_text(msg):
    """Walk MIME tree, collect all text/plain payloads (handles base64/qp)."""
    parts = []
    for part in (msg.walk() if msg.is_multipart() else [msg]):
        if part.get_content_type() != 'text/plain':
            continue
        payload = part.get_payload(decode=True)
        if not payload:
            continue
        charset = part.get_content_charset() or 'utf-8'
        parts.append(payload.decode(charset, errors='replace'))
    return '\n'.join(parts)


def truncate(text, max_chars=5000):
    """Keep the most relevant part: strip long signatures/disclaimers."""
    # Remove base64-looking blobs that sneak through
    text = re.sub(r'[A-Za-z0-9+/]{60,}={0,2}', '', text)
    # Collapse excessive blank lines
    text = re.sub(r'\n{4,}', '\n\n', text)
    return text[:max_chars]

# ---------------------------------------------------------------------------
# GPT parsing
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You parse travel booking confirmation emails (often forwarded several times).
Extract the booking and return a JSON object. All user-facing strings must be in German.

Required fields:
- type: "flight" | "hotel" | "insurance" | "car" | "train" | "other"
- skip: true  (only if this is clearly NOT a travel booking)
- from: sender brand name (e.g. "Ryanair", "Booking.com", "Potidea Palace Hotel")
- subject: short German subject line, max 50 chars
- preview: one-line German summary, max 80 chars

Optional fields (include only if found):
- destination: destination city or region
- departureDate: ISO date YYYY-MM-DD
- returnDate: ISO date YYYY-MM-DD
- checkIn: ISO date YYYY-MM-DD
- checkOut: ISO date YYYY-MM-DD
- totalAmount: number (EUR)
- bookingRef: booking reference / confirmation number
- flightNr: flight number(s) as string
- hotelName: full hotel name
- nights: number of nights
- passengers: number of passengers/guests

Return only valid JSON. No markdown, no explanation."""


def parse_with_gpt(subject, text):
    content = f"Subject: {subject}\n\n{truncate(text)}"
    resp = openai_client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user',   'content': content},
        ],
        response_format={'type': 'json_object'},
        temperature=0,
        max_tokens=512,
    )
    return json.loads(resp.choices[0].message.content)

# ---------------------------------------------------------------------------
# Icon / colour mapping
# ---------------------------------------------------------------------------

ICON_MAP = {
    'flight':    ('Plane',           '#D7E2C6'),
    'hotel':     ('Building2',       '#F8DEC4'),
    'insurance': ('Shield',          '#F5EAD4'),
    'car':       ('Car',             '#D4E4F0'),
    'train':     ('Train',           '#DCF0E4'),
    'other':     ('Mail',            '#EAEAEA'),
}


def format_date(date_header):
    try:
        dt = email.utils.parsedate_to_datetime(date_header)
        return dt.strftime('%-d. %b')   # e.g. "7. Jun"
    except Exception:
        return ''

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print(f"[wanderly] Connecting to Gmail ({GMAIL_ADDRESS}) label={GMAIL_LABEL}")

    mail = imaplib.IMAP4_SSL('imap.gmail.com')
    mail.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)

    # Gmail labels use special IMAP folder syntax
    status, _ = mail.select(f'"{GMAIL_LABEL}"')
    if status != 'OK':
        print(f"[wanderly] ERROR: label '{GMAIL_LABEL}' not found. Exiting.")
        mail.logout()
        sys.exit(1)

    status, data = mail.search(None, 'UNSEEN')
    if status != 'OK' or not data[0]:
        print('[wanderly] No new emails.')
        mail.logout()
        return

    msg_ids = data[0].split()
    print(f'[wanderly] {len(msg_ids)} unread email(s) found.')

    saved = 0
    skipped = 0

    for msg_id in msg_ids:
        status, msg_data = mail.fetch(msg_id, '(RFC822)')
        if status != 'OK':
            continue

        raw = msg_data[0][1]
        msg = email.message_from_bytes(raw)

        # Stable document ID from Message-ID header
        message_id = msg.get('Message-ID', '').strip()
        doc_id = 'gmail_' + hashlib.md5((message_id or str(raw[:64])).encode()).hexdigest()[:12]

        # Deduplicate
        if db.collection('inbox').document(doc_id).get().exists:
            print(f'  skip (already imported): {doc_id}')
            mail.store(msg_id, '+FLAGS', '\\Seen')
            skipped += 1
            continue

        subject = decode_header_str(msg.get('Subject', '(kein Betreff)'))
        text    = extract_plain_text(msg)

        if not text.strip():
            print(f'  skip (no plain text): {subject[:60]}')
            mail.store(msg_id, '+FLAGS', '\\Seen')
            skipped += 1
            continue

        print(f'  parsing: {subject[:60]}')
        try:
            parsed = parse_with_gpt(subject, text)
        except Exception as exc:
            print(f'  ERROR during GPT call: {exc}')
            continue

        if parsed.get('skip'):
            print(f'  skip (not a booking): {subject[:60]}')
            mail.store(msg_id, '+FLAGS', '\\Seen')
            skipped += 1
            continue

        icon, bg = ICON_MAP.get(parsed.get('type', 'other'), ICON_MAP['other'])

        inbox_item = {
            'id':         doc_id,
            'from':       parsed.get('from', 'Unbekannt'),
            'subject':    parsed.get('subject', subject[:50]),
            'preview':    parsed.get('preview', ''),
            'time':       format_date(msg.get('Date', '')),
            'tag':        None,
            'read':       False,
            'icon':       icon,
            'bg':         bg,
            'parsed':     parsed,
            'messageId':  message_id,
            'importedAt': datetime.now(timezone.utc).isoformat(),
        }

        db.collection('inbox').document(doc_id).set(inbox_item)
        mail.store(msg_id, '+FLAGS', '\\Seen')
        saved += 1
        print(f'  saved: {parsed.get("from")} — {parsed.get("subject")}')

    mail.logout()
    print(f'[wanderly] Done. saved={saved} skipped={skipped}')


if __name__ == '__main__':
    main()
