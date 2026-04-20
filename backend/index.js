require('dotenv').config()
const express=require('express')
const cors=require('cors')
const db=require('./db.js')
const {User}=require('./model/user.js')
const userRoutes=require('./routes/user.js')
const authRoutes=require('./routes/auth.js')
const profileRoutes=require('./routes/profile.js')
const aiRoutes=require('./routes/ai_generate.js')
const auths=require('./middleware/auth.js')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./config/passport');

const app=express()

// ────── SESSION CONFIGURATION (Persistent) ──────
app.use(session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: false, // Don't create session until something is stored
    store: MongoStore.create({
        mongoUrl: process.env.DB,
        ttl: 14 * 24 * 60 * 60, // 14 days
        autoRemove: 'native' 
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}))

//initialize passport-by using passport the datas are disscused b/w our server and google,by using passport we can interact with google 
app.use(passport.initialize());
//tell passport to use the session
app.use(passport.session());

app.use(cors({
    origin: 'https://techtalentify.netlify.app',
    credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/profile',profileRoutes)
app.use('/api/student/profile', profileRoutes)
app.use('/api/student', profileRoutes)
app.use('/api/ai', aiRoutes)
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
const port=process.env.PORT || 4000
app.listen(port,()=>console.log(`Listening on port ${port}`))