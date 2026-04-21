const router=require('express').Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {User,loginSchema}=require('../model/user');
const { request } = require('express');
const passport=require('passport');

//post/api/auth - Username/Password Login
router.post('/',async(req,res)=>{
    //1.validate input
    const{error,value}=loginSchema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    // find user (allow matching username OR email in the username field)
    const normalizedUsername = value.username.trim();
    const escapedUsername = normalizedUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp("^" + escapedUsername + "$", "i") } },
        { email: normalizedUsername.toLowerCase() }
      ]
    });
    if(!user) return res.status(401).send('Invalid email or password')
    //check password
    const ok=await bcrypt.compare(value.password.trim(),user.passwordHash)
    if(!ok) return res.status(401).send('Invalid email or password')
    //create jwt token
    const token=jwt.sign(
        {id:user._id,email:user.email,username:user.username,role:user.role},
        process.env.JWT_SECRET||"shri@march",
        {expiresIn:process.env.JWT_EXPRIRES_IN||'2d'}    
    )
    // return token and  user information
    res.send({
        message:"Logged in Successfully",
        token,
        id:user._id,
        username:user.username,
        email:user.email,
        role:user.role
    })
})

// ────── GOOGLE OAUTH (SINGLE SETUP FOR BOTH STUDENT AND ADMIN) ──────

// Google Auth Trigger (Forces account selection)
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account',
  accessType: 'offline'
}));

// Google Auth Callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Get the role from query parameter (student or admin)
    const role = req.query.role || 'student';
    
    // Update user role if provided
    User.findByIdAndUpdate(req.user._id, { role: role }, { new: true }).then(updatedUser => {
      const token = jwt.sign(
          { id: updatedUser._id, email: updatedUser.email, username: updatedUser.username, role: updatedUser.role },
          process.env.JWT_SECRET || "shri@march",
          { expiresIn: process.env.JWT_EXPRIRES_IN || '2d' }
      );
      res.redirect(`https://talent-analytics-system.vercel.app/dashboard?token=${token}&role=${updatedUser.role}`);
    }).catch(err => {
      res.redirect(`https://talent-analytics-system.vercel.app/login?error=Failed to set role`);
    });
  }
);

// ────── SIGNUP WITH JWT ──────
router.post('/signup', async(req, res)=>{
  try {
    const { username, email, password, role } = req.body;
    
    // Validate input
    if (!username || !email || !password || !role) {
      return res.status(400).send('Missing required fields');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    
    // Hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      role: role // 'student' or 'admin'
    });
    
    // Create JWT token
    const token = jwt.sign(
        { id: newUser._id, email: newUser.email, username: newUser.username, role: newUser.role },
        process.env.JWT_SECRET || "shri@march",
        { expiresIn: process.env.JWT_EXPRIRES_IN || '2d' }
    );
    
    // Return token and user information
    res.status(201).send({
      message: "Signup successful",
      token,
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    });
  } catch (err) {
    res.status(500).send(err.message || 'Signup failed');
  }
});

module.exports=router;