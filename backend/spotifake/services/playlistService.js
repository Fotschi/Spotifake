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

    createPlaylist: async (name, userId) => {
        if (!name) return { error: 'Name wird benötigt' };
        return await playlistRepository.create({ name, owner: userId, songs: [] });
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
