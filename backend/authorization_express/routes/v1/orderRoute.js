import express from 'express';
import { getOrders } from '../../controllers/orderController.js'

export const router = express.Router();

// ROUTE:
// Verbindet URL + HTTP-Methode mit dem passenden Controller.
// Sagt: WOHIN geht die Anfrage?

/******* Merksatz: ********
* 👉 Routes sagen WOHIN. *
**************************/

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: Liefert eine Liste von Bestellungen
 *     description: Gibt alle Bestellungen zurück, optional gefiltert über den Query-Parameter `q`.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Suchparameter zur Filterung der Bestellungen
 *         example: x
 *     responses:
 *       200:
 *         description: Erfolgreiche Antwort mit einer Liste von Bestellungen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad Request – Query-Parameter q fehlt oder ist leer
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *             example: |
 *               Error: query parameter q is missing!
 */
router.get('/', getOrders);

/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         customer_id:
 *           type: integer
 *           example: 1337
 *         sum:
 *           type: number
 *           format: float
 *           example: 999.9
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 4711
 *         description:
 *           type: string
 *           example: notebook xyz
 *         price:
 *           type: number
 *           format: float
 *           example: 899.9
 */