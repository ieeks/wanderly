# wanderly · Roadmap & Stack

> Familien-Reise-Dashboard — Buchungen, Dokumente, Kosten, Teilen.

---

## Stack-Entscheidung

### Option A · Firebase + React (Vite) — **empfohlen**
Passt zum bestehenden Setup (Finance Dashboard, Sublist, LEGO Tracker).

| Layer        | Tech                          | Warum                                      |
|--------------|-------------------------------|--------------------------------------------|
| Frontend     | React + Vite                  | Bekannt, schnell, kein Build-Overhead      |
| Styling      | Inline styles / Tailwind      | Wie im Prototype; kein CSS-Chaos           |
| Icons        | lucide-react                  | Bereits diskutiert, sauber, konsistent     |
| Fonts        | Google Fonts (Newsreader + Manrope) | Bereits im Prototype                 |
| DB           | Firestore (`europe-west3`)    | Realtime, schon bekannt                    |
| Storage      | Firebase Storage               | PDFs, Boarding Passes ablegen              |
| Hosting      | GitHub Pages / Firebase Hosting | Beides möglich                           |
| CI/CD        | GitHub Actions                | Wie Finance Dashboard                      |

### Option B · Next.js + Supabase
Mehr Overhead, sinnvoll wenn serverseitige Logik nötig (z.B. E-Mail-Parsing Backend).
Aktuell overkill für ein Familien-Tool.

### Option C · Single-file HTML (wie jetzt)
Nur für Mockups. Kein State-Management über Sessions, kein echter Auth.

**→ Entscheidung: Option A** — Firebase + React (Vite), GitHub Pages Hosting.

---

## Firestore Datenmodell (Entwurf)

```
trips/{tripId}
  name, emoji, dates, route, total, paid, due, dueDate
  bg, accent
  flight | train | drive  (subdocument)
  hotel                   (subdocument)
  extras                  (subdocument)
  createdBy, createdAt

trips/{tripId}/documents/{docId}
  type, filename, storageUrl, size, uploadedAt, status

trips/{tripId}/expenses/{expenseId}
  who, amount, payer, splitRatio, date, category

family/{familyId}/members/{memberId}
  name, init, color, email
```

---

## Prototype-Stand (aktuell) · v1.0.0

- [x] Home · Card-Stack (Stapel/Liste-Toggle)
- [x] Home · Sortierung chronologisch, Vergangene Trips getrennt
- [x] Home · FAB → Add Trip Flow
- [x] Trip Detail · Boarding Pass (Flug / Zug / Auto)
- [x] Trip Detail · Hotel-Card, Extras-Cards (Versicherung, Mietwagen, Skipass, Restaurant)
- [x] Trip Detail · ··· Menü → Bearbeiten / Löschen (mit Bestätigungs-Sheet)
- [x] Trip Detail · Tagesplan-Teaser → Itinerary Screen mit Timeline
- [x] Dokumente Sheet · PDF-Liste mit Status, QR + Download Buttons
- [x] Share Sheet · Link + WhatsApp + AirDrop + Toggles
- [x] Inbox · geparste E-Mails, Unread-Dots, Trip-Tags
- [x] Split & Settle · Kostenaufteilung Familie
- [x] Me / Settings · Gmail-Sync Status
- [x] Add Trip Flow (4 Schritte):
  - [x] Schritt 1 · Name, Emoji, Farbe, Daten + Live-Vorschau
  - [x] Schritt 2 · Anreise (Flug/Zug/Auto) · VIE fix · Flughafen-Suche (80+ Airports)
  - [x] Schritt 3 · Unterkunft · Hotel, Check-in/out, Extras-Toggle
  - [x] Schritt 4 · Budget aufgeschlüsselt (Flüge / Hotel / Mietwagen / Sonstiges)
