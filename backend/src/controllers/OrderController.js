const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderController {
    // Create a new order
    async createOrder(req, res) {
        try {
            const {
                orderItems,
                shippingAddress,
                paymentMethod,
                taxPrice,
                shippingPrice,
                totalPrice
            } = req.body;

            // Verify all products exist and are in stock
            for (const item of orderItems) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({
                        success: false,
                        error: `Product not found: ${item.product}`
                    });
                }
                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        error: `Insufficient stock for product: ${product.name}`
                    });
                }
            }

            const order = new Order({
                user: req.user.id,
                orderItems,
                shippingAddress,
                paymentMethod,
                taxPrice,
                shippingPrice,
                totalPrice
            });

            // Update product stock
            for (const item of orderItems) {
                const product = await Product.findById(item.product);
                product.stock -= item.quantity;
                await product.save();
            }

            const createdOrder = await order.save();
            res.status(201).json({
                success: true,
                data: createdOrder
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get order by ID
    async getOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id)
                .populate('user', 'name email')
                .populate('orderItems.product', 'name image');

            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
            }

            // Check if user is authorized
            if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to view this order'
                });
            }

            res.json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get logged in user's orders
    async getMyOrders(req, res) {
        try {
            const orders = await Order.find({ user: req.user.id })
                .populate('orderItems.product', 'name image');
            
            res.json({
                success: true,
                data: orders
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update order to paid
    async updateOrderToPaid(req, res) {
        try {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
            }

            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address
            };

            const updatedOrder = await order.save();
            res.json({
                success: true,
                data: updatedOrder
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update order to delivered
    async updateOrderToDelivered(req, res) {
        try {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
            }

            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.status = 'delivered';

            const updatedOrder = await order.save();
            res.json({
                success: true,
                data: updatedOrder
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get all orders (admin only)
    async getOrders(req, res) {
        try {
            const orders = await Order.find({})
                .populate('user', 'id name')
                .populate('orderItems.product', 'name image');
            
            res.json({
                success: true,
                data: orders
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update order status
    async updateOrderStatus(req, res) {
        try {
            const { status } = req.body;
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
            }

            order.status = status;
            if (status === 'delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json({
                success: true,
                data: updatedOrder
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new OrderController(); 