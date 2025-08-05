import { DataTypes } from "sequelize";

/**
 * A factory that create the review model
 * @param {import('sequelize').Sequelize} database - The Sequelize database instance
 * @returns {import('sequelize').ModelCtor<import('sequelize').Model>} The Review model
 */
export default function createReviewModel(database) {
    return database.define('Restaurant', {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });
}