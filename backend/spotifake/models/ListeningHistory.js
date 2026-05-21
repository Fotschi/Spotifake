import mongoose from 'mongoose';

const listeningHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    playedAt: { type: Date, default: Date.now },
    progress: { type: Number } // aktuelle Zeit in sekunden
}, { timestamps: true });

export default mongoose.model('ListeningHistory', listeningHistorySchema);
