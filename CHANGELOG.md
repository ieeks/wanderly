# Changelog

Alle relevanten Änderungen an wanderly werden hier dokumentiert.

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

---

## [Unreleased]

### Planned · v1 App · nächste Schritte
- PDF Viewer — in-app PDF öffnen
- WhatsApp Deep Link (echte wa.me URL)
- Boarding Pass Fullscreen — Vollbild für Gate · QR · screen.wakeLock
- Gmail Sync: Label `Reisen` → IMAP → GPT-4o-mini → Firestore

---

## [1.9.0] — 2026-05-18

### Fixed · Desktop UI
- **Sidebar Collapse** — Toggle-Button `›` war bei eingeklappter Sidebar (72px) durch zu breites Padding (44px) nicht mehr klickbar; CSS-Fix: Header-Padding auf 0 reduziert, Logo ausgeblendet, Toggle zentriert — Sidebar lässt sich wieder aufklappen
- **„Neue Reise hinzufügen"** — Karte + Button in der Alle-Reisen-Ansicht hatten kein `onClick`; öffnen jetzt `AddTripSheet`
- **„↗ teilen"** — Button in Dashboard und Trip-Detail war ohne Handler; öffnet jetzt `ShareSheet` mit allen Optionen (WhatsApp, AirDrop, Link kopieren, Bild teilen)
- **„📁 Dokumente"** — Button navigiert jetzt korrekt zur Dokumente-Ansicht
- **„als beglichen markieren"** — Button in Split & Settle war ohne Handler; ruft jetzt `onSettleAll` auf
- **„alle ansehen →"** — Link im Dashboard-Widget „Weitere Reisen" navigiert jetzt zur Alle-Reisen-Ansicht

### Added · Desktop
- **Split & Settle Import** — neuer Button „📥 Aus Buchungen importieren" erstellt automatisch Ausgaben-Einträge aus den Reise-Gesamtkosten; doppelte Importe werden übersprungen
- **Favorit-Toggle** — ♡ / ♥ Button im Dashboard speichert `fav: true/false` persistent in Firestore (Merge-Write); überlebt Neuladen

---

## [1.8.0] — 2026-05-16

### Added
- **E-Mail Parser** — Buchungsbestätigungen automatisch in Trips umwandeln
  - **Desktop:** `.eml` Drag-and-Drop auf Inbox → ParsedTripModal → Bestätigen öffnet AddTripSheet
  - **Mobile / iPhone:** „📋 einfügen"-Button → PasteSheet → E-Mail-Text einkopieren → gleicher Flow
  - **Cloudflare Worker** als serverloser Proxy (`wanderly-parser`) — OpenAI Key liegt server-seitig, nie im JS-Bundle
  - `gpt-4o-mini` parst Reiseziel, Datum, Flug/Zug/Hotel, Kosten, Versicherung aus beliebigen Buchungsmails
  - `src/utils/parseEmail.js` ruft Worker per `fetch` auf — kein OpenAI SDK im Frontend mehr
  - CI deployt Worker automatisch via `npx wrangler deploy` und setzt `OPENAI_API_KEY` als Worker-Secret

### Fixed
- **Budget-Werte beim Editieren** — `costFlight`/`costHotel`/`costOther` wurden bisher bei jedem Edit neu aus Prozentwerten berechnet statt die gespeicherten Werte zu verwenden
- **Swipe-to-close** auf PasteSheet (Buchung analysieren) fehlte — `useSwipeDown` Hook nachgerüstet
- **Karten-Farbe in Trip Detail** — Flug-Ticket, Zug-Ticket und Hotel-Card verwenden jetzt den Trip-Farbindex (`trip.bg`) statt hardcodierter Farben

---

## [1.7.0] — 2026-05-14

