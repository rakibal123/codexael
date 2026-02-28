// Usage: node makeAdmin.js <email>
// Example: node makeAdmin.js admin@codexael.com

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Please provide an email address.');
        console.log('   Usage: node makeAdmin.js <email>');
        process.exit(1);
    }

    try {
        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`❌ No user found with email: ${email}`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ "${user.name}" (${user.email}) is now an admin.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

makeAdmin();
