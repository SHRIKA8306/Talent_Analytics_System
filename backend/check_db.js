const mongoose = require('mongoose');
require('dotenv').config();
const { User } = require('./model/user');

async function checkUser() {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connected to DB');
        const users = await User.find({ 
            $or: [
                { username: /thangamani/i },
                { email: /thangamani/i }
            ]
        });
        if (users.length === 0) {
            console.log('No user found matching "thangamani" (case-insensitive)');
        } else {
            console.log('Found users:');
            users.forEach(u => console.log(`- Username: ${u.username}, Email: ${u.email}`));
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error connecting to DB:', err);
    }
}

checkUser();
