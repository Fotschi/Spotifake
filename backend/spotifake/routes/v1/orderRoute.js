import express from 'express';
import multer from 'multer';
import controller from '../../controllers/orderController.js';
import checkAuth from '../../middleware/auth.js';

const router = express.Router();

// multer setup (Nur Für Datei-Uploads)
const upload = multer({ dest: 'uploads/' });

// Routen

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Neuen Benutzer registrieren
 *     tags: [Benutzer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Benutzer erstellt
 */
router.post('/auth/register', controller.register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Einloggen
 *     tags: [Benutzer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login erfolgreich
 */
router.post('/auth/login', controller.login);

/**
 * @openapi
 * /api/v1/songs:
 *   get:
 *     summary: Alle Songs abrufen
 *     tags: [Musik]
 *     responses:
 *       200:
 *         description: Liste der Songs
 */
router.get('/songs', controller.getSongs);

/**
 * @openapi
 * /api/v1/songs/{id}/stream:
 *   get:
 *     summary: Musik streamen
 *     tags: [Musik]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       206:
 *         description: Audio Stream
 */
router.get('/songs/:id/stream', controller.stream);

/**
 * @openapi
 * /api/v1/songs:
 *   post:
 *     summary: Song hochladen
 *     tags: [Musik]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               song: { type: string, format: binary }
 *               image: { type: string, format: binary }
 *               title: { type: string }
 *               artist: { type: string }
 *     responses:
 *       201:
 *         description: Song hochgeladen
 */
router.post('/songs', checkAuth, upload.fields([{ name: 'song', maxCount: 1 }, { name: 'image', maxCount: 1 }]), controller.upload);

/**
 * @openapi
 * /api/v1/songs/{id}:
 *   put:
 *     summary: Song aktualisieren
 *     tags: [Musik]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               artist: { type: string }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Song aktualisiert
 */
router.put('/songs/:id', checkAuth, upload.single('image'), controller.update);

/**
 * @openapi
 * /api/v1/songs/{id}:
 *   delete:
 *     summary: Song löschen
 *     tags: [Musik]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Song gelöscht
 */
router.delete('/songs/:id', checkAuth, controller.delete);

export { router };
