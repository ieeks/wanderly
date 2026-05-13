# wanderly

> Familien-Reise-Dashboard — Buchungen, Dokumente, Kosten & Teilen auf einen Blick.

**Status:** Prototype · v0.6.0 · Mai 2026

---

## Was ist wanderly?

wanderly ist ein persönliches Reise-Dashboard für die Familie. Es fasst alle Reisebuchungen an einem Ort zusammen — Flüge, Hotels, Mietwagen, Versicherungen, Kosten und Dokumente — und macht sie einfach mit der Familie teilbar.

Kein Login für Mitlesende, keine monatlichen Abo-Kosten, keine Werbung. Eigene Infrastruktur, eigene Daten.

---

## Features (Prototype)

| Screen | Was es kann |
|--------|-------------|
| **Home** | Reise-Karten als Stapel oder Liste, chronologisch sortiert, vergangene Trips getrennt |
| **Trip Detail** | Boarding Pass / Zugticket / Fahrt-Card, Hotel, Extras, Budget-Übersicht |
| **Add Trip** | 4-Schritt Flow: Basics → Anreise → Unterkunft → Budget (aufgeschlüsselt) |
| **Dokumente** | PDF-Liste pro Trip mit Status, QR + Download |
| **Teilen** | Read-only Link, WhatsApp, AirDrop, Preis-Versteck-Toggle |
| **Inbox** | Auto-geparste E-Mails mit Trip-Tags |
| **Familie** | Split & Settle — wer schuldet wem wieviel |
| **Ich** | Profil, Gmail-Sync Status, Settings |

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Icons | lucide-react |
| Fonts | Newsreader · Manrope · JetBrains Mono |
| DB | Firebase Firestore (`europe-west3`) |
| Storage | Firebase Storage (PDFs) |
| Hosting | GitHub Pages (`ieeks.github.io/wanderly`) |
| CI/CD | GitHub Actions |
| E-Mail Parser | Python · IMAP · pdfplumber · GPT-4o-mini |

---

## Projekt-Struktur (geplant)

```
wanderly/
├── src/
│   ├── components/
│   │   ├── Ic.jsx                  ← Lucide Icon wrapper
│   │   ├── TravelDoc.jsx           ← Boarding Pass / Zug / Auto
│   │   ├── DocsSheet.jsx
│   │   ├── ShareSheet.jsx
│   │   ├── AddTripSheet.jsx
│   │   ├── DeleteConfirmSheet.jsx
│   │   └── Progress.jsx
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── TripDetail.jsx
│   │   ├── ItineraryScreen.jsx
│   │   ├── InboxScreen.jsx
│   │   ├── SplitScreen.jsx
│   │   └── MeScreen.jsx
│   ├── data/
│   │   └── mockData.js             ← TRIPS, FAMILY, INBOX (→ Firestore)
│   ├── styles/
│   │   └── tokens.js               ← Design Tokens
│   ├── firebase.js
│   └── App.jsx
├── .github/workflows/
│   └── deploy.yml
├── README.md
├── CHANGELOG.md
└── WANDERLY_ROADMAP.md
```

---

## Design System

```
Hintergrund:  #FBF4E6  cream
Cards:        #FFFAF1  paper
Text:         #2D1F15  ink
Primary CTA:  #C96F4A  terra
Accent:       #E6B545  sun
Success:      #8AA074  sage

Display:  Newsreader (Serif, für Titel + Zahlen)
Body:     Manrope (Sans, für UI)
Mono:     JetBrains Mono (Labels, Codes, IATA)
```

---

## Datenstrategie

1. **Prototype** — statische Mock-Daten in `mockData.js`
2. **v1** — manuelles Add-Trip Formular → Firestore
3. **v2** — Gmail Sync: Label `Reisen` → IMAP → GPT-4o-mini → Firestore
4. **v3** — vollautomatisch mit Push-Notifications

Details: siehe [WANDERLY_ROADMAP.md](./WANDERLY_ROADMAP.md)

---

## Lokale Entwicklung

```bash
git clone https://github.com/ieeks/wanderly
# Live unter: https://manuel-app.dev/wanderly
cd wanderly
npm install
npm run dev
```

Firebase Config in `.env.local`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
```

---

## Deployment

Push auf `main` → GitHub Actions baut + deployed automatisch nach `manuel-app.dev/wanderly`.

---

## Verwandte Projekte

| Projekt | Repo | Stack |
|---------|------|-------|
| Finance Dashboard | `ieeks/finance-dashboard` | React + Firebase + Gmail IMAP |
| Sublist | `ieeks/sublist-web` | Next.js + Firestore |
| LEGO Tracker | `ieeks/lego-tracker` | React + Firestore + BrickSet API |
| Wallbox | `ieeks/ieeks.github.io/wallbox` | Vanilla JS + Firestore |
| VAT Calculator | `ieeks/eu-vat-reihengeschaeftrechner` | Single-file HTML |

---

*Prototype gebaut mit Claude Design · Mai 2026*
