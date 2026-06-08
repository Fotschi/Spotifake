import service from '../services/playlistService.js';

const playlistController = {
    // Alle Playlists des Users abrufen
    getPlaylists: async (req, res) => {
        const playlists = await service.getUserPlaylists(req.user.id);
        res.json(playlists);
    },

    // Einzelne Playlist abrufen (mit Songs)
    getPlaylist: async (req, res) => {
        const result = await service.getPlaylistById(req.params.id, req.user.id);
        if (result.error) return res.status(404).json(result);
        res.json(result);
    },

    // Neue Playlist erstellen
    create: async (req, res) => {
        const result = await service.createPlaylist(req.body.name, req.user.id);
        if (result.error) return res.status(400).json(result);
        res.status(201).json(result);
    },

    // Song hinzufügen
    addSong: async (req, res) => {
        const result = await service.addSongToPlaylist(req.params.id, req.body.songId, req.user.id);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    },

    // Song entfernen
    removeSong: async (req, res) => {
        const result = await service.removeSongFromPlaylist(req.params.id, req.params.songId, req.user.id);
        if (result.error) return res.status(400).json(result);
        res.json(result);
    },

    // Playlist löschen
    delete: async (req, res) => {
        const result = await service.deletePlaylist(req.params.id, req.user.id);
        if (result.error) return res.status(404).json(result);
        res.status(204).send();
    }
};

export default playlistController;
