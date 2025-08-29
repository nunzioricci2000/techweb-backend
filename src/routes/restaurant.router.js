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
