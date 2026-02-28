const Order = require('../models/Order');

// @desc    Create new order (multipart/form-data with optional file attachments)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const {
            projectType,
            title,
            description,
            techPreference,
            budget,
            deadline,
            paymentMethod,
        } = req.body;

        if (!description) {
            return res.status(400).json({ message: 'Description is required' });
        }

        // Map uploaded files to server-relative paths
        const attachments = req.files
            ? req.files.map(f => f.path)
            : [];

        const order = new Order({
            userId: req.user._id,
            projectType,
            title,
            description,
            techPreference,
            budget,
            deadline,
            status: 'Pending',
            paymentMethod,
            attachments,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'id name email')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status, deliverableLink, paymentLink, liveLink, githubLink, previewImage } = req.body;

        const validStatuses = ['Pending', 'In Progress', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);

        if (order) {
            // Lock: cannot change status if order is already Completed
            if (order.status === 'Completed') {
                return res.status(400).json({ message: 'Status is locked. This order has been marked as completed.' });
            }

            order.status = status;
            if (deliverableLink !== undefined) order.deliverableLink = deliverableLink;
            if (paymentLink !== undefined) order.paymentLink = paymentLink;
            if (liveLink !== undefined) order.liveLink = liveLink;
            if (githubLink !== undefined) order.githubLink = githubLink;
            if (previewImage !== undefined) order.previewImage = previewImage;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit payment proof for an order
// @route   POST /api/orders/:id/pay
// @access  Private
const payOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // Can only pay if not already paid/completed
            if (order.status === 'Completed') {
                return res.status(400).json({ message: 'Order is already completed' });
            }

            order.paymentType = req.body.paymentType || order.paymentType;
            order.transactionId = req.body.transactionId || order.transactionId;

            // Handle file upload path
            if (req.file) {
                order.paymentProof = req.file.path;
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an order (admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload a preview screenshot for a completed order (admin)
// @route   POST /api/orders/:id/preview
// @access  Private/Admin
const uploadPreviewImage = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        order.previewImage = req.file.path;
        await order.save();
        res.json({ previewImage: order.previewImage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    uploadPreviewImage,
    payOrder
};
