passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://koldin.hopto.org/oauth/google/callback',
  }, (async (accessToken, refreshToken, profile, done) => {
    console.dir(profile);
    done(null, profile);
  })));