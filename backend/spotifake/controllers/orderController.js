import service from '../services/orderService.js';

/********* Merksatz: **********
*👉 Controller sprechen HTTP.*
******************************/

// Hier behandeln wir nur die Anfragen vom Browser (Request/Response)
const controller = {
    // LOGIN & REGISTER
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

    // SONGS LADEN
    getSongs: async (req, res) => {
        const query = req.query['q'];
        const songs = await service.getSongs(query);
        res.json(songs);
    },

    // SONG HOCHLADEN
    upload: async (req, res) => {
        const { title, artist } = req.body;
        const result = await service.uploadSong(title, artist, req.file, req.user?.id);
        res.status(201).json(result);
    },

    // SONG STREAMEN
    stream: async (req, res) => {
        const streamInfo = await service.getStream(req.params.id, req.headers.range);
        if (!streamInfo) return res.status(404).send('Nicht gefunden');
        
        res.writeHead(streamInfo.status, streamInfo.headers);
        streamInfo.stream.pipe(res);
    }
};

export default controller;
