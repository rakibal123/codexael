require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const User = require('./models/User');
        const users = await User.find({}).select('+password');
        let updated = 0;

        for (let user of users) {
            if (!user.password.startsWith('$2')) {
                console.log('Hashing password for', user.email);
                user.password = 'password123';
                await user.save();
                updated++;
            }
        }

        console.log('Fixed ' + updated + ' user passwords.');
        process.exit(0);
    }).catch(console.error);
