import service from '../services/orderService.js';

/********* Merksatz: **********
*  Controller sprechen HTTP.  *
******************************/

// Da sind die Aufgaben vom Browser (Request/Response)
const controller = {
    // LOgin und Register
    register: async (req, res) => {
        const result = await service.register(req.body.username, req.body.password);
        if (result.error) return res.status(400).json(result);
        // Registration successful
        res.status(201).json({ success: true, message: 'Benutzer erfolgreich registriert!' });
    },

    login: async (req, res) => {
        const result = await service.login(req.body.username, req.body.password);
        if (result.error) return res.status(401).json(result);
        res.json(result);
    },

    // Songs abrufen
    getSongs: async (req, res) => {
        const query = req.query['q'];
        const songs = await service.getSongs(query);
        res.json(songs);
    },

    // Song hochladen
    upload: async (req, res) => {
        const { title, artist } = req.body;
        const songFile = req.files && req.files['song'] ? req.files['song'][0] : null;
        const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
        
        if (!songFile) return res.status(400).json({ error: 'Keine Audiodatei hochgeladen!' });

        const result = await service.uploadSong(title, artist, songFile, imageFile, req.user?.id);
        res.status(201).json(result);
    },

    // Song aktualisieren
    update: async (req, res) => {
        const { title, artist } = req.body;
        const dataToUpdate = { title, artist };
        
        // Wenn ein neues Bild hochgeladen wurde, fügen wir den Pfad hinzu
        if (req.file) {
            // Um den Pfad web-kompatibel zu machen (Slashes statt Backslashes)
            dataToUpdate.imagePath = req.file.path.replace(/\\/g, '/');
        }

        const result = await service.updateSong(req.params.id, dataToUpdate);
        if (result.error) return res.status(404).json(result);
        res.json(result);
    },

    // Song löschen
    delete: async (req, res) => {
        const result = await service.deleteSong(req.params.id);
        if (result.error) return res.status(404).json(result);
        res.status(204).send();
    },

    // Song streamen
    stream: async (req, res) => {
        const streamInfo = await service.getStream(req.params.id, req.headers.range);
        if (!streamInfo) return res.status(404).send('Nicht gefunden');
        
        // CORS Header hinzufügen
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
        
        res.writeHead(streamInfo.status, streamInfo.headers);
        streamInfo.stream.pipe(res);
    }
};

export default controller;
