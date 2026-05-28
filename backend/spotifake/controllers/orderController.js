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
        res.status(201).json(result);
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
        const result = await service.uploadSong(title, artist, req.file, req.user?.id);
        res.status(201).json(result);
    },

    // Song hochladen
    update: async (req, res) => {
        const result = await service.updateSong(req.params.id, req.body);
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
