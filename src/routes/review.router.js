import { Router } from 'express';
import validator from 'express-validator';
import validate from '../middleware/validate.middleware.js';

/**
 * Creates a router for managing restaurant reviews.
 * @param {import('../controllers/review.controller.js').default} reviewController
 * @param {import('express').RequestHandler} checkAuth
 */
export default function ReviewRouter(reviewController, checkAuth) {
    const router = Router();

    /**
     * @openapi
     * /restaurants/{rid}/reviews:
     *   get:
     *     tags: [reviews]
     *     summary: List all reviews for a restaurant
     *     parameters:
     *       - in: path
     *         name: rid
     *         required: true
     *         schema:
     *           type: integer
     *         description: Restaurant ID
     *     responses:
     *       200:
     *         description: Array of reviews
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Review'
     *   post:
     *     tags: [reviews]
     *     summary: Create a new review (authenticated)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: rid
     *         required: true
     *         schema:
     *           type: integer
     *         description: Restaurant ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [content]
     *             properties:
     *               content:
     *                 type: string
     *                 example: Ottimo cibo e servizio!
     *     responses:
     *       201:
     *         description: Review created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Review'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     */
    router
        .route('/restaurants/:rid/reviews')
        .get((req, res, next) => reviewController.getReviews(req, res, next))
        .post(
            [
                checkAuth,
                validator.body('content').notEmpty().withMessage('content required').escape(),
                validate,
            ],
            reviewController.createReview
        );

    /**
     * @openapi
     * /restaurants/{rid}/reviews/{cid}:
     *   get:
     *     tags: [reviews]
     *     summary: Get single review
     *     parameters:
     *       - in: path
     *         name: rid
     *         required: true
     *         schema:
     *           type: integer
     *       - in: path
     *         name: cid
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Review object
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Review'
     *       404:
     *         description: Not found
     *   put:
     *     tags: [reviews]
     *     summary: Update a review (owner only)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: rid
     *         required: true
     *         schema:
     *           type: integer
     *       - in: path
     *         name: cid
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [content]
     *             properties:
     *               content:
     *                 type: string
     *     responses:
     *       200:
     *         description: Updated review
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Not found
     */
    router
        .route('/restaurants/:rid/reviews/:cid')
        .get((req, res, next) => reviewController.getReview(req, res, next))
        .put(
            [
                checkAuth,
                validator.body('content').notEmpty().withMessage('content required').escape(),
                validate,
            ],
            reviewController.updateReview
        );

    return router;
}