### Added
- **Desktop Shell (Variant A)** — macOS-style App-Layout ab ≥ 1024px Viewport-Breite; mobile Layout unverändert darunter
  - `DesktopApp.jsx` (~800 Zeilen) — vollständige Desktop-Implementierung nach Design Handoff
  - **Sidebar** — 288px offen / 72px eingeklappt; Collapse-Toggle, Brand-Row, 7 Navigations-Items mit Badges, Trip-Liste, Familien-Footer
  - **Titlebar** — macOS Ampel-Buttons (simuliert) + Breadcrumb-Pfad (wanderly › Familie 2026 › aktive View)
  - **Boarding Pass** — flight / train / drive Varianten mit vollständiger Passagierliste
  - **Dashboard-Widgets** — Countdown-Card (Tage bis Abflug), Budget-Card, Split-Mini-Card, Inbox-Mini-Card
  - **7 Views** — Dashboard, TripDetail, Alle Reisen, Inbox, Split & Settle, Familie, Dokumente — alle Firestore-verbunden
  - **.eml Drag-and-Drop** — Overlay-Veil beim Ablegen einer Buchungsmail
  - `desktop.css` — Design-Tokens, Sidebar, Cards, Chips, Avatare, Boarding Pass, Drop Veil, macOS Chrome
- **`useIsDesktop` Hook** — Resize-aware, erkennt ≥ 1024px und wechselt automatisch zum Desktop-Layout

---

## [1.6.0] — 2026-05-14

### Added
- **Split & Settle · Firestore** — Ausgaben werden in Firestore Collection `expenses` gespeichert · Realtime via `onSnapshot`
- **ExpenseSheet** — Bottom Sheet zum Hinzufügen / Bearbeiten / Löschen von Ausgaben: Beschreibung, Betrag (€), 8 Kategorien (Flug, Unterkunft, Restaurant, Mietwagen, Versicherung, Shopping, Aktivität, Sonstiges), Auswahl wer bezahlt hat (aus Family)
- **Auto-Saldo** — Hero-Card zeigt automatisch berechneten Schuldbetrag (50/50 Split, N Personen) · "X schuldet Y · € Betrag"
- **Beglichen-Button** — markiert alle offenen Ausgaben auf `settled: true` in Firestore; Toast-Bestätigung
- **FAB** — "+" Floating Action Button auf Split-Screen öffnet ExpenseSheet
- **Tap-to-edit** — Tippen auf eine Ausgabe öffnet ExpenseSheet im Bearbeitungsmodus
- **Settled Section** — beglichene Ausgaben erscheinen durchgestrichen + gedimmt unterhalb der offenen Liste
- **Empty State** — 🧾 Illustration + Hinweis wenn noch keine Ausgaben vorhanden

### Changed
- **SplitScreen** — komplett auf Firestore-Daten umgestellt; statische Mock-Daten entfernt; Saldo wird live berechnet

---

## [1.5.1] — 2026-05-14

### Added
- **Link kopieren** — "Link kopieren" Row in ShareSheet kopiert die echte App-URL (`window.location.href`) in die Zwischenablage; inline Feedback: Icon wechselt zu grünem Checkmark, Label zu "Link kopiert!" für 2 Sekunden; Fallback via `execCommand` für ältere Browser

### Changed
- **ShareSheet URL-Vorschau** — zeigt jetzt die echte URL (`manuel-app.dev/wanderly`) statt Placeholder `wanderly.app/s/x7p2…`

---

## [1.5.0] — 2026-05-14

### Added
- **Share Card als Bild** — Trip als ~756×756 JPEG teilen (WhatsApp, Speichern etc.)
  - `ShareCard.jsx` — versteckte 1080×1080 Karte (position: fixed, top: -9999): Reise-Hintergrundfarbe, Sun-Glow, Bottom-Gradient, wanderly Logo + Wordmark, großes Emoji, Familien-Avatare mit Overlap-Ring, Trip-Name (Georgia serif), Route + Daten, Pill-Row (Nächte · Gesamtkosten · Flugnummer)
  - `useShareCard.js` — Hook: html2canvas (scale 0.7 → ~756px) → JPEG Blob → Web Share API mit File (iOS Share Sheet); Fallback: direkter Download
  - `ShareSheet.jsx` — neue "Als Bild teilen" Row ganz oben (terra→sun Gradient Icon); ⏳ während Generierung; `family` Prop hinzugefügt
  - `App.jsx` — `family` an `ShareSheet` weitergegeben

### Fixed
- **ShareCard Avatare** — Initialen-Schriftfarbe von cream `#FBF4E6` auf ink `#2D1F15` geändert (helle Gradient-Hintergründe machten weißen Text kaum lesbar)
- **Dateigröße** — PNG (~2 MB) → JPEG 0.92 + scale 0.7 (~100–150 KB); keine sichtbare Qualitätseinbuße auf Smartphone-Displays

