require('dotenv').config()
const express=require('express')
const cors=require('cors')
const db=require('./db.js')
const {User}=require('./model/user.js')
const userRoutes=require('./routes/user.js')
const authRoutes=require('./routes/auth.js')
const auths=require('./middleware/auth.js')
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const app=express()

//secret,resave,save uninitialize-in session from google
app.use(session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: true
}))

//initialize passport-by using passport the datas are disscused b/w our server and google,by using passport we can interact with google 
app.use(passport.initialize());
//tell passport to use the session
app.use(passport.session());

app.use(cors())
app.use(express.json())
app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)
db()
app.get('/',(_req,res)=>{
    res.send("Api is running ")
})
//jwt tokenverify
app.get('/api/me',auths,async(req ,res)=>{
    const me=await User.findById(req.user.id).select('-passwordHash')
    if(!me) return res.status(404).send("user not found")
    res.send(me)
})
app.get("/logout",(req,res)=>{
    req.logout(()=>{res.redirect("/")});
});
const port=process.env.PORT || 5000
app.listen(port,()=>console.log(`Listening on port ${port}`))