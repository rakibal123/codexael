import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
        },
        projectType: {
            type: String,
        },
        description: {
            type: String,
        },
        techPreference: {
            type: String,
        },
        budget: {
            type: String,
        },
        deadline: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending',
        },
        paymentMethod: {
            type: String,
        },
        deliverableLink: {
            type: String,
        },
        paymentLink: {
            type: String,
        },
        paymentType: {
            type: String,
            enum: ['Bank Transfer', 'bKash', 'External Link', 'None'],
            default: 'None'
        },
        transactionId: {
            type: String,
        },
        paymentProof: {
            type: String,
        },
        // Files attached by the client at order creation (images, PDFs, ZIPs)
        attachments: {
            type: [String],
            default: [],
        },
        // Admin-provided delivery links visible to client
        liveLink: {
            type: String,
        },
        githubLink: {
            type: String,
        },
        previewImage: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
