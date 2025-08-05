import { Sequelize } from "sequelize";
import createUserModel from "./user.model.js";
import createRestaurantModel from "./restaurant.model.js";
import createReviewModel from "./review.model.js";
import createVoteModel from "./vote.model.js";

/**
 * Database instance
 * @type {import('sequelize').Sequelize}
 */
export const database = new Sequelize("sqlite:mydb.sqlite");

try {
    await database.authenticate();
    console.log("Database connected successfully");
} catch(error) {
    console.error("Error in database connection: ", error);
    throw error;
}

/**
 * User model for managing user accounts
 * @type {import('sequelize').ModelCtor<import('sequelize').Model>}
 */
export const User = createUserModel(database);

/**
 * Restaurant model for managing restaurant data
 * @type {import('sequelize').ModelCtor<import('sequelize').Model>}
 */
export const Restaurant = createRestaurantModel(database);

/**
 * Review model for managing user reviews of restaurants
 * @type {import('sequelize').ModelCtor<import('sequelize').Model>}
 */
export const Review = createReviewModel(database);

/**
 * Vote model for managing user votes on reviews
 * @type {import('sequelize').ModelCtor<import('sequelize').Model>}
 */
export const Vote = createVoteModel(database);

createOneToManyRelationship(User, Restaurant, { name: 'ownerId', allowNull: false });
createOneToManyRelationship(User, Review, { name: 'authorId', allowNull: false });
createOneToManyRelationship(Restaurant, Review, { name: 'restaurantId', allowNull: false });
createOneToManyRelationship(Review, Vote, { name: 'reviewId', allowNull: false });
createOneToManyRelationship(User, Vote, { name: 'userId', allowNull: false });

await database.sync({ alter: true });

/**
 * Creates a one-to-many relationship between two Model entities
 * @param {import('sequelize').ModelCtor<import('sequelize').Model>} owner - The ONE entity in the relationship
 * @param {import('sequelize').ModelCtor<import('sequelize').Model>} owned - The MANY entity in the relationship
 * @param {string | import('sequelize').ForeignKeyOptions | undefined} foreignKey - Foreign key name in the owned entity
 * @returns {void}
 */
function createOneToManyRelationship(owner, owned, foreignKey = undefined) {
    owner.hasMany(owned, {
        foreignKey
    });
    owned.belongsTo(owner, {
        foreignKey,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
}