import playlistRepository from '../repositories/playlistRepository.js';

const playlistService = {
    getUserPlaylists: async (userId) => {
        return await playlistRepository.findByUserId(userId);
    },

    getPlaylistById: async (id, userId) => {
        const playlist = await playlistRepository.findById(id);
        if (!playlist) return { error: 'Playlist nicht gefunden' };
        if (playlist.owner.toString() !== userId) return { error: 'Zugriff verweigert' };
        return playlist;
    },

    createPlaylist: async (name, userId, imagePath = null) => {
        if (!name) return { error: 'Name wird benötigt' };
        return await playlistRepository.create({ 
            name, 
            owner: userId, 
            songs: [],
            imagePath 
        });
    },

    updatePlaylist: async (id, data, userId) => {
        const playlist = await playlistRepository.findById(id);
        if (!playlist) return { error: 'Playlist nicht gefunden' };
        if (playlist.owner.toString() !== userId) return { error: 'Zugriff verweigert' };

        // Wir nutzen hier direkt das Repository (ich muss es evtl. erweitern)
        // Aber für jetzt machen wir es direkt über das Modell via Repo wenn möglich
        // Oder wir erweitern das Repo
        return await playlistRepository.update(id, data);
    },

    addSongToPlaylist: async (playlistId, songId, userId) => {
        const playlist = await playlistRepository.findById(playlistId);
        if (!playlist) return { error: 'Playlist nicht gefunden' };
        if (playlist.owner.toString() !== userId) return { error: 'Zugriff verweigert' };

        return await playlistRepository.addSong(playlistId, songId);
    },

    removeSongFromPlaylist: async (playlistId, songId, userId) => {
        const playlist = await playlistRepository.findById(playlistId);
        if (!playlist) return { error: 'Playlist nicht gefunden' };
        if (playlist.owner.toString() !== userId) return { error: 'Zugriff verweigert' };

        return await playlistRepository.removeSong(playlistId, songId);
    },

    deletePlaylist: async (id, userId) => {
        const playlist = await playlistRepository.findById(id);
        if (!playlist) return { error: 'Playlist nicht gefunden' };
        if (playlist.owner.toString() !== userId) return { error: 'Zugriff verweigert' };

        await playlistRepository.delete(id);
        return { success: true };
    }
};

export default playlistService;
