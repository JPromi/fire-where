# Willkommen zu Fire Where

## Warum Fire Where?
### Beschriebung
**Fire Where** zeigt dir in fast ganz Österreich alle Einsätze der Feuerwehren an.
Die Daten hierfür werden von [`JPromi/operation-point`](https://github.com/JPromi/operation-point) geladen.

### Name
Der Name **Fire Where**, übersetzt auf Deutsch "Feuer Wo", beschreibt das Hauptziel dieser App, anzuzeigen wo in Österreich gerade ein Feuerwehr Einsatz ist.
Außerdem soll es noch von der Aussprache ähnlich klingen wie "Feiawehr", welches im Wiener und Nierösterreichischen Raum für "Feuerwehr" verwendet wird.

### Warum?
Nachdem für Niederösterreich die App [Grisu](https://github.com/Grisu-NOE/mobile-app) 2025 Archiviert wurde und es keinen Nachfolger gab, habe ich mit der Entwicklung der **Fire Where** App begonnen, die Idee war alle Öffentlichen Daten der Einsatzdaten der Feuerwehren in einer modernen App anzuzeigen.

---

## Development

### Requirements
- [Operation Point](https://github.com/JPromi/operation-point) Backend (data Origin)
- MacOS for iOS build

### Setup
1. Install `npm`, `node.js`
2. Install packages `npm install`
3. Copy `constants/Config.example.ts` to `constants/Config.ts` and change the values.
4. Start expo server `npm start`