const express = require('express'),
  morgan = require('morgan'),
  path = require('path');

const mongoose = require('mongoose');
const models = require('./models.js');

const { check, validationResult } = require('express-validator');

const movies = models.movie;
const users = models.user;

//mongoose.connect('mongodb://127.0.0.1:27017/moviemateDB',
//{ useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI,
  { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);

app.use(express.urlencoded({ extended: true }));

const passport = require('passport');
require('./passport');

/**
 * Route to display a welcome message on the homepage.
 */
app.get('/', (req, res) => {
  res.send('Welcome! MovieMate is your ultimate companion for exploring the world of cinema!');
});



/**
 * GET a list of all movies.
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 * GET data of a movie by title.
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.status(200).json(movie);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET data of a specific genre by name.
 */
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await movies.findOne({ "genre.name": req.params.name })
    .then((movies) => {
      res.status(200).json(movies.genre.description);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET data of a specific director by name.
 */
app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await movies.findOne({ "director.name": req.params.name })
    .then((movies) => {
      res.status(200).json(movies.director);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * POST user data to register a new user.
 */
app.post('/users',
  [
    check('username', 'Username is required.').isLength({ min: 2 }),
    check('username', 'Username must not contain non alphanumeric characters.').isAlphanumeric(),
    check('password', 'Password is required. Minimum length 8 characters.').isLength({ min: 8 }),
    check('email', 'Email address is required.').not().isEmpty(),
    check('email', 'Email address is not valid.').isEmail(),
  ],
  async (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = users.hashPassword(req.body.password);
    await users.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          return res.status(400).json({ message: `${req.body.username}  already exists.` });
        } else {
          users.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthday: req.body.birthday
          })
            .then((user) => {
              res.status(200).json(user);
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

/**
 * GET user data by ID.
 */
app.get('/users/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {

  //condition to check if user changes its own data only
  if (req.user.id !== req.params.id) {
    return res.status(400).send('Permission denied');
  }

  await users.findById({ _id: req.params.id })
    .then((user) => {
      res.status(200).json(user);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
})

/**
 * PUT user data to update user information by ID.
 */
app.put('/users/:id', passport.authenticate('jwt', { session: false }),

  [
    check('username', 'Username is required.').optional().isLength({ min: 2 }),
    check('username', 'Username must not contain non alphanumeric characters.').optional().isAlphanumeric(),
    check('password', 'Password is required. Minimum length 8 characters.').optional().isLength({ min: 8 }),
    check('email', 'Email address is required.').optional().not().isEmpty(),
    check('email', 'Email address is not valid.').optional().isEmail(),
  ],


  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //condition to check if user changes its own data
    if (req.user.id !== req.params.id) {
      return res.status(400).send('Permission denied');
    }

    //building the update object dynamically
    let updateObject = {};
    if (req.body.username) { updateObject.username = req.body.username };
    if (req.body.password) { updateObject.password = users.hashPassword(req.body.password) };
    if (req.body.email) { updateObject.email = req.body.email };
    if (req.body.birthday) { updateObject.birthday = req.body.birthday };

    await users.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateObject },
      { new: true }
    ).then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      })
  });

/**
 * POST to add a movie to user's list of favorites.
 */
app.post('/users/:id/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {

  //condition to check if user changes its own data only
  if (req.user.id !== req.params.id) {
    return res.status(400).send('Permission denied');
  }

  await users.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { favorites: req.params.movieId } },
    { new: true }
  ).then((updatedUser) => {
    res.status(200).json(updatedUser);
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

/**
 * DELETE to remove a movie from user's list of favorites.
 */
app.delete('/users/:id/favorites/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {

  //condition to check if user changes its own data only
  if (req.user.id !== req.params.id) {
    return res.status(400).send('Permission denied');
  }

  await users.findOneAndUpdate({ _id: req.params.id },
    { $pull: { favorites: req.params.movieId } },
    { new: true }
  ).then((updatedUser) => {
    res.status(200).json(updatedUser);
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

/**
 * DELETE to delete a user profile from the application.
 */
app.delete('/users/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {

  //condition to check if user changes its own data only
  if (req.user.id !== req.params.id) {
    return res.status(400).send('Permission denied');
  }

  await users.findOneAndDelete({ _id: req.params.id }).then((user) => {
    res.status(200).send('User was deleted.');
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

/**
* Error handling middleware
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

/**
 * Listen for port requests
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});