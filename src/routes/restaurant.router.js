import express, { Router } from 'express';
import validator from 'express-validator';
import validate from '../middleware/validate.middleware.js';
import { storePhoto, getPhotoUrl } from '../middleware/photo-storage.middleware.js';

/**
 * Creates an instance of RestaurantRouter.
 * @param {import("../controllers/restaurant.controller.js").default} restaurantController -
 * The restaurant controller to handle restaurant routes
 * @param {import('express').RequestHandler} checkAuth - Middleware to check authentication
 * service to handle user registration and login
 * @returns {Router} An Express router for authentication routes
 */
export default function RestaurantRouter(restaurantController, checkAuth) {
    const router = Router();
    router.use(express.json());

    /**
     * @openapi
     * /restaurants:
     *   get:
     *     tags:
     *       - restaurants
     *     summary: Ottieni la lista dei ristoranti
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Lista dei ristoranti
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                   name:
     *                     type: string
     *                   description:
     *                     type: string
     *                   location:
     *                     type: string
     *                   imageUrl:
     *                     type: string
     *   post:
     *     tags:
     *       - restaurants
     *     summary: Crea un nuovo ristorante
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               location:
     *                 type: string
     *               imageUrl:
     *                 type: string
     *     responses:
     *       201:
     *         description: Ristorante creato con successo
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 name:
     *                   type: string
     *                 description:
     *                   type: string
     *                 location:
     *                   type: string
     *                 imageUrl:
     *                   type: string
     */
    router
        .route('/')
        .get(restaurantController.get)
        .post(
            [
                checkAuth,
                storePhoto,
                getPhotoUrl,
                validator.body(['name', 'description', 'location']).notEmpty().escape(),
                validator.body('imageUrl').notEmpty(),
                validate,
            ],
            restaurantController.post
        );

    /**
     * @openapi
     * /restaurants/{id}:
     *   put:
     *     tags:
     *       - restaurants
     *     summary: Aggiorna un ristorante esistente
     *     security:
     *       - bearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID del ristorante da aggiornare
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               location:
     *                 type: string
     *               imageUrl:
     *                 type: string
     *     responses:
     *       200:
     *         description: Ristorante aggiornato con successo
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 name:
     *                   type: string
     *                 description:
     *                   type: string
     *                 location:
     *                   type: string
     *                 imageUrl:
     *                   type: string
     *   delete:
     *     tags:
     *       - restaurants
     *     summary: Elimina un ristorante
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID del ristorante da eliminare
     *     responses:
     *       204:
     *         description: Ristorante eliminato con successo
     */
    router
        .route('/:id')
        .put(
            [
                checkAuth,
                storePhoto,
                getPhotoUrl,
                validator.body(['name', 'description', 'location']).escape(),
                validator.body('imageUrl'),
                validate,
            ],
            restaurantController.put
        )
        .delete([checkAuth], restaurantController.delete);

    return router;
}
