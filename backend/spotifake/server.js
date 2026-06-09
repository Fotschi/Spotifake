import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import fs from 'fs';

// Unsere Routen laden (wir nennen sie orderRoute wie im Beispiel)
import { router as apiRouter } from './routes/v1/orderRoute.js';
import { router as playlistRouter } from './routes/v1/playlistRoute.js';
import logging from './middleware/logging.js';
import errorHandling from './middleware/errorHandling.js';

import openapiSpecification from './generateOpenAPI.js';
import swaggerUi from 'swagger-ui-express';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spotifake';

// Ordner für Musik erstellen
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

// Datenbank verbinden
mongoose.connect(MONGO_URI).then(() => console.log('  Datenbank ist ready'));

// Middleware einstellen
app.use(helmet({
    contentSecurityPolicy: false, // Deaktiviert CSP für einfachere Entwicklung/Demo
}));
app.use(cors());
app.use(express.json());
app.use(logging);

// Statische Dateien (Angular App)
app.use(express.static(path.join(__dirname, 'public')));

// Uploads Ordner freigeben (für Bilder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger Doku (unter /api-docs aufrufbar)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Api nutzen (unter /api/v1)
app.use('/api/v1', apiRouter);
app.use('/api/v1/playlists', playlistRouter);

// SPA Routing: Alle anderen Anfragen an index.html senden
app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WEBSOCKETS (Echtzeit)
io.on('connection', (socket) => {
    socket.on('play_song', (data) => {
        io.emit('user_playing', data); // Allen sagen wer was hört
    });
});

app.use(errorHandling);

httpServer.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
