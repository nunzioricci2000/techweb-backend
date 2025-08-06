import { DataTypes } from 'sequelize';

/**
 * A factory that create the vote model
 * @param {import('sequelize').Sequelize} database - The Sequelize database instance
 * @returns {import('sequelize').ModelCtor<import('sequelize').Model>} The Vote model
 */
export default function createVoteModel(database) {
    return database.define('Vote', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
}