- [x] Delete Confirm Sheet
- [x] Icons · Lucide inline SVGs (kein CDN)
- [x] Fonts · Newsreader + Manrope + JetBrains Mono
- [x] Logo · wanderly SVG (M + Sonnen-Akzent + Wordmark) · horizontal Layout · icon-only Variante
- [x] Logo · eingebaut in HomeScreen, Add Trip Sheet, Share Sheet OG Preview, Me Screen
- [x] Edit Trip Flow · Prefill aus bestehendem Trip · alle 4 Schritte vorausgefüllt
- [x] Empty State HomeScreen · Logo + floating Emojis + CTA "Erste Reise anlegen" + Gmail-Hint
- [x] Notification Badge · Inbox-Tab zeigt Unread-Count · verschwindet beim Öffnen · State in App geliftet
- [x] Family/Reisende CRUD · Add / Edit / Delete · Avatar-Vorschau · 8 Farben · State in App geliftet

---

## Nächste Schritte

### Prototype · noch offen (vor Claude Code Handoff)
- ✅ Alle geplanten Prototype-Features umgesetzt — bereit für Claude Code Handoff!

### Prototype · erledigt ✓
- [x] Home · Card-Stack, Stapel/Liste, Sortierung, Vergangene Trips getrennt
- [x] Add Trip Flow · 4 Schritte · Flughafen-Suche (80+ Airports) · Budget aufgeschlüsselt
- [x] Edit Trip · Prefill · vollständiger CRUD-Kreis (C/R/U/D)
- [x] Delete Trip · Bestätigungs-Sheet
- [x] Empty State · Logo + floating Emojis + CTA + Gmail-Hint
- [x] Notification Badge · Inbox-Tab Unread-Count · State in App geliftet
- [x] Screen Transitions · direction-aware push/pop/tab/fade · 320ms cubic-bezier
- [x] wanderly Logo · SVG · icon-only + wordmark horizontal
- [x] Trip Detail · Boarding Pass / Zug / Auto · Hotel · Extras · Budget
- [x] Dokumente Sheet · PDF-Liste · Status-Badges · QR + Download
- [x] Share Sheet · Link · WhatsApp · AirDrop · Toggles
- [x] Inbox · geparste E-Mails · Unread-Dots · Trip-Tags
- [x] Itinerary Screen · Timeline (Wachau)
- [x] Split & Settle · Kostenaufteilung Familie
- [x] Me / Settings · Profil · Gmail-Sync Status
- [x] Family/Reisende CRUD · FamilyEditSheet · Add/Edit/Delete · Avatar-Vorschau · 8 Farben
- [x] Itinerary CRUD · ActivitySheet · Add/Edit/Delete · 14 Kategorien · Auto-Sort nach Uhrzeit · Tage aus Datum-Range generiert

---

## v1 App · Feature-Roadmap (Claude Code)

### Kern
- [ ] Firestore Persistenz — Trips, Dokumente, Inbox
- [ ] Add/Edit Trip → schreibt nach Firestore
- [ ] Search / Filter — Trips nach Jahr, Status, Destination
- [ ] Boarding Pass Fullscreen — Vollbild für Gate-Vorzeigen, QR-Code, screen.wakeLock (PWA)

### Dokumente
- [ ] PDF Viewer — in-app öffnen
- [ ] Upload Flow — Foto / Datei zu Trip
- [ ] Auto-Kategorisierung — Flugticket vs. Hotel vs. Versicherung
- [ ] Gmail Sync — Label `Reisen` → IMAP → GPT-4o-mini → Firestore

### Familie & Sharing
- [ ] Read-only Link — shareable URL ohne Login
- [ ] WhatsApp Deep Link — echte wa.me URL
- [ ] Family Permissions — wer sieht Preise, wer kann bearbeiten
- [ ] Reise-Zusammenfassung — shareable Trip Card als Bild (html2canvas)

### Finanzen
- [ ] Expense Tracker — Ausgaben während der Reise
- [ ] Budget vs. Actual — geplant vs. ausgegeben
- [ ] Währungsumrechnung — open.er-api.com
- [ ] Fälligkeits-Reminder — Push wenn Anzahlung fällig

### Intelligence
- [ ] Packing List — AI-generiert nach Destination + Jahreszeit
- [ ] Wetter-Integration — OpenWeatherMap für Reisezeitraum
- [ ] Charging-Planer — BYD Seal U Roadtrips · ABRP-Integration

---

## Design System (Quiet Warm)

