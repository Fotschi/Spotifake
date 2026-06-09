import express from 'express';
import multer from 'multer';
import controller from '../../controllers/playlistController.js';
import checkAuth from '../../middleware/auth.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Alle Routen hier benötigen Authentifizierung
router.use(checkAuth);

/**
 * @openapi
 * /api/v1/playlists:
 *   get:
 *     summary: Alle Playlists des Nutzers abrufen
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', controller.getPlaylists);

/**
 * @openapi
 * /api/v1/playlists:
 *   post:
 *     summary: Neue Playlist erstellen
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               image: { type: string, format: binary }
 */
router.post('/', upload.single('image'), controller.create);

/**
 * @openapi
 * /api/v1/playlists/{id}:
 *   put:
 *     summary: Playlist aktualisieren
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               image: { type: string, format: binary }
 */
router.put('/:id', upload.single('image'), controller.update);

/**
 * @openapi
 * /api/v1/playlists/{id}:
 *   get:
 *     summary: Eine bestimmte Playlist abrufen
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', controller.getPlaylist);

/**
 * @openapi
 * /api/v1/playlists/{id}:
 *   delete:
 *     summary: Playlist löschen
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', controller.delete);

/**
 * @openapi
 * /api/v1/playlists/{id}/songs:
 *   post:
 *     summary: Song zur Playlist hinzufügen
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/songs', controller.addSong);

/**
 * @openapi
 * /api/v1/playlists/{id}/songs/{songId}:
 *   delete:
 *     summary: Song aus der Playlist entfernen
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/songs/:songId', controller.removeSong);

export { router };
