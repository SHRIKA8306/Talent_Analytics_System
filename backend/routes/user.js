const router=require('express').Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const { User,registerSchema } = require('../model/user');
const auth = require('../middleware/auth');

// POST /api/users/register
router.post('/register',async(req,res)=>{
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
    passwordHash,
    role:value.role||'student'
})
//create jwt token
const token=jwt.sign(
    {id:user._id,email:user.email,username:user.username,role:user.role},
    process.env.JWT_SECRET||"shri@march",
    {expiresIn:process.env.JWT_EXPRIRES_IN||'1h'}    
)
//return info with token
res.status(201).send({
    message:"Signup successful",
    token,
    id:user._id,
    username:user.username,
    email:user.email,
    role:user.role
});
})

// GET /api/users/all - Get all students (admin only)
router.get('/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send('Only admins can view all students');
        }
        
        const students = await User.find({ role: 'student' }).select('-passwordHash').populate('profile');
        res.send(students);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports=router;