```css
--cream:   #FBF4E6   /* Background */
--paper:   #FFFAF1   /* Cards */
--ink:     #2D1F15   /* Text */
--terra:   #C96F4A   /* Primary Action */
--sun:     #E6B545   /* Accent / Warning */
--sage:    #8AA074   /* Success / Paid */

Font Display:  Newsreader (serif, italic mood)
Font Body:     Manrope (sans, clean)
Font Mono:     JetBrains Mono (labels, codes)
```

---

## Repo-Vorschlag

```
ieeks/wanderly
├── src/
│   ├── components/
│   │   ├── TripCard.jsx
│   │   ├── BoardingPass.jsx
│   │   ├── DocsSheet.jsx
│   │   └── ShareSheet.jsx
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── TripDetail.jsx
│   │   ├── InboxScreen.jsx
│   │   └── SplitScreen.jsx
│   ├── data/
│   │   └── trips.js        ← später durch Firestore ersetzen
│   └── App.jsx
├── public/
├── WANDERLY_ROADMAP.md     ← diese Datei
└── vite.config.js
```

---

*Prototype gebaut mit Claude Sonnet · Mai 2026*

---

## Claude Code Handoff · Mobile App v1.0

> Ziel: Den Prototype 1:1 als echte Vite + React + Firebase App umsetzen.
> Desktop-Version wird separat mit Claude Design gebaut.

### Kontext für Claude Code

Du baust **wanderly** — ein Familien-Reise-Dashboard für Manuel (Wien).
Der komplette UI-Prototype liegt als `wanderly-prototype.jsx` vor und soll 1:1 übernommen werden.
Keine eigenen Design-Entscheidungen treffen — alles exakt wie im Prototype.

**Wichtig:** Manuel arbeitet bereits mit Firebase (`europe-west3`) und GitHub Actions.
Patterns aus seinen anderen Projekten (Sublist, LEGO Tracker, Finance Dashboard) übernehmen.

---

### Schritt 1 · Repo anlegen + lokale Struktur

```bash
# 1. GitHub Repo bereits angelegt ✓
# gh repo create ieeks/wanderly --public --description "Family travel dashboard"

# 2. Lokal unter ~/Developer/ klonen (wie alle anderen Projekte)
cd ~/Developer
git clone https://github.com/ieeks/wanderly
cd wanderly

# 3. Vite Setup
npm create vite@latest . -- --template react
npm install
npm install firebase lucide-react

# 4. Projektdateien aus Prototype kopieren
# (wanderly-prototype.jsx, WANDERLY_ROADMAP.md, CHANGELOG.md, README.md)
```

**Lokale Ordnerstruktur nach Setup:**
```
~/Developer/
├── wanderly/                    ← neues Repo
│   ├── src/
│   ├── public/
│   ├── .github/workflows/
│   ├── WANDERLY_ROADMAP.md
│   ├── CHANGELOG.md
│   └── README.md
├── sublist-web/                 ← bereits vorhanden
├── lego-tracker/                ← bereits vorhanden
├── gmail-pdf-sync/              ← bereits vorhanden
└── eu-vat-reihengeschaeftrechner/ ← bereits vorhanden
```

**`.env.local`** — Firebase Config (nicht ins Git):
```bash
VITE_FIREBASE_API_KEY=<aus Firebase Console>
VITE_FIREBASE_APP_ID=<aus Firebase Console>
```

**`.gitignore`** — sicherstellen dass `.env.local` drin steht:
```
node_modules
dist
.env.local
.env*.local
```

