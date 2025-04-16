const BaseController = require('./BaseController');
const productService = require('../services/ProductService');
const Product = require('../models/Product');
const { uploadImage } = require('../utils/upload');

class ProductController extends BaseController {
    constructor() {
        super(productService);
    }

    async getByCategory(req, res) {
        try {
            const products = await productService.getProductsByCategory(req.params.category);
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getBySeller(req, res) {
        try {
            const products = await productService.getProductsBySeller(req.params.userId);
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async updateStock(req, res) {
        try {
            const { quantity } = req.body;
            const product = await productService.updateStock(req.params.id, quantity);
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            // Add seller ID from authenticated user
            const data = {
                ...req.body,
                userId: req.user.id
            };
            const product = await productService.create(data);
            res.status(201).json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            // Ensure user can only update their own products
            const product = await productService.getById(req.params.id);
            if (product.userId !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    error: 'You can only update your own products'
                });
            }

            const updatedProduct = await productService.update(req.params.id, req.body);
            res.json({
                success: true,
                data: updatedProduct
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            // Ensure user can only delete their own products
            const product = await productService.getById(req.params.id);
            if (product.userId !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    error: 'You can only delete your own products'
                });
            }

            await productService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Create a new product
    async createProduct(req, res) {
        try {
            const { name, description, price, category, stock } = req.body;
            
            // Upload product images
            const images = await Promise.all(
                req.files.map(file => uploadImage(file))
            );

            const product = new Product({
                name,
                description,
                price,
                category,
                stock,
                images,
                seller: req.user.id
            });

            await product.save();
            res.status(201).json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get all products with filtering and pagination
    async getProducts(req, res) {
        try {
            const { category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
            
            const query = { isActive: true };
            if (category) query.category = category;
            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = minPrice;
                if (maxPrice) query.price.$lte = maxPrice;
            }

            const sortOptions = {
                'price-asc': { price: 1 },
                'price-desc': { price: -1 },
                'newest': { createdAt: -1 },
                'oldest': { createdAt: 1 }
            };

            const products = await Product.find(query)
                .sort(sortOptions[sort] || { createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('seller', 'name email');

            const total = await Product.countDocuments(query);

            res.json({
                success: true,
                data: products,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get a single product
    async getProduct(req, res) {
        try {
            const product = await Product.findById(req.params.id)
                .populate('seller', 'name email')
                .populate('reviews.user', 'name');

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update a product
    async updateProduct(req, res) {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            // Check if user is the seller
            if (product.seller.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to update this product'
                });
            }

            // Handle image updates
            if (req.files && req.files.length > 0) {
                const newImages = await Promise.all(
                    req.files.map(file => uploadImage(file))
                );
                product.images = [...product.images, ...newImages];
            }

            // Update other fields
            Object.keys(req.body).forEach(key => {
                if (key !== 'images') {
                    product[key] = req.body[key];
                }
            });

            await product.save();
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Delete a product
    async deleteProduct(req, res) {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            // Check if user is the seller
            if (product.seller.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to delete this product'
                });
            }

            // Soft delete
            product.isActive = false;
            await product.save();

            res.status(204).send();
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Add a review
    async addReview(req, res) {
        try {
            const { rating, comment } = req.body;
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            const review = {
                user: req.user.id,
                rating: Number(rating),
                comment
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({
                success: true,
                data: product
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new ProductController(); 