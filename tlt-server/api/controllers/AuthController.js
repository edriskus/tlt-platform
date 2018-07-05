/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/local');

module.exports = {

  login: function (req, res) {
    passport.authenticate('local', {session: false}, function (err, user, info) {
      if ((err) || (!user)) {
        return res.status(403).send({
          message: info.message,
          user
        });
      }
      req.logIn(user, {session: false}, function (err) {
        if (err) res.status(403).send(err);
        const token = jwt.sign(user, config.jwtPassphrase);
        return res.json({user, token});
      });
    })(req, res);
  },

  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  }

};
