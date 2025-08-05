import { DataTypes } from "sequelize";

/**
 * A factory that create the restaurant model
 * @param {import('sequelize').Sequelize} database - The Sequelize database instance
 * @returns {import('sequelize').ModelCtor<import('sequelize').Model>} The Restaurant model
 */
export default function createRestaurantModel(database) {
    return database.define('Restaurant', {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
}