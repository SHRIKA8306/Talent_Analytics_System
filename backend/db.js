const mongoose=require('mongoose')
const bcrypt = require('bcryptjs');
const { User } = require('./model/user');

module.exports=async()=>{
    const url=process.env.DB;
    try{
        await mongoose.connect(url)
        console.log("connected to MongoDB")

        // Create default admin user if it doesn't exist
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
            const hashedPassword = await bcrypt.hash('admin123', saltRounds);

            await User.create({
                username: 'admin',
                email: 'admin@talent.com',
                passwordHash: hashedPassword,
                role: 'admin'
            });
            console.log("Default admin user created: username='admin', password='admin123'");
        }
    }catch(err){
        console.log("connection error:",err.message);
        process.exit(1);
    }
}