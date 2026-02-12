const router=require('express').Router();
const bcrypt=require('bcryptjs');
const { User,registerSchema } = require('../model/user');
router.post('/',async(req,res)=>{
    //1.validate input
    const{error,value}=registerSchema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    //2.check email already exists
    const exists=await User.findOne({email:value.email.toLowerCase()});
    if(exists) return res.status(409).send('User with this email already exists')
    //hash the password
    const saltRounds=Number(process.env.SALT_ROUNDS)||10
    const passwordHash=await bcrypt.hash(value.password,saltRounds)
//create user
const user=await User.create({
    username:value.username,
    email:value.email.toLowerCase(),
    passwordHash
})
//return basic info
res.status(201).send({
    id:user._id,
    username:user.username,
    email:user.email
});
})
module.exports=router; //this we give because we want give this or use in other file