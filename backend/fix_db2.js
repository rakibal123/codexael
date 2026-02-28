require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    const User = require('./models/User');
    const users = await User.find({}).select('+password');
    let updated = 0;
    
    for (let user of users) {
        if (!user.password.startsWith('$2')) {
            console.log('Forcing hash for', user.email);
            // Force it to be modified by changing it to something else first
            user.password = 'temp_placeholder';
            await user.save();
            
            // Now set it to the real password so it triggers the hashing
            const u2 = await User.findById(user._id).select('+password');
            u2.password = 'password123';
            await u2.save();
            updated++;
        }
    }
    
    console.log('Truly fixed ' + updated + ' user passwords.');
    process.exit(0);
}).catch(console.error);
