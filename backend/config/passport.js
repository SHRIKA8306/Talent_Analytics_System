const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../model/user');

// ────── ENV VAR CHECK ──────
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_REDIRECT_URL;

if (!clientID || clientID === 'YOUR_GOOGLE_CLIENT_ID') {
  console.error('❌ GOOGLE_CLIENT_ID is missing or invalid in .env file!');
} else {
  console.log('✅ Google OAuth Client ID loaded:', clientID.substring(0, 20) + '...');
}

// ────── GOOGLE OAUTH STRATEGY ──────
passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL
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

// ────── SERIALIZATION (store only user ID in session) ──────
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
