const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../model/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value.toLowerCase() });
        if (user) {
          user.googleId = profile.id;
          await user.save();
        } else {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value.toLowerCase(),
            googleId: profile.id
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user,done)=>done(null,user)); // by using serializeUser save user to session
passport.deserializeUser((user,done)=>done(null,user)) //by using serializeUser read user to session
