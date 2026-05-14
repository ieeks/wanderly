# wanderly

> Familien-Reise-Dashboard — Buchungen, Dokumente, Kosten & Teilen auf einen Blick.

**Status:** v1.7.0 · live · Mai 2026 · [ieeks.github.io/wanderly](https://ieeks.github.io/wanderly)

---

## Was ist wanderly?

wanderly ist ein persönliches Reise-Dashboard für die Familie. Es fasst alle Reisebuchungen an einem Ort zusammen — Flüge, Hotels, Mietwagen, Versicherungen, Kosten und Dokumente — und macht sie einfach mit der Familie teilbar.

Kein Login für Mitlesende, keine monatlichen Abo-Kosten, keine Werbung. Eigene Infrastruktur, eigene Daten.

---

## Features (v1 · live)

| Screen | Was es kann |
|--------|-------------|
| **Home** | Reise-Karten als Stapel oder Liste, chronologisch sortiert, vergangene Trips getrennt, FAB + Empty State |
| **Trip Detail** | Boarding Pass / Zugticket / Fahrt-Card, Hotel, Extras, Budget-Übersicht, ··· Menü (Bearbeiten / Löschen) |
| **Add / Edit Trip** | 4-Schritt Flow: Basics → Anreise (1178 Airports) → Unterkunft → Budget (aufgeschlüsselt) |
| **Itinerary** | Tag-für-Tag Tagesplan · Add / Edit / Delete Aktivitäten · 14 Kategorien · Auto-Sort nach Uhrzeit |
| **Dokumente** | PDF-Liste pro Trip mit Status, QR + Download |
| **Teilen** | Read-only Link, WhatsApp, AirDrop, Preis-Versteck-Toggle · **Share Card als JPEG** (html2canvas) |
| **Inbox** | Auto-geparste E-Mails mit Unread-Dots, Trip-Tags, Notification Badge |
| **Familie** | Split & Settle · Ausgaben in Firestore · Auto-Saldo (50/50) · Beglichen-Button · Add / Edit / Delete Reisende · Avatar-Vorschau · 8 Farben |
| **Ich** | Profil, Gmail-Sync Status, Settings |
| **Desktop** | macOS-Shell (≥1024px) · Sidebar (7 Views, einklappbar) · Boarding Pass · Countdown- & Budget-Widgets · .eml Drag-and-Drop |

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

## Projekt-Struktur

```
wanderly/
├── src/
│   ├── components/
│   │   ├── Ic.jsx                  ← lucide-react wrapper
│   │   ├── StatusBar.jsx
│   │   ├── TabBar.jsx              ← mit Notification Badge
│   │   ├── TravelDoc.jsx           ← Boarding Pass / Zug / Auto
│   │   ├── WanderlyLogo.jsx        ← SVG · icon-only + wordmark
│   │   ├── DocsSheet.jsx
│   │   ├── ShareSheet.jsx
│   │   ├── AddTripSheet.jsx        ← 4-Schritt Flow + Airport-Suche
│   │   ├── DeleteConfirmSheet.jsx
│   │   ├── FamilyEditSheet.jsx
│   │   ├── ActivitySheet.jsx       ← Itinerary CRUD
│   │   ├── Toast.jsx
│   │   └── Progress.jsx
│   ├── screens/
│   │   ├── HomeScreen.jsx          ← Card-Stack + Liste + Empty State
│   │   ├── TripDetail.jsx
│   │   ├── ItineraryScreen.jsx
│   │   ├── InboxScreen.jsx
│   │   ├── SplitScreen.jsx
│   │   ├── MeScreen.jsx
│   │   └── DesktopApp.jsx          ← macOS-Shell · Variant A · ≥1024px
│   ├── data/
│   │   └── mockData.js             ← Seed-Quelle + Fallback (Firestore ist live)
│   ├── hooks/
│   │   ├── useFirestore.js         ← useCollection (onSnapshot Realtime)
│   │   └── useSwipeDown.js         ← Swipe-to-close für alle Bottom Sheets
│   ├── styles/
│   │   ├── tokens.js               ← Design Tokens
│   │   ├── shared.js               ← gemeinsames S-Style-Objekt
│   │   └── desktop.css             ← Desktop Design Tokens + Komponenten-Styles
│   ├── utils/
│   │   └── dateHelpers.js
│   ├── firebase.js
│   └── App.jsx                     ← State-Router + Transitions
├── scripts/
│   ├── seed.js                     ← Firestore einmalig befüllen (npm run seed)
│   ├── generate-airports.js        ← AIRPORTS Array generieren (npm run airports)
│   └── wikidata-cities.json        ← Wikidata Cache (deutsche Gemeindenamen, nach --refresh-wikidata)
├── .github/workflows/
│   └── deploy.yml                  ← GitHub Actions → gh-pages
├── firestore.rules
├── firebase.json
├── .env.local.example
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

1. **Prototype** — statische Mock-Daten in `mockData.js` ✅
2. **v1** — Firestore live · Add/Edit/Delete → Realtime via `onSnapshot` ✅
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

Firebase Config in `.env.local` (Template: `.env.local.example`):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_APP_ID=...
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

*Prototype: Claude Design · Mai 2026 · v1 App: Claude Code · Mai 2026*
