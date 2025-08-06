import { DataTypes } from 'sequelize';

/**
 * A factory that create the user model
 * @param {import('sequelize').Sequelize} database - The Sequelize database instance
 * @returns {import('sequelize').ModelCtor<import('sequelize').Model>} The User model
 */
export default function createUserModel(database) {
    return database.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
}
