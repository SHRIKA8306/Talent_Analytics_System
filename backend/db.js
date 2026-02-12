const mongoose=require('mongoose')
module.exports=async()=>{
    const url=process.env.DB;
    try{
        await mongoose.connect(url)
        console.log("connected to MongoDB")
    }catch(err){
        console.log("connection error:",err.message);
        process.exit(1);
    }
}