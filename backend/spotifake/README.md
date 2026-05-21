# 🎧 Spotifake Backend

Dieses Backend wurde nach dem Muster des Schul-Referenzprojekts (`authorization_express`) erstellt und implementiert einen Spotify-Clone.

## 🚀 Features

- **Benutzerverwaltung**: Registrierung, Login, JWT-Authentifizierung.
- **Song-Management**: Upload von MP3-Dateien via Multer.
- **Audio-Streaming**: Unterstützung von Range-Requests für flüssiges Streaming.
- **Playlists**: Erstellen, Bearbeiten, Songs hinzufügen/entfernen.
- **Interaktionen**: Liken von Songs, Abruf der gelikten Songs.
- **Listening History**: Speicherung und Abruf der Hörhistorie.
- **Suchfunktion**: Suche nach Titel, Artist oder Album.
- **Echtzeit (WebSockets)**: Live-Listener-Statistiken und Event-Übertragung.
- **Dokumentation**: Swagger/OpenAPI Endpunkt unter `/api-docs`.

## 📂 Architektur

Das Projekt folgt dem **MVC / Service / Repository** Pattern:
- `controllers/`: HTTP Handling (Request/Response)
- `services/`: Business Logik ("Services denken")
- `repositories/`: Datenzugriff ("Repositories speichern")
- `models/`: Mongoose Schemas (MongoDB)
- `middleware/`: Auth, Logging, Error Handling
- `routes/v1/`: API Routen Definitionen

## 🛠️ Installation & Start

1. **Abhängigkeiten installieren**:
   ```bash
   cd backend/spotifake
   npm install
   ```

2. **Umgebung konfigurieren**:
   Passen Sie die `.env.dev` Datei an (insbesondere `MONGO_URI` und `JWT_SECRET`).

3. **Server starten**:
   ```bash
   npm start
   ```

## 🐳 Docker Setup

Du kannst das gesamte System (API + MongoDB) auch mit Docker starten:

1. **Docker Compose starten**:
   ```bash
   docker-compose up --build
   ```

Die API ist dann wie gewohnt unter `http://localhost:3000` erreichbar.

## 🔗 API Dokumentation

Sobald der Server läuft, ist die interaktive Dokumentation hier verfügbar:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## ⚡ WebSockets

Verbinden Sie sich mit `socket.io` auf `http://localhost:3000`.
Verfügbare Events:
- `play_song`: Sende `{ songId, currentTime, userId }` wenn ein Song abgespielt wird.
- `stats_update`: Empfange `{ listeners }` für Live-Statistiken.
- `user_playing`: Empfange Updates von anderen Usern.