---

## [1.4.2] — 2026-05-13

### Fixed
- **Firestore Write Silent Fail** — neue Trips landeten nicht in Firestore; drei Ursachen:
  1. `handleSave` in `AddTripSheet` war nicht `async` → `onAdd(newTrip)` Promise wurde nie awaited, Firestore-Fehler still geschluckt, `onClose()` lief sofort durch
  2. `extras.insurance` / `extras.rental` wurden auf `undefined` gesetzt wenn nicht aktiviert — Firestore lehnt Dokumente mit `undefined`-Werten ab und wirft `FirebaseError`
  3. Beide Bugs zusammen: Schreibfehler unsichtbar, UI verhielt sich als ob gespeichert

### Added
- **Kostenfelder im Trip-Dokument** — `costFlight`, `costHotel`, `costRental`, `costOther` werden jetzt beim Speichern in Firestore abgelegt (bisher nur für `total` verwendet, aber nicht einzeln persistiert) → Kostenaufschlüsselung in TripDetail funktioniert ab sofort für alle neuen Trips

---

## [1.4.1] — 2026-05-13

### Added
- **AIRPORTS erweitert** — 80 → 1178 Flughäfen (`large_airport` aus airport-codes Datensatz)
  - 240 hand-kuratierte deutsche Namen (DACH + Top-Destinationen: Griechenland, Spanien, Kanaren, Italien, Kroatien, Türkei, Asien, Amerika, Afrika, Australien, Ozeanien, Osteuropa)
  - 938 englische Fallback-Namen aus CSV-Datensatz (später via Wikidata übersetzbar)
- **Airport Generator Script** — `scripts/generate-airports.js` mit dreistufiger Priorität:
  1. `DE_OVERRIDES` — hand-kuratierte DACH + Top-Destinationen
  2. Wikidata SPARQL — deutsche Gemeindenamen via `wdt:P131` + `rdfs:label @de`, gecacht in `scripts/wikidata-cities.json`
  3. CSV Fallback — englische Municipalitätsnamen aus airport-codes Dataset
- **`--update` Flag** — patcht `mockData.js` direkt, kein manuelles Pipen nötig
- **`--refresh-wikidata` Flag** — holt neuen SPARQL-Stand von Wikidata
- **npm Scripts** — `npm run airports` (mit Cache) · `npm run airports:refresh` (Wikidata neu laden + update)

---

## [1.4.0] — 2026-05-13

### Changed
- **Floating Pill Tab Bar** — Tab Bar schwebt als abgerundete Pill mit Glasmorphism (blur 20px, cream 82% opacity, Schatten) losgelöst vom Inhalt; Safe Area (`env(safe-area-inset-bottom)`) berücksichtigt
- **Aktiver Tab** — leichtes terra-Highlight (`rgba(201,111,74,0.1)`) im aktiven Tab-Button
- **paddingBottom** — alle Scroll-Container angepasst (+10px) damit letzter Inhalt nicht hinter Pill verschwindet

---

## [1.3.1] — 2026-05-13

### Fixed
- **Kostenaufschlüsselung in Trip Detail** — Gesamt-Card zeigt jetzt Flüge / Unterkunft / Mietwagen / Sonstiges wenn im Budget erfasst; für ältere Trips ohne Kategorien bleibt die Card unverändert

---

## [1.3.0] — 2026-05-13

### Added
- **Search & Filter** — Lupe-Icon im HomeScreen Header öffnet Suchfeld + Filter-Chips
  - Freitext-Suche in `trip.name`, `trip.route`, `trip.short` (case-insensitive)
  - Filter-Chips: Alle · Ausstehend · Bezahlt · ✈ Flug · 🚂 Zug · 🚗 Auto
  - Slide-Down Animation beim Öffnen (240ms)
  - Bei aktiver Suche: immer Listen-Modus, vergangene Trips sichtbar
  - Empty State "Keine Reisen gefunden" mit Query-Anzeige
  - X-Icon schließt Suche und setzt Query + Filter zurück

---

## [1.2.0] — 2026-05-13

