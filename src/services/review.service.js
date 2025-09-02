export default class ReviewService {
    /**
     * @type {import('../repositories/review.repository.js').default}
     */
    #reviewRepository;

    /**
     * Creates an instance of ReviewService.
     * @param {import('../repositories/review.repository.js').default} reviewRepository
     */
    constructor(reviewRepository) {
        this.#reviewRepository = reviewRepository;
    }

    /**
     * Creates a review for a restaurant.
     * @param {number} authorId - The ID of the user who wrote the review
     * @param {number} restaurantId - The ID of the restaurant being reviewed
     * @param {string} content - The review content
     * @returns {Promise<import('../repositories/review.repository.js').Review>} The review object created
     */
    async createReview(authorId, restaurantId, content) {
        return this.#reviewRepository.createReview(authorId, restaurantId, content);
    }

    /**
     * Reads all reviews for a restaurant.
     * @param {number} restaurantId - The ID of the restaurant
     * @returns {Promise<import('../repositories/review.repository.js').Review[]>} The list of reviews for the restaurant
     */
    async readReviewsByRestaurant(restaurantId) {
        return this.#reviewRepository.readReviewsByRestaurant(restaurantId);
    }

    /**
     * Updates a review by ID.
     * @param {number} id - The ID of the review to update
     * @param {Partial<import('../repositories/review.repository.js').Review>} reviewData - The data to update the review with
     * @returns {Promise<import('../repositories/review.repository.js').Review|null>} The updated review object or null if not found
     */
    /**
     * Updates a review by ID, only if the user is the author.
     * @param {number} id - The ID of the review to update
     * @param {Partial<import('../repositories/review.repository.js').Review>} reviewData - The data to update the review with
     * @param {number} authorId - The ID of the user attempting the update
     * @returns {Promise<import('../repositories/review.repository.js').Review|null>} The updated review object or null if not found
     */
    async updateReview(id, reviewData, authorId) {
        // Get the review directly by id
        const review = await this.#reviewRepository.readReview(id);
        if (!review) throw new Error(`Review with ID ${id} not found`);
        if (review.authorId !== authorId) {
            throw new Error(`User with ID ${authorId} is not the author of review with ID ${id}`);
        }
        return this.#reviewRepository.updateReview(id, reviewData);
    }

    /**
     * Deletes a review by ID.
     * @param {number} id - The ID of the review to delete
     * @returns {Promise<boolean>} True if the review was deleted, false otherwise
     */
    /**
     * Deletes a review by ID, only if the user is the author.
     * @param {number} id - The ID of the review to delete
     * @param {number} authorId - The ID of the user attempting the deletion
     * @returns {Promise<boolean>} True if the review was deleted, false otherwise
     */
    async deleteReview(id, authorId) {
        // Get the review directly by id
        const review = await this.#reviewRepository.readReview(id);
        if (!review) throw new Error(`Review with ID ${id} not found`);
        if (review.authorId !== authorId) {
            throw new Error(`User with ID ${authorId} is not the author of review with ID ${id}`);
        }
        return this.#reviewRepository.deleteReview(id);
    }
}
