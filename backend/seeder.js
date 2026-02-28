const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Order = require('./models/Order');
const Message = require('./models/Message');
const connectDB = require('./config/db');

dotenv.config();

// connectDB(); // This line is moved inside importData and destroyData

const importData = async () => {
    try {
        await connectDB(); // Make connectDB awaitable inside importData

        await Order.deleteMany();
        await Project.deleteMany();
        await User.deleteMany();
        await Message.deleteMany();

        const createdUsers = await User.create([
            {
                name: 'Admin One',
                email: 'admin11@codexael.com',
                password: 'rakib123',
                role: 'admin',
            },
            {
                name: 'Admin Two',
                email: 'admin12@codexael.com',
                password: 'codexael123',
                role: 'admin',
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user',
            }
        ]);

        const adminUser = createdUsers[0]._id;

        const sampleProjects = [
            {
                title: 'E-Commerce Platform',
                description: 'A full-stack e-commerce solution with Next.js and Stripe.',
                techStack: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Stripe'],
                image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2069&auto=format&fit=crop',
                liveLink: 'https://example.com/ecommerce',
            },
            {
                title: 'Task Management App',
                description: 'Collaborative task tracking application with real-time updates.',
                techStack: ['React', 'Firebase', 'Tailwind CSS'],
                image: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?q=80&w=2064&auto=format&fit=crop',
                liveLink: 'https://example.com/taskapp',
            },
            {
                title: 'Portfolio Website',
                description: 'Personal portfolio template with dark mode and animations.',
                techStack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
                image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop',
                liveLink: 'https://example.com/portfolio',
            }
        ];

        await Project.insertMany(sampleProjects);

        const sampleOrders = [
            {
                userId: createdUsers[1]._id, // John Doe
                projectType: 'Web Application',
                description: 'I need a full-scale social media analytics dashboard for enterprise clients.',
                budget: '$10,000+',
                deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)), // 2 months from now
                paymentMethod: 'Bank Transfer',
                status: 'In Progress',
            },
            {
                userId: createdUsers[1]._id,
                projectType: 'Landing Page',
                description: 'Need a high-conversion landing page for my new startup product launch.',
                budget: '$1,000 - $5,000',
                deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month from now
                paymentMethod: 'Crypto',
                status: 'Pending',
            },
            {
                userId: createdUsers[1]._id,
                projectType: 'UI/UX Design',
                description: 'Complete redesign of our existing mobile application interface.',
                budget: '$5,000 - $10,000',
                deadline: new Date(new Date().setMonth(new Date().getMonth() - 1)), // 1 month ago
                paymentMethod: 'Credit Card',
                status: 'Completed',
            }
        ];

        await Order.insertMany(sampleOrders);

        const sampleMessages = [
            {
                name: 'Alice Smith',
                email: 'alice@corp.com',
                subject: 'Enterprise Consultation',
                message: 'Hello! I am very interested in hiring Codexael to consult with our DevOps team on scaling our infrastructure. How soon can we chat?',
            },
            {
                name: 'Bob Jones',
                email: 'bob@agency.io',
                subject: 'Partnership Opportunity',
                message: 'Hey, I love your portfolio. We are an agency looking to outsource some Next.js frontend work. Let me know if you do B2B contracts.',
            },
            {
                name: 'Charlie Davis',
                email: 'charlie@startup.net',
                subject: 'Quick Question about Tech Stack',
                message: 'Do you also build mobile applications with React Native, or just web applications?',
            }
        ];

        await Message.insertMany(sampleMessages);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await Order.deleteMany();
        await Project.deleteMany();
        await User.deleteMany();
        await Message.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
