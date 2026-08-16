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
3. Copy `.env.example` to `.env` and change the values.
4. Start expo server `npm start`

### Version setzen
Ändere in den folgenden Datein die Version
- `package.json`
- `package-lock.json`
- `app.json`

### Browser Redirect
Ändere die Folgenden werte um aufrufe der Webanwendungen automatisch auf die App zu redirecten:

Datei: [/android/app/src/main/AndroidManifest.xml](/android/app/src/main/AndroidManifest.xml)
1. Ändere im Folgenden Block die URL von `app.fire-where.at` zu deiner Domain:
```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />

  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />

  <data
      android:scheme="https"
      android:host="app.fire-where.at" /> <!-- HIER ÄNDERN -->
</intent-filter>
```

\
Datei: [/public/.well-known/assetlinks.json](/public/.well-known/assetlinks.json)
1. `package_name` zu deinem Package name (z.B. com.jpromi.firePoint)
2. `sha256_cert_fingerprints` ändere das zu deinem Google Play App-Signaturschlüssel [Anleitung](https://developer.android.com/training/app-links/faq)

\
Datei: [/public/.well-known/apple-app-site-association](/public/.well-known/apple-app-site-association)
1. Suche deine Apple Developer Team ID aus deinem [Developer Account](https://developer.apple.com/account#MembershipDetailsCard) raus.
2. Ersetze die appIDs mit deiner, diese besteht aus `Team ID.Package name` (z.B. `ABC1234567.com.jpromi.firePoint`)