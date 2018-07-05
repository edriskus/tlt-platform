const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt-nodejs');
const config = require('./local');

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findOne({
    id
  }, function (err, user) {
    cb(err, users);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'username',
  passportField: 'password'
}, function (username, password, cb) {

  User.findOne({
    username: username
  }, function (err, user) {
    if (err) return cb(err);
    if (!user) return cb(null, false, {
      message: 'Username not found'
    });

    bcrypt.compare(password, user.password, function (err, res) {
      if (!res) return cb(null, false, {
        message: 'Invalid Password'
      });

      let userDetails = {
        email: user.email,
        username: user.username,
        id: user.id
      };

      return cb(null, userDetails, {
        message: 'Login Succesful'
      });
    });
  });
}));

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtPassphrase,
    passReqToCallback: true
  },
  function (req, jwtPayload, cb) {

    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return User.findOne({
      id: jwtPayload.id
    }).then(user => {
      req.user = user; // <= Add this line
      return cb(null, user);
    }).catch(err => {
      return cb(err);
    });
  }
));
