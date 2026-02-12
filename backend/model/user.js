const mongoose=require('mongoose')
const Joi = require('joi');
const userSchema=new mongoose.Schema(
    {
        username:{type:String,trim:true},
        email:{type:String,required:true,unique:true,lowercase:true,trim:true},
        passwordHash:{type:String},
        googleId:{type:String}
    },
    {timestamps:true}
)
const User=mongoose.model('User',userSchema);
//verification
const registerSchema=Joi.object({
    username:Joi.string().min(3).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required()
});
const loginSchema=Joi.object({
   username:Joi.string().required(),
   password:Joi.string().min(6).required()
});
module.exports={User,registerSchema,loginSchema};