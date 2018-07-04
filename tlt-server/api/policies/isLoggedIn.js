const passport = require('passport');

// policies/isLoggedIn.js
module.exports = async function (req, res, proceed) {
  passport.authenticate('jwt', {session: false})(req, res, proceed);
};
