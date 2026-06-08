import express from 'express';
import controller from '../../controllers/playlistController.js';
import checkAuth from '../../middleware/auth.js';

const router = express.Router();

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
 */
router.post('/', controller.create);

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
