/**
 * ReviewRepository class for managing review data in the database.
 */
export default class ReviewRepository {
    /**
     * @type {import('sequelize').ModelCtor<import('sequelize').Model>}
     */
    #ReviewModel;

    /**
     * Creates an instance of ReviewRepository.
     * @param {import('sequelize').ModelCtor<import('sequelize').Model>} ReviewModel - The Sequelize Review model
     */
    constructor(ReviewModel) {
        this.#ReviewModel = ReviewModel;
    }

    /**
     * Create a review.
     * @param {number} authorId - The ID of the user who wrote the review
     * @param {number} restaurantId - The ID of the restaurant being reviewed
     * @param {string} content - The review content
     * @returns {Promise<Review>} The review object created
     */
    async createReview(authorId, restaurantId, content) {
        const newReview = await this.#ReviewModel.create({ authorId, restaurantId, content });
        return {
            id: newReview.getDataValue('id'),
            authorId: newReview.getDataValue('authorId'),
            restaurantId: newReview.getDataValue('restaurantId'),
            content: newReview.getDataValue('content'),
        };
    }

    /**
     * Reads a single review by ID.
     * @param {number} id - The ID of the review
     * @returns {Promise<Review|null>} The review object found or null if not found
     */
    async readReview(id) {
        const foundReview = await this.#ReviewModel.findByPk(id);
        if (!foundReview) return null;
        return {
            id: foundReview.getDataValue('id'),
            authorId: foundReview.getDataValue('authorId'),
            restaurantId: foundReview.getDataValue('restaurantId'),
            content: foundReview.getDataValue('content'),
        };
    }

    /**
     * Reads reviews by restaurant ID.
     * @param {number} restaurantId - The ID of the restaurant
     * @returns {Promise<Review[]>} The list of reviews for the restaurant
     */
    async readReviewsByRestaurant(restaurantId) {
        const foundReviews = await this.#ReviewModel.findAll({ where: { restaurantId } });
        return foundReviews.map((review) => ({
            id: review.getDataValue('id'),
            authorId: review.getDataValue('authorId'),
            restaurantId: review.getDataValue('restaurantId'),
            content: review.getDataValue('content'),
        }));
    }

    /**
     * Updates a review by ID.
     * @param {number} id - The ID of the review to update
     * @param {Partial<Review>} reviewData - The data to update the review with
     * @returns {Promise<Review|null>} The updated review object or null if not found
     */
    async updateReview(id, reviewData) {
        const [updatedCount, updatedReviews] = await this.#ReviewModel.update(reviewData, {
            where: { id },
            returning: true,
        });
        if (updatedCount === 0) return null;
        const updatedReview = updatedReviews[0];
        return {
            id: updatedReview.getDataValue('id'),
            authorId: updatedReview.getDataValue('authorId'),
            restaurantId: updatedReview.getDataValue('restaurantId'),
            content: updatedReview.getDataValue('content'),
        };
    }

    /**
     * Deletes a review by ID.
     * @param {number} id - The ID of the review to delete
     * @returns {Promise<boolean>} True if the review was deleted, false otherwise
     */
    async deleteReview(id) {
        const deletedCount = await this.#ReviewModel.destroy({ where: { id } });
        return deletedCount > 0;
    }
}

/**
 * @typedef {Object} Review
 * @property {number} id - The unique identifier of the review
 * @property {number} authorId - The ID of the user who wrote the review
 * @property {number} restaurantId - The ID of the restaurant being reviewed
 * @property {string} content - The review content
 */
