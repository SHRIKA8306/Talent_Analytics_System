const router=require('express').Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {User,loginSchema}=require('../model/user');
const { request } = require('express');
const passport=require('passport');

//post/api/auth
router.post('/',async(req,res)=>{
    //1.validate input
    const{error,value}=loginSchema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    //find user
    const user=await User.findOne({username:value.username})
    if(!user) return res.status(401).send('Invalid username or password')
    //check password
    const ok=await bcrypt.compare(value.password,user.passwordHash)
    if(!ok) return res.status(401).send('Invalid email or password')
    //create jwt token
    const token=jwt.sign(
        {id:user._id,email:user.email,username:user.username},
        process.env.JWT_SECRET||"shri@march",
        {expiresIn:process.env.JWT_EXPRIRES_IN||'1h'}    
    )
    // return token and  user information
    res.send({
        message:"Logged in Successfully",
        token,
        id:user._id,
        username:user.username,
        email:user.email
    })
})

// Google Auth Trigger
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Auth Callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
        { id: req.user._id, email: req.user.email, username: req.user.username },
        process.env.JWT_SECRET || "shri@march",
        { expiresIn: process.env.JWT_EXPRIRES_IN || '1h' }
    );
    // Redirect to frontend with token in query param
    // The frontend should pick this up and store it in localStorage
    res.redirect(`http://localhost:3000/login?token=${token}`);
  }
);

module.exports=router;