const jwtSecret = 'your_jwt_secret'; // key as used in JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');


let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256' // alrgorithm used to sign / encode the values of the JWT
  });
}

/**
 * Route to handle user login and generate a JWT token.
 * @tags POST /login
 * @param {object} req - Express request object, containing username and password.
 * @param {object} res - Express response object.
 * @returns {object} - 200 Success response - user data and JWT token.
 * @returns {Error} - 400 Error response - if login fails.
 * @returns {Error} - 500 Error response - server error.
 */

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token }); // ES6 short version of res.json({ user: user, token: token })
      });
    })(req, res);
  });
}