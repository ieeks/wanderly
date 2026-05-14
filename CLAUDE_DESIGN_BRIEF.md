# wanderly · Design Brief für Claude Design
## Auftrag: Desktop-Version gestalten

---

## Was ist wanderly?

Persönliches Familien-Reise-Dashboard. Fasst alle Trips an einem Ort: Flüge, Hotels, Itinerary, Dokumente, Kosten, Teilen. Keine Ads, kein Login für Mitlesende, eigene Firebase-Infrastruktur.

**Nutzer:** Familie (4 Personen) — Manuel, Olga, Michael, Alexander  
**Live:** `manuel-app.dev/wanderly`  
**Stack:** React + Vite + Firebase Firestore  

---

## Design System · "Quiet Warm"

### Farben
```
--cream:   #FBF4E6   Background (warm off-white)
--paper:   #FFFAF1   Cards
--ink:     #2D1F15   Text (dark brown, not black)
--ink2:    #5A4533   Secondary text
--muted:   #9F8A6F   Labels, captions
--line:    #EADFC4   Dividers
--terra:   #C96F4A   Primary CTA (warm orange-red)
--sun:     #E6B545   Accent / Warning
--sage:    #8AA074   Success / Paid / Done
--sky:     #7BA8B8   Info
--plum:    #9C6377   Alt accent
```

### Typografie
```
Display / Zahlen:  Newsreader (Serif, italic mood) — große Titel, Euro-Beträge
Body / UI:         Manrope (Sans, clean) — Buttons, Labels, Fließtext
Labels / Codes:    JetBrains Mono — IATA-Codes, Daten-Labels, Monospace-Details
```

### Stil-Prinzipien
- Viel Weißraum, warm aber nicht kitschig
- Karten mit `border-radius: 20–26px`, subtiler Box-Shadow
- Keine harten Schatten, kein Material Design
- Gradients für Trip-Cards (je Trip eine Farbe)
- Florale Deko-Elemente (✿) als Hintergrund-Akzente
- Monospace-Labels in UPPERCASE mit letter-spacing für Metadaten

---

## Aktuelle Mobile Screens (alle live)

### 1. Home Screen
- Trip-Cards als Stapel (Standard) oder Liste (Toggle)
- Chronologisch sortiert, vergangene Trips getrennt
- FAB (+) → Add Trip Sheet
- Empty State mit Logo + floating Emojis

### 2. Trip Detail
- Boarding Pass / Zugticket / Fahrt-Card (je nach Anreise-Typ)
- Hotel-Card, Extras (Versicherung, Mietwagen)
- Budget-Übersicht (Flüge / Hotel / Mietwagen / Rest)
- ··· Menü → Bearbeiten / Löschen
- Buttons: Itinerary, Dokumente, Teilen

### 3. Itinerary Screen
- Tag-für-Tag Tagesplan, Timeline
- Add / Edit / Delete Aktivitäten
- 14 Kategorien (Flug, Zug, Auto, Essen, Hotel, Kultur, Natur, …)
- Auto-Sort nach Uhrzeit

### 4. Inbox Screen
- Auto-geparste E-Mails (Flugtickets, Buchungsbestätigungen)
- Unread-Dots, Trip-Tags, Notification Badge im Tab
- Tap → als gelesen markieren, Trip öffnen

### 5. Split & Settle Screen
- Ausgaben-Liste aus Firestore (Add/Edit/Delete)
- 8 Kategorien: Flug, Unterkunft, Restaurant, Mietwagen, Versicherung, Shopping, Aktivität, Sonstiges
- Hero-Card: auto-berechneter Saldo ("Olga schuldet Manuel € 248,03")
- "Beglichen" Button → markiert alle als settled
- Settled-Ausgaben erscheinen durchgestrichen + gedimmt

### 6. Me / Settings Screen
- Profil-Card mit Avatar
- Familie-Liste (Add/Edit/Delete Reisende, 8 Farben)
- Gmail-Sync Status

---

## Bottom Sheets (modale Overlays)
Alle Sheets haben Swipe-to-close (nach unten ziehen ≥ 100px).

- **Add/Edit Trip Sheet** — 4-Schritt Flow: Basics → Anreise (1178 Airports) → Unterkunft → Budget
- **Share Sheet** — Bild teilen (html2canvas JPEG), WhatsApp, AirDrop, Link kopieren (kopiert `/#trip_ibizaApr26`)
- **Docs Sheet** — PDF-Liste pro Trip
- **Expense Sheet** — Ausgabe hinzufügen/bearbeiten
- **Activity Sheet** — Itinerary-Aktivität bearbeiten
- **Family Edit Sheet** — Reisenden bearbeiten
- **Delete Confirm Sheet** — Löschbestätigung

---

## Navigation
Tab Bar (unten, floating, blur-Hintergrund):
```
Home  ·  Inbox (Badge)  ·  Split  ·  Ich
```
Kein Side-Nav, kein Header-Nav — alles Tab + Back-Button.

---

## Datenstrategie
- Trips, Family, Inbox, Expenses → Firestore Realtime (onSnapshot)
- Bilder → html2canvas → JPEG Share Card (1080×1080 → scale 0.7 → ~756px)
- Deep Links: `manuel-app.dev/wanderly/#trip_ibizaApr26`

---

## Beispiel-Trips (für Designs)
```
Wachau      · 12–14 Apr · Autofahrt · Pension · € 480 · bezahlt ✓
Halkidiki   · 7–14 Jun  · Flug VIE→SKG · Potidea Palace · € 3.767 · € 2.198 offen
Ibiza       · 10–17 Aug · Flug VIE→IBZ · Finca Alegria  · € 5.240 · € 5.240 offen
(geplant)   · Ibiza 2   · Jul 26 · zweiter Ibiza-Trip (Beispiel für doppelte Destination)
```

---

## Auftrag: Desktop-Version

Die aktuelle App ist **ausschließlich mobile** (max-width: 430px, Phone-Layout).

### Ziel
Responsive Desktop-Layout das dieselben Inhalte sinnvoll auf ≥ 1024px darstellt.

### Überlegungen für Desktop
- **2-Spalten oder 3-Spalten Layout** — z.B. Sidebar-Navigation links, Content in der Mitte, Detail rechts
- **Tab Bar** wird zu Side-Navigation (oder Top-Nav)
- **Bottom Sheets** könnten zu Modal-Dialogen oder Side-Panels werden
- **Trip-Cards** können breiter / mehr nebeneinander sein
- **Boarding Pass** könnte im Querformat dargestellt werden
- **Split & Settle** könnte eine Tabellen-Ansicht bekommen
- **Itinerary** könnte als Kalender- oder Wochen-Ansicht dargestellt werden

### Design System bleibt gleich
Dieselben Farben, Fonts, Radius, Shadows — nur das Layout ändert sich.

### Screenshots der aktuellen Mobile App
→ Bitte Screenshots von `manuel-app.dev/wanderly` beifügen (Home, Trip Detail, Split, Inbox, Me)

---

*wanderly · Familie · Mai 2026 · v1.6.0*
