const BaseService = require('./BaseService');
const Product = require('../models/Product');

class ProductService extends BaseService {
    constructor() {
        super(Product);
    }

    async validate(data) {
        if (data.price < 0) {
            throw new Error('Price cannot be negative');
        }
        if (data.stock < 0) {
            throw new Error('Stock cannot be negative');
        }
        return true;
    }

    async beforeCreate(data) {
        // Add any pre-processing logic here
        return data;
    }

    async afterCreate(data) {
        // Add any post-processing logic here
        return data;
    }

    async getProductsByCategory(category) {
        return await this.model.findAll({
            where: { category, isActive: true },
            order: [['createdAt', 'DESC']]
        });
    }

    async getProductsBySeller(userId) {
        return await this.model.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
    }

    async updateStock(id, quantity) {
        const product = await this.getById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        const newStock = product.stock + quantity;
        if (newStock < 0) {
            throw new Error('Insufficient stock');
        }

        return await this.update(id, { stock: newStock });
    }
}

module.exports = new ProductService(); 