import { Sequelize } from 'sequelize';
import createUserModel from './user.model.js';
import createRestaurantModel from './restaurant.model.js';
import createReviewModel from './review.model.js';
import createVoteModel from './vote.model.js';
import { DB_URI } from '../common/constants.js';

/**
 * Initializes the database and models
 * @returns {Promise<ModelCollection>} A collection of models and the database instance
 */
export default async function initModels() {
    /**
     * Database instance
     * @type {import('sequelize').Sequelize}
     */
    const database = new Sequelize(DB_URI);

    try {
        await database.authenticate();
    } catch (error) {
        console.error('Error in database connection: ', error);
        throw error;
    }

    /**
     * User model for managing user accounts
     * @type {import('sequelize').ModelCtor<import('sequelize').Model>}
     */
    const UserModel = createUserModel(database);

    /**
     * Restaurant model for managing restaurant data
     * @type {import('sequelize').ModelCtor<import('sequelize').Model>}
     */
    const RestaurantModel = createRestaurantModel(database);

    /**
     * Review model for managing user reviews of restaurants
     * @type {import('sequelize').ModelCtor<import('sequelize').Model>}
     */
    const ReviewModel = createReviewModel(database);

    /**
     * Vote model for managing user votes on reviews
     * @type {import('sequelize').ModelCtor<import('sequelize').Model>}
     */
    const VoteModel = createVoteModel(database);

    createOneToManyRelationship(UserModel, RestaurantModel, { name: 'ownerId', allowNull: false });
    createOneToManyRelationship(UserModel, ReviewModel, { name: 'authorId', allowNull: false });
    createOneToManyRelationship(RestaurantModel, ReviewModel, {
        name: 'restaurantId',
        allowNull: false,
    });
    createOneToManyRelationship(ReviewModel, VoteModel, { name: 'reviewId', allowNull: false });
    createOneToManyRelationship(UserModel, VoteModel, { name: 'userId', allowNull: false });

    await database.sync({ alter: true });

    return {
        UserModel,
        RestaurantModel,
        ReviewModel,
        VoteModel,
    };
}

/**
 * Creates a one-to-many relationship between two Model entities
 * @param {import('sequelize').ModelCtor<import('sequelize').Model>} owner - The ONE entity in the relationship
 * @param {import('sequelize').ModelCtor<import('sequelize').Model>} owned - The MANY entity in the relationship
 * @param {string | import('sequelize').ForeignKeyOptions | undefined} foreignKey - Foreign key name in the owned entity
 * @returns {void}
 */
function createOneToManyRelationship(owner, owned, foreignKey = undefined) {
    owner.hasMany(owned, {
        foreignKey,
    });
    owned.belongsTo(owner, {
        foreignKey,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
}

/**
 * @typedef {object} ModelCollection
 * @property {import('sequelize').ModelCtor<import('sequelize').Model>} UserModel - The User model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model>} RestaurantModel - The Restaurant model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model>} ReviewModel - The Review model.
 * @property {import('sequelize').ModelCtor<import('sequelize').Model>} VoteModel - The Vote model.
 */
