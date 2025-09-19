export default class ReviewController {
    /**
     * Handles review related HTTP requests.
     * Relies on ReviewService for persistence logic.
     */

    /**
     * @type {import('../services/review.service.js').default}
     */
    #reviewService;

    /**
     * Creates an instance of ReviewController.
     * @param {import('../services/review.service.js').default} reviewService
     */
    constructor(reviewService) {
        this.#reviewService = reviewService;
    }

    /**
     * GET /restaurants/:rid/reviews
     * Returns all reviews for a restaurant.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @example
     * // Response 200
     * [
     *   { "id":1,"restaurantId":5,"authorId":2,"content":"Great!","createdAt":"..." }
     * ]
     */
    async getReviews(req, res, next) {
        try {
            const restaurantId = Number(req.params.rid);
            const reviews = await this.#reviewService.readReviewsByRestaurant(restaurantId);
            res.json(reviews);
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /restaurants/:rid/reviews
     * Creates a new review (requires authentication).
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @example
     * // Request body
     * { "content": "Servizio impeccabile." }
     * @example
     * // Response 201
     * { "id":10,"restaurantId":5,"authorId":2,"content":"Servizio impeccabile.","createdAt":"..." }
     */
    async createReview(req, res, next) {
        try {
            const restaurantId = Number(req.params.rid);
            const { content } = req.body;
            /** @type {number} */
            const authorId = req['user'].id;
            const review = await this.#reviewService.createReview(authorId, restaurantId, content);
            res.status(201).json(review);
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /restaurants/:rid/reviews/:cid
     * Returns a single review by id.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    async getReview(req, res, next) {
        try {
            const restaurantId = Number(req.params.rid);
            const reviewId = Number(req.params.cid);
            const reviews = await this.#reviewService.readReviewsByRestaurant(restaurantId);
            const review = reviews.find((r) => r.id === reviewId);
            if (!review) return res.status(404).json({ error: 'Review not found' });
            res.json(review);
        } catch (err) {
            next(err);
        }
    }

    /**
     * PUT /restaurants/:rid/reviews/:cid
     * Updates a review (only owner).
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @example
     * // Request body
     * { "content": "Aggiornata: esperienza ottima." }
     */
    async updateReview(req, res, next) {
        try {
            const restaurantId = Number(req.params.rid);
            const reviewId = Number(req.params.cid);
            const { content } = req.body;
            /** @type {number} */
            const userId = req['user'].id;
            const reviews = await this.#reviewService.readReviewsByRestaurant(restaurantId);
            const review = reviews.find((r) => r.id === reviewId);
            if (!review) return res.status(404).json({ error: 'Review not found' });
            if (review.authorId !== userId) return res.status(403).json({ error: 'Forbidden' });
            const updated = await this.#reviewService.updateReview(
                reviewId,
                { content, restaurantId },
                userId
            );
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }
}
