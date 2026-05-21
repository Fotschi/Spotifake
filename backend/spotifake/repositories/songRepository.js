import Song from '../models/Song.js';

/******** Merksatz: ********
*👉 Repositories speichern.*
****************************/

const songRepository = {
    findAll: async (query = {}) => await Song.find(query),
    findById: async (id) => await Song.findById(id),
    create: async (songData) => {
        const song = new Song(songData);
        return await song.save();
    },
    delete: async (id) => await Song.findByIdAndDelete(id),
    search: async (term) => {
        const regex = new RegExp(term, 'i');
        return await Song.find({
            $or: [
                { title: regex },
                { artist: regex },
                { album: regex }
            ]
        });
    }
};

export default songRepository;
