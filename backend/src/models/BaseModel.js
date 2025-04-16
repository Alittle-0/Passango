const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class BaseModel {
    static init(attributes, options = {}) {
        const model = sequelize.define(this.name, {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            ...attributes
        }, {
            timestamps: true,
            underscored: true,
            ...options
        });

        return model;
    }

    static associate(models) {
        // Override this method in child models to define associations
    }
}

module.exports = BaseModel; 