### Added
- **Firestore Integration** — App liest und schreibt live aus Firestore (`europe-west3`)
  - `src/hooks/useFirestore.js` — `useCollection` Hook mit `onSnapshot` (Realtime Updates)
  - Alle CRUD-Handler in `App.jsx` async mit Firestore writes: Add/Edit/Delete Trip, Itinerary, Family, Inbox Mark Read
  - Loading Spinner (WanderlyLogo) während Firestore-Fetch
  - `mockData.js` bleibt als Fallback und Seed-Quelle erhalten
- **Seed Script** — `scripts/seed.js` befüllt Firestore einmalig mit Mock-Daten (`npm run seed`)
- **Firestore Rules** — `firestore.rules` + `firebase.json` (open read/write, kein Auth)

### Fixed
- **Stack Badge** — "+X weitere · alle zeigen" erscheint jetzt korrekt bei mehr als 4 Trips (Bedingung war `upcoming.length` statt `sorted.length`)

### Changed
- **InboxScreen** — `setItems` durch `onMarkRead` Prop ersetzt (schreibt `{ read: true }` nach Firestore mit `merge: true`)

---

## [1.1.0] — 2026-05-13

### Added
- **Vite + React App** — Prototype 1:1 als echte Web-App umgesetzt (Claude Code Handoff)
  - 13 Komponenten: `Ic`, `StatusBar`, `TabBar`, `TravelDoc`, `WanderlyLogo`, `DocsSheet`, `ShareSheet`, `AddTripSheet`, `DeleteConfirmSheet`, `FamilyEditSheet`, `ActivitySheet`, `Toast`, `Progress`
  - 6 Screens: `HomeScreen`, `TripDetail`, `ItineraryScreen`, `InboxScreen`, `SplitScreen`, `MeScreen`
  - `App.jsx` — State-basierter Router mit direction-aware Screen-Transitions (slideInRight/Left/Up/fade · 320ms cubic-bezier iOS-style)
  - `src/styles/shared.js` — gemeinsames Style-Objekt (S)
  - `src/styles/tokens.js` — Design Tokens (Farben, Fonts)
  - `src/utils/dateHelpers.js` — `fmtDate`, `nightsBetween`
  - `src/firebase.js` — Firebase init via `VITE_FIREBASE_*` Env-Vars
- **GitHub Actions Deploy** — Push auf `main` → `npm run build` → `gh-pages` → live unter `ieeks.github.io/wanderly`
- **`.env.local.example`** — Template für Firebase Credentials

### Changed
- **iOS Device Frame entfernt** — App rendert direkt ohne Phone-Rahmen (`max-width: 430px; margin: 0 auto; height: 100dvh`)
- **Icons** — Inline-SVGs durch `lucide-react` ersetzt (via `Ic`-Wrapper)
- **Dateistruktur** — Einzelne JSX-Datei aufgeteilt in components/ + screens/ + data/ + styles/ + utils/

---

## [1.0.0] — 2026-05-13

### Added
- **Itinerary CRUD** — vollständige Tagesplan-Verwaltung:
  - `buildDays()` — generiert Tage automatisch aus `trip.dates` + `trip.short` (z.B. "7 Nächte" → 8 Tage); bestehende Wachau-Daten werden eingemappt
  - `ActivitySheet` — Bottom Sheet für Add + Edit:
    - Uhrzeit (optional), Titel (Pflichtfeld), Beschreibung (optional)
    - 14 Icon-Kategorien als visueller Picker: Auto, Flug, Zug, Schiff, Hotel, Essen, Natur, Kultur, Weingut, Spazieren, Shopping, Pause, Highlight, Sonstiges
    - Save-Button disabled bis Titel ausgefüllt
  - Edit: Tap auf Aktivität → Sheet mit Prefill
  - Delete: Trash-Button + inline Bestätigung im Sheet
  - Auto-Sort nach Uhrzeit beim Speichern
  - Leerer Tag zeigt klickbaren Platzhalter "erste Aktivität hinzufügen"
  - `onUpdateTrip` handler — Änderungen werden sofort in App-State gespiegelt
  - Itinerary-Teaser in Trip Detail jetzt für alle Trips sichtbar (nicht nur wenn Daten vorhanden)
  - `ShoppingBag` Icon ergänzt

### Fixed
- **FAB verdeckt** — `zIndex` von 6 → 25; FAB liegt jetzt garantiert über den Trip-Karten und der TabBar

### Changed
- **Prototype vollständig** — alle geplanten Features vor Claude Code Handoff umgesetzt

