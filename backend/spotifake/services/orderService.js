import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// immer model impotieren sonst mongoose schreit rum
import User from '../models/User.js'; 
import songRepository from '../repositories/songRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'spotifake_geheimnis_123';

/***** Merksatz: ****
*   Services denken.*
*********************/

// Alle wichtigen Funktionen für Controller kommt da hin. Controller ruft Service auf, Service ruft Repository auf, Repository ruft Datenbank auf.
const service = {
    // --- AUTH (USER) ---
    register: async (username, password) => {
        if (!username || !password) return { error: 'Name und Passwort fehlen!' };
        
        // Check if user already exists
        const User = mongoose.model('User');
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return { error: 'Benutzername schon vergeben!' };
        }
        
        // Passwort verschlüsseln
        const passwordHash = await bcrypt.hash(password, 10);
        
        // In die Datenbank speichern (via UserRepository)
        const newUser = new User({ username, passwordHash });
        const savedUser = await newUser.save();
        
        // Return nur ID und Username, NICHT das Password Hash
        return { 
            success: true, 
            user: { 
                id: savedUser._id, 
                username: savedUser.username 
            } 
        };
    },

    login: async (username, password) => {
        const User = mongoose.model('User');
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return { error: 'Falsche Zugangsdaten!' };
        }

        // Token erstellen mit User-ID und Name als Payload
        const payload = { sub: user._id, username: user.username };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h', jwtid: uuidv4() });
        
        return { token: token, user: { id: user._id, username: user.username } };
    },

    // --- SONGS ---
    getSongs: async (query) => {
        // Wenn ein Suchbegriff da ist, suchen wir danach, sonst halt alle
        if (query) {
            return await songRepository.search(query);
        }
        return await songRepository.findAll();
    },

    uploadSong: async (title, artist, file, imageFile, userId) => {
        if (!file) return { error: 'Keine Audiodatei hochgeladen!' };

        // Pfad für das Bild aufbereiten (Backslashes zu Slashes für URLs)
        const imagePath = imageFile ? imageFile.path.replace(/\\/g, '/') : null;

        // Song-Daten in die Datenbank schreiben
        return await songRepository.create({
            title,
            artist,
            filePath: file.path,
            imagePath: imagePath,
            mimetype: file.mimetype,
            uploadedBy: userId
        });
    },

    updateSong: async (id, data) => {
        const updated = await songRepository.update(id, data);
        if (!updated) return { error: 'Song nicht gefunden' };
        return updated;
    },

    deleteSong: async (id) => {
        const song = await songRepository.findById(id);
        if (!song) return { error: 'Song nicht gefunden' };

        // Datei auch vom Dateisystem löschen
        if (fs.existsSync(song.filePath)) {
            fs.unlinkSync(song.filePath);
        }

        return await songRepository.delete(id);
    },

    getStream: async (id, range) => {
        const song = await songRepository.findById(id);
        if (!song) return null;

        const filePath = song.filePath;
        
        if (!fs.existsSync(filePath)) {
            console.log('Datei wurde nicht gefunden: ', filePath);
            return null;
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;

        // Streaming-Logik (Häppchenweise senden)
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const fileStream = fs.createReadStream(filePath, { start, end });
            
            return {
                status: 206, // Partial Content
                headers: {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': song.mimetype || 'audio/mpeg',
                },
                stream: fileStream
            };
        } else {
            return {
                status: 200,
                headers: {
                    'Content-Length': fileSize,
                    'Content-Type': song.mimetype || 'audio/mpeg',
                },
                stream: fs.createReadStream(filePath)
            };
        }
    }
};

export default service;
