export default class RestaurantController {
    /**
     * @type {import('../services/restaurant.service.js').default} restaurantService
     */
    #restaurantService;

    /**
     * Creates an instance of RestaurantController.
     * @param {import('../services/restaurant.service.js').default} restaurantService
     */
    constructor(restaurantService) {
        this.#restaurantService = restaurantService;
    }

    /**
     * Get a list of restaurant.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async get(req, res) {
        const name = req.query['name'];
        const restaurant = await this.#restaurantService.readRestaurants(
            name && typeof name === 'string' ? { byName: name } : null
        );
        res.json(restaurant);
    }

    /**
     * Create a new restaurant.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async post(req, res) {
        const { name, description, location, imageUrl } = req.body;
        const ownerId = req['user'].id;
        const restaurant = await this.#restaurantService.createRestaurant(
            name,
            description,
            location,
            imageUrl,
            ownerId
        );
        res.status(201).json(restaurant);
    }

    /**
     * Update an existing restaurant.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async put(req, res) {
        const { id } = req.params;
        const { name, description, location, imageUrl } = req.body;
        const ownerId = req['user'].id;
        const restaurant = await this.#restaurantService.updateRestaurant(
            parseInt(id, 10),
            {
                name,
                description,
                location,
                imageUrl,
            },
            ownerId
        );
        res.status(200).json(restaurant);
    }

    /**
     * Delete a restaurant.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete(req, res) {
        const { id } = req.params;
        const ownerId = req['user'].id;
        await this.#restaurantService.deleteRestaurant(parseInt(id, 10), ownerId);
        res.status(204).send();
    }
}
