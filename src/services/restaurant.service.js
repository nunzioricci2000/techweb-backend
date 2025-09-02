export default class RestaurantService {
    /**
     * @type {import('../repositories/restaurant.repository.js').default}
     */
    #restaurantRepository;
    /**
     * @type {import('../repositories/review.repository.js').default}
     */
    #reviewRepository;

    /**
     * Creates an instance of RestaurantService.
     * @param {import('../repositories/restaurant.repository.js').default} restaurantRepository
     * @param {import('../repositories/review.repository.js').default} reviewRepository
     */
    constructor(restaurantRepository, reviewRepository) {
        this.#restaurantRepository = restaurantRepository;
        this.#reviewRepository = reviewRepository;
    }

    /**
     * Creates a restaurant.
     * @param {string} name - The name of the restaurant
     * @param {string} description - The description of the restaurant
     * @param {{latitude: number, longitude: number}} location - The geographical location of
     * the restaurant
     * @param {string} imageUrl - The URL of the restaurant's image
     * @param {number} ownerId
     * @returns {Promise<import('../repositories/restaurant.repository.js').Restaurant>} The restaurant object created
     */
    async createRestaurant(name, description, location, imageUrl, ownerId) {
        return this.#restaurantRepository.createRestaurant(
            name,
            description,
            location,
            imageUrl,
            ownerId
        );
    }

    /**
     * Reads a restaurant by ID.
     * @param {number} id - The ID of the restaurant to read
     * @returns {Promise<import('../repositories/restaurant.repository.js').Restaurant?>} The
     * restaurant object found or null if not found
     */
    async readRestaurant(id) {
        return this.#restaurantRepository.readRestaurant(id);
    }

    /**
     * Reads restaurants by filter if given, else returns any restaurant.
     * @param {{byName: string}?} [filter] - The filter to apply when reading restaurants
     * @returns {Promise<import('../repositories/restaurant.repository.js').Restaurant[]>} The list of restaurant objects found
     */
    async readRestaurants(filter = null) {
        return this.#restaurantRepository.readRestaurants(filter);
    }

    /**
     * Updates a restaurant by ID.
     * @param {number} id - The ID of the restaurant to update
     * @param {Partial<import('../repositories/restaurant.repository.js').Restaurant> } updates - The updates to apply to the restaurant
     * @param {number} ownerId - The ID of the owner of the restaurant
     * @returns {Promise<import('../repositories/restaurant.repository.js').Restaurant>} The updated
     * restaurant object
     */
    async updateRestaurant(id, updates, ownerId) {
        const restaurant = await this.#restaurantRepository.readRestaurant(id);
        if (!restaurant) throw new Error(`Restaurant with ID ${id} not found`);
        if (restaurant.ownerId !== ownerId) {
            throw new Error(`User with ID ${ownerId} is not the owner of restaurant with ID ${id}`);
        }
        const updatedRestaurant = {
            ...restaurant,
            ...updates,
        };

        return this.#restaurantRepository.updateRestaurant(id, updatedRestaurant);
    }

    /**
     * Deletes a restaurant by ID.
     * @param {number} id - The ID of the restaurant to delete
     * @param {number} ownerId - The ID of the owner of the restaurant
     * @returns {Promise<void>}
     */
    async deleteRestaurant(id, ownerId) {
        const restaurant = await this.#restaurantRepository.readRestaurant(id);
        if (!restaurant) throw new Error(`Restaurant with ID ${id} not found`);
        if (restaurant.ownerId !== ownerId) {
            throw new Error(`User ${ownerId} is not the owner of restaurant with ID ${id}`);
        }
        // Cancella tutte le review associate al ristorante
        const reviews = await this.#reviewRepository.readReviewsByRestaurant(id);
        for (const review of reviews) {
            await this.#reviewRepository.deleteReview(review.id);
        }
        await this.#restaurantRepository.deleteRestaurant(id);
    }
}
