const mongoose = require('mongoose');
const Table = require('./table'); // Path to your model

mongoose.connect("mongodb://127.0.0.1:27017/restaurant")
    .then(async () => {
        await Table.deleteMany({}); // Clears old data so you don't get 100 tables
        const tables = [];
        for (let i = 1; i <= 50; i++) {
            tables.push({ tablenumber: i, capacity: 4, isAvailable: true });
        }
        await Table.insertMany(tables);
        console.log("✅ 50 Tables inserted into MongoDB!");
        process.exit();
    });