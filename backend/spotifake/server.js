import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import fs from 'fs';

// Unsere Routen laden (wir nennen sie orderRoute wie im Beispiel)
import { router as apiRouter } from './routes/v1/orderRoute.js';
import logging from './middleware/logging.js';
import errorHandling from './middleware/errorHandling.js';

import openapiSpecification from './generateOpenAPI.js';
import swaggerUi from 'swagger-ui-express';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spotifake';

// Ordner für Musik erstellen
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

// Datenbank verbinden
mongoose.connect(MONGO_URI).then(() => console.log('✅ Datenbank bereit!'));

// Middleware einstellen
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logging);

// Swagger Doku (unter /api-docs aufrufbar)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Eine einfache Startseite, damit man nicht "Cannot GET /" sieht
app.get('/', (req, res) => {
    res.send('<h1>🎧 Spotifake API läuft!</h1><p>Gehe zu <a href="/api-docs">/api-docs</a> für die Dokumentation.</p>');
});

// UNSERE API BENUTZEN (unter /api/v1)
app.use('/api/v1', apiRouter);

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