---

## [0.9.0] — 2026-05-13

### Added
- **Family/Reisende CRUD** — Personen verwalten im Me-Screen:
  - `FamilyEditSheet` mit Live Avatar-Vorschau (Initialen + Farbe sofort sichtbar)
  - Name, Initialen (max 2 Zeichen, auto uppercase), 8 Farb-Optionen (Peach, Sage, Sky, Plum, Sun, Terra, Mist, Rose)
  - Add / Edit / Delete (inline Bestätigung im Sheet, kein separater Confirm-Sheet)
  - `UserPlus` / `UserMinus` Icons ergänzt
  - `family`-State in App geliftet — Änderungen reflektieren sich sofort in Boarding Pass, Split & Settle
  - Me-Screen "Reisende" Sektion mit Avatar-Liste + "+" Button oben rechts
  - `TravelDoc`, `SplitScreen`, `TripDetail` nutzen jetzt `family` Prop statt Konstante

### Fixed
- **Karten in Tab Bar** — Stack-Container `height` von 356 → 400px erhöht; TabBar `zIndex` 5 → 20; `paddingBottom` 100 → 120px damit letzte Karte nicht hinter Tab Bar verschwindet

### Changed
- **Boarding Pass Fullscreen** — aus Prototype-Scope entfernt, in v1 App Roadmap verschoben (sinnvoll erst als PWA mit `screen.wakeLock`)

---

## [0.8.0] — 2026-05-12

### Added
- **Edit Trip Flow** — `AddTripSheet` mit Prefill-Logik:
  - Öffnet sich mit allen bestehenden Werten vorausgefüllt (Name, Emoji, Farbe, Daten, Anreise, Hotel, Budget)
  - Datumskonvertierung: "7 Jun" → ISO `2026-06-07` für Datepicker
  - Flughafen-Query wird aus bestehendem `flight.to` + `flight.toCity` rekonstruiert
  - Budget wird anteilig geschätzt (35% Flüge, 55% Hotel, 10% Mietwagen)
  - Header zeigt "Bearbeiten · Schritt 1/4" statt "Neue Reise"
  - Speichern-Button: "Änderungen speichern" statt "Reise speichern"
  - `onSave` überschreibt bestehenden Trip via ID, `onAdd` legt neuen an
  - Itinerary bleibt beim Bearbeiten erhalten
- **Empty State HomeScreen** — wenn `trips.length === 0`:
  - Großes Logo-Icon (90px) mit schwebenden Emojis (✈ 🏖 🗺, CSS float-Animation)
  - "Noch keine Reisen" + einladender Beschreibungstext
  - Primärer CTA-Button "Erste Reise anlegen"
  - Sekundärer Hint "oder Gmail Sync aktivieren → automatisch"
  - Budget-Summary, Stapel/Liste-Toggle und Hint ausgeblendet
- **Notification Badge** — Unread-Count am Inbox-Tab-Icon:
  - Roter Kreis mit weißem Border, zeigt Zahl (max "9+")
  - `inboxItems`-State aus `InboxScreen` in `App` geliftet
  - `unreadCount` wird als `inboxBadge` Prop an alle Screens mit TabBar weitergegeben
  - Badge verschwindet (`badges={}`) wenn Inbox aktiv ist
  - Lesen einer Mail → Badge sinkt sofort auf allen Screens

### Changed
- **CRUD vollständig** — Create ✅ Read ✅ Update ✅ Delete ✅
- **Nachname entfernt** — keine persönlichen Nachnamen mehr in den Projektdateien

### Fixed
- **E-Mail-Adressen** — Platzhalter-Adressen statt echter Domain

---

## [0.7.0] — 2026-05-12

### Added
- **Screen Transitions** — direction-aware Animationen beim Seitenwechsel:
  - Push (Home → Detail → Itinerary): slideInRight
  - Pop (Zurück): slideInLeft
  - Tab-Wechsel: links/rechts je nach Tab-Reihenfolge (Trips→Inbox→Familie→Ich)
  - Sonstiges (z.B. Me → Detail): fadeIn
  - Timing: 320ms `cubic-bezier(0.32, 0.72, 0, 1)` — identisch mit iOS
