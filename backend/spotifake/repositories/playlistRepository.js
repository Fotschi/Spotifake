import Playlist from '../models/Playlist.js';

const playlistRepository = {
    findByUserId: async (userId) => {
        return await Playlist.find({ owner: userId }).sort({ createdAt: -1 });
    },

    findById: async (id) => {
        return await Playlist.findById(id).populate('songs');
    },

    create: async (data) => {
        const playlist = new Playlist(data);
        return await playlist.save();
    },

    addSong: async (playlistId, songId) => {
        return await Playlist.findByIdAndUpdate(
            playlistId,
            { $addToSet: { songs: songId } }, // $addToSet verhindert Duplikate
            { new: true }
        ).populate('songs');
    },

    removeSong: async (playlistId, songId) => {
        return await Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { songs: songId } },
            { new: true }
        ).populate('songs');
    },

    delete: async (id) => {
        return await Playlist.findByIdAndDelete(id);
    }
};

export default playlistRepository;