**`vite.config.js`** — GitHub Pages Base:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/wanderly/', // → manuel-app.dev/wanderly
})
```

**`.github/workflows/deploy.yml`** — exakt wie `ieeks/sublist-web`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci && npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**GitHub Secrets** — bereits angelegt ✓
- `VITE_FIREBASE_API_KEY` ✓
- `VITE_FIREBASE_APP_ID` ✓

---

### Schritt 2 · Dateistruktur anlegen

```
src/
├── components/
│   ├── Ic.jsx                  ← Icon-Wrapper (lucide-react)
│   ├── StatusBar.jsx
│   ├── TabBar.jsx
│   ├── TravelDoc.jsx           ← Boarding Pass / Zug / Auto
│   ├── DocsSheet.jsx
│   ├── ShareSheet.jsx
│   ├── Toast.jsx
│   └── Progress.jsx
├── screens/
│   ├── HomeScreen.jsx
│   ├── TripDetail.jsx
│   ├── ItineraryScreen.jsx
│   ├── InboxScreen.jsx
│   ├── SplitScreen.jsx
│   └── MeScreen.jsx
├── data/
│   └── mockData.js             ← TRIPS, FAMILY, INBOX Arrays aus Prototype
├── styles/
│   └── tokens.js               ← Design Tokens (Farben, Fonts)
├── firebase.js                 ← Firebase init
└── App.jsx
```

---

### Schritt 3 · Design Tokens extrahieren

**`src/styles/tokens.js`** — exakt diese Werte aus dem Prototype:
```js
export const colors = {
  cream:   '#FBF4E6',
  cream2:  '#F5EAD4',
  paper:   '#FFFAF1',
  ink:     '#2D1F15',
  ink2:    '#5A4533',
  muted:   '#9F8A6F',
  line:    '#D9C9A8',
  line2:   '#EADFC4',
  terra:   '#C96F4A',
  terraD:  '#9C4A28',
  peach:   '#F0B58A',
  sun:     '#E6B545',
  sage:    '#8AA074',
  sageD:   '#5B7148',
  sky:     '#7BA8B8',
  plum:    '#9C6377',
};

export const fonts = {
  serif: "'Newsreader', Georgia, serif",
  sans:  "'Manrope', system-ui, sans-serif",
  mono:  "'JetBrains Mono', ui-monospace, monospace",
};
```

Google Fonts Link in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,500&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

### Schritt 4 · Icon-Wrapper auf lucide-react umstellen

**`src/components/Ic.jsx`:**
```jsx
import * as LucideIcons from 'lucide-react';