- **wanderly Logo** — SVG-Komponente mit zwei Varianten:
  - Icon-only (quadratisch, für kleine Größen)
  - Horizontal mit Wordmark (Icon links + "wanderly" rechts)
  - Integriert in HomeScreen Header, Add Trip Sheet, Share Sheet OG Preview, Me Screen
- **`WanderlyLogo` Komponente** — skaliert vollständig proportional via `size` Prop

### Changed
- **HomeScreen Header** — Avatar (M) entfernt, Logo steht allein linksbündig — cleaner

### Fixed
- **Logo Abschneiden** — viewBox-Berechnung für Wordmark-Variante korrigiert; war vertikal gestapelt mit falschem viewBox, jetzt horizontales Layout ohne Clipping
- **Logo Wordmark Breite** — `wordW` auf `fontSize * 4.8` geändert statt `size * 2.1`; "wanderly" wurde vorher als "wanderl" abgeschnitten

---

## [0.6.0] — 2026-05-12

### Added
- **Delete Trip** — Bestätigungs-Sheet mit rotem Löschen-Button; versehentliches Löschen verhindert
- **Edit/Delete Menü** — ··· Button im Trip-Detail Header öffnet Dropdown mit "Bearbeiten" und "Löschen"
- **Vergangene Trips** — im Listen-Modus mit "Vergangen"-Trennlinie und 60% Opacity; im Stapel-Modus ausgeblendet
- **Airport-Suche** — 80+ Flughäfen durchsuchbar nach Stadtname oder IATA-Code (inkl. TFN Teneriffa Nord, HND/NRT Tokio, etc.)
- **VIE fix** — Abflughafen Wien-Schwechat ist im Add-Trip-Flow nicht mehr editierbar
- **Route auto-fill** — Route immer "Wien → Reiseziel" aus Schritt 1, kein manuelles Eingabefeld mehr
- **Add Trip Flow erweitert auf 4 Schritte** — Unterkunft (Hotel, Check-in/out, Extras-Toggle) als neuer Schritt 3 eingefügt
- **Budget aufgeschlüsselt** — Schritt 4 trennt Flüge / Unterkunft / Mietwagen / Sonstiges; Gesamtsumme automatisch berechnet
- **Mietwagen im Budget** — erscheint nur wenn in Schritt 3 aktiviert

### Fixed
- **Trips State Bug** — neue Trips (z.B. Japan) öffneten immer Ibiza; `TripDetail`, `DocsSheet`, `ShareSheet` und `ItineraryScreen` suchten in statischem `TRIPS`-Array statt im `trips`-State
- **TFN fehlend** — Teneriffa Nord (Los Rodeos) war nicht in der Flughafen-Datenbank

---

## [0.5.0] — 2026-05-12

### Added
- **Add Trip Flow** — 3-Schritt Bottom Sheet (initial):
  - Schritt 1: Name, Emoji (12 Auswahl), Kartenfarbe (5 Varianten), Daten + Live-Vorschau
  - Schritt 2: Anreise-Typ (Flug/Zug/Auto) mit typ-spezifischen Detail-Feldern
  - Schritt 3: Budget (Gesamtbetrag + bezahlt)
- **FAB** — Floating Action Button (+) auf HomeScreen
- **Datum-Formatierung** — neue Trips zeigen "7 Jun" statt "2026-06-07"
- **Chronologische Sortierung** — Trips werden nach Startdatum sortiert (erkennt beide Datumsformate)

### Fixed
- **Stapel-Overflow** — bei mehr als 4 Trips im Stapelmodus wurden untere Karten sichtbar; jetzt nur STACK_VISIBLE=4 Karten dargestellt
- **"Weitere" Badge** — Klick öffnete fälschlicherweise die darunter liegende Trip-Karte statt in den Listen-Modus zu wechseln; `stopPropagation` + `setExpanded(true)` ergänzt
- **Listen-Modus Scroll** — war nicht scrollbar bei vielen Trips; komplett getrennte Render-Logik (kein `position:absolute` mehr)

---

## [0.4.0] — 2026-05-12

### Added
- **Dokumente Sheet** — Bottom Sheet pro Trip mit PDF-Liste (Flugticket, Buchungsbestätigung, Versicherung, Mietwagen); Status-Badges, QR + Download Buttons, "Alle exportieren"
- **Dokumente Button** — im Trip-Detail CTA-Bereich verdrahtet
- **Weiße Ringe** — Avatar-Initialen im Boarding Pass und Split-Screen mit `box-shadow`-Ring

