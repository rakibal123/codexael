require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    const orders = await Order.find({});
    console.log("Total Orders in DB:", orders.length);
    console.log(orders);
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
