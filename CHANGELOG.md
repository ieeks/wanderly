# Changelog

Alle relevanten Änderungen an wanderly werden hier dokumentiert.

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

---

## [Unreleased]

### Planned · v1 App · nächste Schritte
- Add / Edit Trip → Firestore persistieren (statt Mock-Daten)
- Search / Filter — Trips nach Jahr, Status, Destination
- PDF Viewer — in-app PDF öffnen
- WhatsApp Deep Link (echte wa.me URL)
- Boarding Pass Fullscreen — Vollbild für Gate · QR · screen.wakeLock
- Gmail Sync: Label `Reisen` → IMAP → GPT-4o-mini → Firestore
- Desktop Version

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

[Unreleased]: https://github.com/ieeks/wanderly/compare/v1.1.0...HEAD
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
