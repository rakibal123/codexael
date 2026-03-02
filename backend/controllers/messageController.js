import Message from '../models/Message.js';

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = await Message.create({
            name,
            email,
            subject,
            message,
        });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).sort('-createdAt');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    sendMessage,
    getMessages,
};
