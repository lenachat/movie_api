const jwtSecret = 'your_jwt_secret'; // key as used in JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');


let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: '7d',
    algorith: 'HS256' // alrgorithm used to sign / encode the values of the JWT
  });
}

/* POST login */
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