export default function Ic({ name, size = 18, color = 'currentColor', strokeWidth = 1.8 }) {
  const Icon = LucideIcons[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
```

Alle `<Ic name="X" />` Aufrufe bleiben identisch — nur der Import ändert sich.

---

### Schritt 5 · Mock-Daten aus Prototype übernehmen

**`src/data/mockData.js`** — die `TRIPS`, `FAMILY`, `INBOX` Arrays 1:1 aus
`wanderly-prototype.jsx` (Zeilen 71–136) herauskopieren.

Später durch Firestore-Reads ersetzen, aber vorerst statisch lassen.

---

### Schritt 6 · Firebase Setup

**`src/firebase.js`:**
```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Kein Auth — kein Login nötig, Sharing via read-only Links

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        "wanderly-b0f4e.firebaseapp.com",
  projectId:         "wanderly-b0f4e",
  storageBucket:     "wanderly-b0f4e.firebasestorage.app",
  messagingSenderId: "457320986949",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
export const storage = getStorage(app);
```

GitHub Secret anlegen: `FIREBASE_API_KEY` (und restliche Config-Werte).

---

### Schritt 7 · App.jsx · Router-Logik

Die State-Machine aus dem Prototype 1:1 übernehmen:

```jsx
// Routen: 'home' | 'detail' | 'itinerary' | 'inbox' | 'split' | 'me'
const [route, setRoute]           = useState('home');
const [prevRoute, setPrevRoute]   = useState(null);   // für Transitions
const [tripId, setTripId]         = useState(null);
const [share, setShare]           = useState(null);
const [docs, setDocs]             = useState(false);
const [addTrip, setAddTrip]       = useState(false);
const [editTrip, setEditTrip]     = useState(null);
const [deleteConfirm, setDeleteConfirm] = useState(null);
const [toast, setToast]           = useState(null);
const [trips, setTrips]           = useState(TRIPS);
const [inboxItems, setInboxItems] = useState(INBOX);
const [family, setFamily]         = useState(FAMILY);
// handlers: saveEditedTrip, updateTripItinerary, handleEditPerson, deleteTrip, saveEditedTrip
```

Kein React Router nötig für v1 — der einfache State-basierte Ansatz aus dem
Prototype funktioniert und ist bekannt.

---

### Schritt 8 · Screens aufteilen

Jeden Screen aus `wanderly-prototype.jsx` als eigene Datei extrahieren.
Props-Interfaces bleiben identisch:

| Screen / Komponente | Props |
|---------------------|-------|
| `HomeScreen` | `trips`, `onOpenTrip`, `onTab`, `onAddTrip`, `inboxBadge` |
| `TripDetail` | `tripId`, `trips`, `family`, `onBack`, `onShare`, `onItinerary`, `onDocs`, `onDelete`, `onEdit` |
| `ItineraryScreen` | `tripId`, `trips`, `onBack` |
| `InboxScreen` | `items`, `setItems`, `onTab`, `onOpenTrip` |
| `SplitScreen` | `onTab`, `inboxBadge`, `family` |
| `MeScreen` | `onTab`, `inboxBadge`, `family`, `onEditPerson` |
| `DocsSheet` | `trip`, `onClose` |
| `ShareSheet` | `trip`, `onClose`, `onSent` |
| `AddTripSheet` | `onClose`, `onAdd`, `onSave`, `initialTrip` |
| `DeleteConfirmSheet` | `trip`, `onCancel`, `onConfirm` |
| `FamilyEditSheet` | `person`, `onClose`, `onSave`, `onDelete` |
| `TabBar` | `active`, `onChange`, `badges` |
| `WanderlyLogo` | `size`, `showWordmark` |
| Empty State | in `HomeScreen` wenn `trips.length === 0` |
| `ActivitySheet` | `activity`, `dayLabel`, `onClose`, `onSave`, `onDelete` |

---

### Schritt 9 · iOS Device Frame entfernen

Im Prototype ist die App in einen simulierten iPhone-Rahmen eingebettet
(`IOSDevice` Komponente mit fixer `360×760` Größe).

Für die echte App:
- Device Frame entfernen
- `App.jsx` rendert direkt in `<div id="root">`
- `max-width: 430px; margin: 0 auto` für Desktop-Browser
- `min-height: 100dvh` statt fixer Höhe
- Safe Area: `padding-bottom: env(safe-area-inset-bottom)`

---

### Schritt 10 · Deploy & testen

```bash
npm run build
git add . && git commit -m "feat: initial wanderly v1"
git push origin main
# → GitHub Actions deployed zu manuel-app.dev/wanderly
```

Firebase Authorized Domain hinzufügen:
`ieeks.github.io` → Firebase Console → Authentication → Authorized Domains

---

### Was Claude Code NICHT ändern soll

- ❌ Kein anderes Design-System
- ❌ Keine anderen Farben, Fonts, Abstände
- ❌ Kein CSS Framework (kein Tailwind, kein MUI)
- ❌ Kein React Router für v1
- ❌ Keine TypeScript-Migration für v1
- ❌ Keine eigenen Komponenten-Bibliotheken außer lucide-react

---

### Entscheidungen für den Handoff

- [x] **GitHub Repo:** `ieeks/wanderly`
- [x] **URL:** `https://manuel-app.dev/wanderly` (wie alle anderen Projekte)
- [x] **Firebase Projekt:** `wanderly` · Projekt-ID: `wanderly-b0f4e`

### Zusätzlicher Schritt · ieeks.github.io Landing Page

Nach dem Deployment muss `ieeks/ieeks.github.io` (manuel-app.dev) aktualisiert werden:
- Neue Tool-Card für wanderly hinzufügen
- Icon: wanderly Logo SVG (M + Sonnen-Akzent)
- Titel: `wanderly`
- Tags: `Travel · Firebase`
- Beschreibung: "Family travel dashboard. Flights, hotels, costs and documents in one place."
- Status: `live`
- Link: `https://manuel-app.dev/wanderly`

Reihenfolge beim Handoff:
1. `ieeks/wanderly` Repo anlegen + Vite Setup
2. Firebase Projekt anlegen (`europe-west3`)
3. GitHub Actions deploy → `manuel-app.dev/wanderly`
4. `ieeks/ieeks.github.io` → wanderly Card ergänzen


---

*Handoff erstellt: Mai 2026 · Claude Sonnet 4.6*

---

## Datenstrategie · Wie kommen Trips ins Tool?

### Phase 1 · Hardcoded Mock (jetzt)
Alle Daten direkt im JSX (`src/data/mockData.js`).
Kein Speicher, kein Backend — reines Prototype-Mockup.

```js
// src/data/mockData.js
export const TRIPS = [
  { id: 'hal', name: 'Halkidiki', ... },
  ...
]
```

---

### Phase 2 · Manuelles Formular (v1 · erster echter Schritt)

**Add Trip Flow** direkt in der App:
- Floating `+` Button auf HomeScreen
- Bottom Sheet mit Formular: Name, Emoji, Daten, Destination
- Typ wählen: Flug / Zug / Auto
- Flugdaten eingeben (oder leer lassen)
- Hotel-Infos
- → Speichert nach Firestore `trips/{tripId}`

```
Firestore
└── trips/
    └── hal_2026/
        ├── name: "Halkidiki"
        ├── dates: "7–14 Jun"
        ├── total: 3767
        └── flight: { from: "VIE", to: "SKG", ... }
```

Dokumente: manuell hochladen (PDF aus Files App) → Firebase Storage.

**Aufwand:** ~1 Wochenende mit Claude Code.

---

### Phase 3 · Gmail Sync halbautomatisch (v2)

Gleiche Architektur wie das Finance Dashboard (`manuel.rechnungen@gmail.com`):

```
Buchungsmail kommt rein (Ryanair, Booking.com, HRS, Europäische...)
→ Gmail Label "Reisen" manuell vergeben (oder Filter-Regel)
→ GitHub Actions Cron (stündlich, via cron-job.org)
→ IMAP fetch · neue Mails im Label "Reisen"
→ PDF-Attachment extrahieren (pdfplumber)
→ GPT-4o-mini: strukturierte Daten extrahieren
→ Firestore schreiben · Status: "pending_review"
→ In-App Notification: "1 neue Buchung erkannt · prüfen"
→ Du tippst auf "bestätigen" → Status: "confirmed"
```

**Erkannte E-Mail-Typen:**

| Absender | Typ | Felder |
|----------|-----|--------|
| Ryanair / Austrian / Lufthansa | Flug | Route, Datum, Flugnr., Passagiere, Sitze |
| Booking.com / HRS / Hotels.com | Hotel | Name, Adresse, Check-in/out, Zimmertyp |
| Europäische / ERGO / Allianz | Versicherung | Policennr., Laufzeit, Pax |
| Sixt / Hertz / Enterprise | Mietwagen | Abhol-/Rückgabeort, Fahrzeugklasse |
| ÖBB / DB | Zug | Strecke, Abfahrt, Wagon, Sitze |

**GitHub Actions Secret** (neue, zusätzlich zu Finance Dashboard):
```
WANDERLY_GMAIL_APP_PASSWORD  ← gleiche Gmail-Adresse, neues App-Passwort
OPENAI_API_KEY               ← bereits vorhanden
FIREBASE_SERVICE_ACCOUNT     ← für wanderly Projekt neu generieren
```

**Aufwand:** ~1 Wochenende, großteils Copy-Paste aus Finance Dashboard Pipeline.

---

### Phase 4 · Vollautomatisch (v3)

Kein manuelles Label mehr nötig:

```
Alle eingehenden Mails → GPT-4o-mini Classifier
→ "Ist das eine Reisebuchung?" → ja/nein
→ ja → extrahieren → Firestore (status: "auto_imported")
→ Push Notification (PWA) oder In-App Badge
```

Zusätzlich:
- **Preisänderungs-Tracking** — Booking.com schickt manchmal Updates
- **Fälligkeits-Reminder** — "Anzahlung Halkidiki fällig in 3 Tagen"
- **Dokument-Archiv** — alle PDFs automatisch in Firebase Storage

---

### Datenfluss Übersicht

```
                    ┌─────────────────────┐
                    │   Gmail Inbox        │
                    │   Label: "Reisen"    │
                    └────────┬────────────┘
                             │ IMAP (stündlich)
                    ┌────────▼────────────┐
                    │  GitHub Actions      │
                    │  Python Script       │
                    │  pdfplumber          │
                    │  GPT-4o-mini         │
                    └────────┬────────────┘
                             │ Firestore Write
              ┌──────────────▼──────────────────┐
              │           Firestore               │
              │   trips/ · documents/ · inbox/    │
              └──────────────┬──────────────────┘
                             │ Realtime Read
                    ┌────────▼────────────┐
                    │    wanderly App      │
                    │  (React + Vite)      │
                    │  manuel-app.dev/     │
                    │  wanderly            │
                    └─────────────────────┘
                             │ read-only Link
                    ┌────────▼────────────┐
                    │   Familie / Olga     │
                    │   kein Login nötig   │
                    └─────────────────────┘
```

---

### Priorität für Claude Code Handoff

Claude Code soll in v1 **nur Phase 2** umsetzen (manuelles Formular).
Gmail Sync (Phase 3) kommt danach als separater Handoff — eigenes Prompt-File.


---

## Manuel · Manuelle Schritte (vor + nach Handoff)

> Diese Schritte kann Claude Code nicht übernehmen — müssen manuell erledigt werden.

### Vor dem Handoff

- [x] **Firebase `apiKey` + `appId` kopiert** ✓

### Nach `git push` / erstem Deploy

- [x] **GitHub Secrets angelegt** ✓
  - `VITE_FIREBASE_API_KEY` ✓
  - `VITE_FIREBASE_APP_ID` ✓

- [ ] **GitHub Pages aktivieren** · manuell (kein stabiler CLI-Befehl)
  - `ieeks/wanderly` → Settings → Pages → Source: `gh-pages` Branch → Save
  - *(30 Sekunden, einmalig nach erstem Deploy)*

- [ ] **Firebase Authorized Domain**
  - Firebase Console → Authentication → Sign-in method → Authorized domains
  - `manuel-app.dev` hinzufügen

- [ ] **Cloudflare / manuel-app.dev**
  - Sicherstellen dass `/wanderly` korrekt auf GitHub Pages zeigt
  - Wie bei `sublist-web`, `lego-tracker` etc. — gleiche Konfiguration

- [ ] **Landing Page `ieeks/ieeks.github.io`**
  - Neue Tool-Card für wanderly hinzufügen:
    - Icon: wanderly Logo SVG
    - Titel: `wanderly`
    - Tags: `Travel · Firebase`
    - Beschreibung: "Family travel dashboard. Flights, hotels, costs and documents."
    - Status: `live`
    - Link: `https://manuel-app.dev/wanderly`

### Optional · später

- [ ] **Firebase Storage aktivieren** (wenn Upload-Flow kommt)
  - Firebase Console → Storage → Get started → europe-west3
  - Spark Plan reicht (5 GB kostenlos)

- [ ] **Gmail App-Passwort** (wenn Gmail Sync kommt)
  - Google Account → Sicherheit → 2FA → App-Passwörter → neues Passwort für "wanderly"
  - Als GitHub Secret `WANDERLY_GMAIL_APP_PASSWORD` anlegen


---

## Onboarding · Geplant für Ende des Projekts

> ⚠️ Bewusst ans Ende gestellt — erst umsetzen wenn das Feature-Set stabil ist.
> Onboarding das sich alle 2 Wochen ändert ist schlechter als kein Onboarding.

### Wann ist "Ende"?
Wenn folgendes steht:
- Add/Edit/Delete Trip vollständig
- Gmail Sync läuft (zumindest halbautomatisch)
- Boarding Pass Fullscreen mit QR
- Desktop Version fertig

### Was das Onboarding zeigen soll

**4 Screens (modal, swipeable), ähnlich Finance Dashboard:**

| Screen | Inhalt |
|--------|--------|
| 1 · Willkommen | Logo, "Deine Reisen. Auf einen Blick." — kurze Tagline |
| 2 · Reisen anlegen | + Button zeigen, Trip-Karte animiert aufpoppt |
| 3 · Gmail Sync | Briefumschlag-Animation, "Buchungen landen automatisch" |
| 4 · Familie teilen | Share-Icon, "Olga sieht alles — ohne Login" |

**Trigger:** Nur beim allerersten Öffnen (`localStorage: wanderly_onboarded`).
Nach Abschluss nie mehr zeigen. "Überspringen" immer verfügbar.

### Design-Prinzipien
- Gleicher Look wie App (Cream/Terra/Newsreader) — kein fremder Design-Kontext
- Max. 4 Screens — danach ist Geduld aufgebraucht
- Kein Text-Wall — eine Aussage pro Screen, großes Visual
- Letzter Screen = direkter CTA: "Erste Reise anlegen →"

