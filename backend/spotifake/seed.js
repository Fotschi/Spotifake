import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Song from './models/Song.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spotifake';

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(' Starte Seeding...');

        // User bereinigen und neu erstellen
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('password123', 10);
        const testUser = await User.create({
            username: 'testuser',
            passwordHash: passwordHash
        });
        console.log('Test-User erstellt: testuser / password123');

        // Songs bereinigen
        await Song.deleteMany({});
        
        const songs = [
            {
                title: 'Choere',
                artist: 'Mark Forster',
                filePath: 'uploads/demo1.mp3',
                mimetype: 'audio/mpeg',
                uploadedBy: testUser._id
            },
            {
                title: 'Azizam',
                artist: 'Ed Sheeran',
                filePath: 'uploads/demo2.mp3',
                mimetype: 'audio/mpeg',
                uploadedBy: testUser._id
            }
        ];

        await Song.insertMany(songs);
        console.log('Beispiel Songs erstellt');

        console.log('Seeding fertig!');
        process.exit(0);
    } catch (error) {
        console.error('Fehler beim Seeding:', error);
        process.exit(1);
    }
}

seed();
