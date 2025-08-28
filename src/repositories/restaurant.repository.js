/**
 * RestaurantRepository class for managing restaurant data in the database.
 */
export default class RestaurantRepository {
    /**
     * RestaurantRepository class for managing restaurant data in the database.
     * @param {import('sequelize').ModelCtor<import('sequelize').Model>} restaurant
     */
    #RestaurantModel;

    /**
     * Creates an instance of RestaurantRepository.
     * @param {import('sequelize').ModelCtor<import('sequelize').Model>} RestaurantModel - The Sequelize Restaurant model
     */
    constructor(RestaurantModel) {
        this.#RestaurantModel = RestaurantModel;
    }

    /**
     * Create a restaurant.
     * @param {string} name - The name of the restaurant
     * @param {string} description - The description of the restaurant
     * @param {{latitude: number, longitude: number}} location - The geographical location of
     * the restaurant
     * @param {string} imageUrl - The URL of the restaurant's image
     * @param {number} ownerId - The ID of the user who owns the restaurant
     * @return {Promise<Restaurant>} The restaurant object created
     */
    async createRestaurant(name, description, location, imageUrl, ownerId) {
        const newRestaurant = await this.#RestaurantModel.create({
            name,
            description,
            latitude: location.latitude,
            longitude: location.longitude,
            image: imageUrl,
            ownerId,
        });
        return {
            id: newRestaurant.getDataValue('id'),
            name: newRestaurant.getDataValue('name'),
            description: newRestaurant.getDataValue('description'),
            location: {
                latitude: newRestaurant.getDataValue('latitude'),
                longitude: newRestaurant.getDataValue('longitude'),
            },
            imageUrl: newRestaurant.getDataValue('image'),
            ownerId: newRestaurant.getDataValue('ownerId'),
        };
    }

    /**
     * Reads a restaurant by ID.
     * @param {number} id
     * @return {Promise<Restaurant?>} The restaurant object found or null if not foundååå
     */
    async readRestaurant(id) {
        const foundRestaurant = await this.#RestaurantModel.findByPk(id);
        if (!foundRestaurant) return null;
        return {
            id: foundRestaurant.getDataValue('id'),
            name: foundRestaurant.getDataValue('name'),
            description: foundRestaurant.getDataValue('description'),
            location: {
                latitude: foundRestaurant.getDataValue('latitude'),
                longitude: foundRestaurant.getDataValue('longitude'),
            },
            imageUrl: foundRestaurant.getDataValue('image'),
            ownerId: foundRestaurant.getDataValue('ownerId'),
        };
    }

    /**
     * Reads restaurants by filter if given, else returns any restaurant
     * @param {{byName: string}?} filter
     * @return {Promise<Restaurant[]>} The list of restaurants found
     */
    async readRestaurants(filter = null) {
        const condition = filter ? { name: filter.byName } : {};
        const foundRestaurants = await this.#RestaurantModel.findAll({ where: condition });
        return foundRestaurants.map((restaurant) => ({
            id: restaurant.getDataValue('id'),
            name: restaurant.getDataValue('name'),
            description: restaurant.getDataValue('description'),
            location: {
                latitude: restaurant.getDataValue('latitude'),
                longitude: restaurant.getDataValue('longitude'),
            },
            imageUrl: restaurant.getDataValue('image'),
            ownerId: restaurant.getDataValue('ownerId'),
        }));
    }

    /**
     * Updates a restaurant by ID.
     * @param {number} id - The ID of the restaurant to update
     * @param {Partial<Restaurant>} restaurantData - The data to update the restaurant with
     * @returns {Promise<Restaurant>} The updated restaurant object
     */
    async updateRestaurant(id, restaurantData) {
        const [updatedCount, updatedRestaurants] = await this.#RestaurantModel.update(
            restaurantData,
            {
                where: { id },
                returning: true,
            }
        );
        if (updatedCount === 0) return null; // No restaurant was updated
        const updatedRestaurant = updatedRestaurants[0];
        return {
            id: updatedRestaurant.getDataValue('id'),
            name: updatedRestaurant.getDataValue('name'),
            description: updatedRestaurant.getDataValue('description'),
            location: {
                latitude: updatedRestaurant.getDataValue('latitude'),
                longitude: updatedRestaurant.getDataValue('longitude'),
            },
            imageUrl: updatedRestaurant.getDataValue('image'),
            ownerId: updatedRestaurant.getDataValue('ownerId'),
        };
    }

    /**
     * Deletes a restaurant by ID.
     * @param {number} id - The ID of the restaurant to delete
     * @returns {Promise<boolean>} True if the restaurant was deleted, false otherwise
     */
    async deleteRestaurant(id) {
        const deletedCount = await this.#RestaurantModel.destroy({ where: { id } });
        return deletedCount > 0; // Returns true if a restaurant was deleted
    }
}

/**
 * RestaurantRepository class for managing restaurant data in the database.
 * @typedef {object} Restaurant
 * @property {number} id - The unique identifier of the restaurant
 * @property {string} name - The name of the restaurant
 * @property {string} description - The description of the restaurant
 * @property {{latitude: number, longitude: number}} location - The geographical location of the restaurant
 * @property {string} imageUrl - The URL of the restaurant's image
 * @property {number} ownerId - The ID of the user who owns the restaurant
 */