### Fixed
- **CTA Buttons** — "Dokumente" und "Teilen" hatten unterschiedliche Höhen; explizites `height: 50` gesetzt
- **Icons leer** — Pill-Buttons (Zurück, Herz, Teilen) zeigten keine Icons; `React.cloneElement` mit expliziten `width`/`height`/`stroke` Props

---

## [0.3.0] — 2026-05-12

### Added
- **Inbox Screen** — geparste E-Mails mit Unread-Dots, Absender, Betreff, Vorschau, Trip-Tag-Badges; Tap markiert als gelesen und öffnet den zugehörigen Trip
- **Itinerary Screen** — Tag-für-Tag Timeline mit Icons, Zeitangaben und Beschreibungen (Wachau vollständig befüllt)
- **Itinerary-Teaser** — im Trip-Detail als Card mit Aktivitäten-Anzahl (nur wenn Daten vorhanden)
- **Me / Settings Screen** — Profil-Header mit Badges, 3 Einstellungs-Sektionen (Konto, Daten, App), Gmail-Sync Status
- **Split & Settle Screen** — Kostenaufteilung Familie mit Saldo, Ausgaben-Liste und "an Olga"-Button
- **BYD Seal U** — im Roadtrip-Boarding-Pass statt "Octavia"
- **Ankunftszeiten** — bei Flügen ergänzt (neben Abflug)

### Changed
- **Tab Bar Icons** — von Emoji auf Lucide SVGs umgestellt (Briefcase, Inbox, Users, CircleUser)

---

## [0.2.0] — 2026-05-12

### Added
- **Lucide Icons** — alle UI-Icons als inline SVGs via `React.cloneElement`; Vibe-Emojis (☀ 🫒 🍇 ❄) bleiben
- **iOS Device Frame** — simuliertes iPhone mit Dynamic Island, Statusbar, Home Indicator
- **Share Sheet** — read-only Link, WhatsApp, Familie-Gruppe, AirDrop, Link kopieren; Preis-verstecken + Ablaufdatum Toggles
- **Toast** — Bestätigung nach erfolgreichem Teilen
- **TravelDoc** — Boarding Pass (Flug), ÖBB-Ticket (Zug), Drive-Card (Auto) je nach Trip-Typ

### Fixed
- **JSX Syntax Error** — `size:11` statt `size={11}` in Versicherungs-Card

---

## [0.1.0] — 2026-05-12

### Added
- **Initiales Prototype** — React JSX Artifact, single file
- **HomeScreen** — Card-Stapel mit Fan-Animation, Budget-Summary, Stapel/Liste-Toggle
- **TripDetail** — Hero-Header, Boarding Pass, Hotel-Card, Extras-Grid (Versicherung, Mietwagen, Skipass, Restaurant), Gesamt-Card
- **TabBar** — Trips / Inbox / Familie / Ich
- **Design System** — Cream/Paper/Ink Farben, Newsreader + Manrope + JetBrains Mono
- **Mock-Daten** — 4 Trips (Wachau, Halkidiki, Ibiza, Tirol), 4 Familienmitglieder

---

[Unreleased]: https://github.com/ieeks/wanderly/compare/v1.9.0...HEAD
[1.9.0]: https://github.com/ieeks/wanderly/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/ieeks/wanderly/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/ieeks/wanderly/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/ieeks/wanderly/compare/v1.5.1...v1.6.0
[1.5.1]: https://github.com/ieeks/wanderly/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/ieeks/wanderly/compare/v1.4.2...v1.5.0
[1.4.2]: https://github.com/ieeks/wanderly/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/ieeks/wanderly/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/ieeks/wanderly/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/ieeks/wanderly/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/ieeks/wanderly/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/ieeks/wanderly/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/ieeks/wanderly/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ieeks/wanderly/compare/v0.9.0...v1.0.0
[0.9.0]: https://github.com/ieeks/wanderly/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/ieeks/wanderly/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/ieeks/wanderly/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/ieeks/wanderly/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/ieeks/wanderly/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/ieeks/wanderly/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/ieeks/wanderly/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/ieeks/wanderly/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/ieeks/wanderly/releases/tag/v0.1.0
