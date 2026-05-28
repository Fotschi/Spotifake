# Spotifake - Musik-Streaming Plattform

Spotifake ist eine Full-Stack Musik-Streaming Anwendung, die mit Angular (Frontend) und Express.js (Backend) entwickelt wurde. Die Anwendung unterstützt Echtzeit-Benachrichtigungen via WebSockets und ist vollständig containerisiert.

## Features

### Backend (Express.js)
- **REST-API:** Vollständige CRUD-Funktionalität für Songs.
- **Authentifizierung:** JWT-basierte Anmeldung und Registrierung.
- **SwaggerUI:** API-Dokumentation erreichbar unter `/api-docs`.
- **WebSocket-Server:** Echtzeit-Updates, wenn User Songs abspielen.
- **Streaming:** Effizientes Audio-Streaming mittels Node.js Streams.

### Frontend (Angular)
- **Moderne UI:** Inspiriert von Spotify, entwickelt mit Angular Signals.
- **Musik-Player:** Integrierter Player mit Fortschrittsanzeige (Simuliert).
- **Admin-Bereich:** Verwaltungsoberfläche zum Hochladen, Bearbeiten und Löschen von Songs.
- **Echtzeit-Events:** Live-Benachrichtigungen über WebSocket-Ereignisse anderer User.

### Infrastruktur (Docker)
- **Containerisierung:** Multi-Stage Dockerfile für Frontend und Backend.
- **Orchestrierung:** Docker Compose für App und MongoDB.
- **Datenbank:** MongoDB zur Speicherung von Usern und Song-Metadaten.

## Installation & Start

### Voraussetzungen
- Docker & Docker Compose installiert.

### Befehle
1. **Container starten:**
   ```bash
   docker-compose up --build
   ```
2. **Datenbank initialisieren (optional):**
   Führe im laufenden App-Container folgendes aus:
   ```bash
   docker exec -it spotifake-app node seed.js
   ```

Die Anwendung ist anschließend unter [http://localhost:3000](http://localhost:3000) erreichbar.

## API Dokumentation
Die Swagger-Dokumentation findest du unter:
`http://localhost:3000/api-docs`

## Projektstruktur
- `/backend/spotifake`: Express Server, Routen, Controller, Modelle.
- `/frontend/Spotifake`: Angular Anwendung.
- `docker-compose.yml`: Orchestrierung.
- `Dockerfile`: Multi-Stage Build Konfiguration.
