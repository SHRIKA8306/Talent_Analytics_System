const mongoose=require('mongoose')
const Joi = require('joi');
const userSchema=new mongoose.Schema(
    {
        username:{type:String,trim:true},
        email:{type:String,required:true,unique:true,lowercase:true,trim:true},
        passwordHash:{type:String},
        googleId:{type:String},
        role:{type:String,enum:['student','admin'],default:'student'}
    },
    {timestamps:true}
)
const User=mongoose.model('User',userSchema);
//verification
const registerSchema=Joi.object({
    username:Joi.string().min(3).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    role:Joi.string().valid('student','admin')
});
const loginSchema=Joi.object({
   username:Joi.string().required(),
   password:Joi.string().min(6).required()
});
module.exports={User,registerSchema,loginSchema};