const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../model/user');

// ────── GOOGLE OAUTH (SINGLE SETUP FOR BOTH STUDENT AND ADMIN) ──────
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

// ────── SERIALIZATION ──────
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
