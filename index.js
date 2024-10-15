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
 * @tags GET /
 * @returns {string} - 200 Success response - Welcome message
 */
app.get('/', (req, res) => {
  res.send('Welcome! MovieMate is your ultimate companion for exploring the world of cinema!');
});

/**
 * Route to retrieve all movies.
 * @tags GET movies
 * @param {string} path
 * @param {function} middleware - JWT authentication.
 * @returns {object} - 200 Success response - list of movies
 * @returns {Error} - 500 Error respone - server error message
 * @example
 * Request data format: none
 * Response data format: JSON
 * Response example:
 * [
 *  {
 *    "_id": "34576498fh3945hv039h2",
 *     "title": "Hidden Figures",
 *     "description": "The story of a team of female African-American mathematicians who served a vital role 
 *      in NASA during the early years of the U.S. space program.",
 *     "genre": {
 *       "name": "Drama",
 *       "description": "Drama is a film genre that emphasizes realistic storytelling and character development, 
 *        often dealing with serious, emotional, and thought-provoking themes. It focuses on the internal and 
 *        external conflicts of characters, aiming to evoke a strong emotional response from the audience.",
 *     },
 *     "director": {
 *       "name": "Theodore Melfi",
 *       "biography": "Theodore Melfi is an American film director, screenwriter, 
 *        and producer known for his work on the films \"St. Vincent\" and \"Hidden Figures\".",
 *       "birth": "1970",
 *       "death": ""
 *     },
 *     "actors": ["Taraji P. Henson", "Octavia Spencer", "Janelle Monáe"],
 *     "imagePath": "https://m.media-amazon.com/images/M/MV5BMjQxOTkxODUyN15BMl5BanBnXkFtZTgwNTU3NTM3OTE@._V1_.jpg",
 *     "age": "0",
 *     "rating": "7.8",
 *     "year": "2016",
 *     "length": "127 min"
 *   },
 *  {...}
 * ]
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
 * Route to retrieve information about a specific movie by title.
 * @tags GET movies/:title
 * @param {string} path - Movie title as path parameter.
 * @param {function} middleware - JWT authentication.
 * @returns {object} - 200 Success response - movie information.
 * @returns {Error} - 500 Error respone - server error message.
 * @example
 * Request data format: none
 * Response data format: JSON
 * Response example:
 * {
 *  "_id": "34576498fh3945hv039h2",
 *  "title": "Hidden Figures",
 *  "description": "The story of a team of female African-American mathematicians who served a vital role 
 *   in NASA during the early years of the U.S. space program.",
 *  "genre": {
 *    "name": "Drama",
 *    "description": "Drama is a film genre that emphasizes realistic storytelling and character development, 
 *     often dealing with serious, emotional, and thought-provoking themes. It focuses on the internal and 
 *     external conflicts of characters, aiming to evoke a strong emotional response from the audience.",
 *   },
 *   "director": {
 *     "name": "Theodore Melfi",
 *     "biography": "Theodore Melfi is an American film director, screenwriter, 
 *      and producer known for his work on the films \"St. Vincent\" and \"Hidden Figures\".",
 *     "birth": "1970",
 *     "death": ""
 *   },
 *   "actors": ["Taraji P. Henson", "Octavia Spencer", "Janelle Monáe"],
 *   "imagePath": "https://m.media-amazon.com/images/M/MV5BMjQxOTkxODUyN15BMl5BanBnXkFtZTgwNTU3NTM3OTE@._V1_.jpg",
 *   "age": "0",
 *   "rating": "7.8",
 *   "year": "2016",
 *   "length": "127 min"
 * }
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
 * Route to retrieve description of a specific genre.
 * @tags GET movies/genre/:name
 * @param {string} path - Genre name as path parameter.
 * @param {function} middleware - JWT authentication.
 * @returns {object} - 200 Success response - genre description.
 * @returns {Error} - 500 Error respone - server error message.
 * @example
 * Request data format: none
 * Response data format: JSON
 * Response example:
 * {
 *   "genre": {
 *    "name": "Drama",
 *    "description": "Drama is a film genre that emphasizes realistic storytelling and character development, 
 *     often dealing with serious, emotional, and thought-provoking themes. It focuses on the internal and 
 *     external conflicts of characters, aiming to evoke a strong emotional response from the audience."
 *   }
 * }
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
 * Route to retrieve information about a specific director by name.
 * @tags GET movies/director/:name
 * @param {string} path - Director name as path parameter.
 * @param {function} middleware - JWT authentication.
 * @returns {object} - 200 Success response - director information.
 * @returns {Error} - 500 Error respone - server error message.
 * @example
 * Request data format: none
 * Response data format: JSON
 * Response example:
 * {
 *   "director": {
 *     "name": "Theodore Melfi",
 *     "biography": "Theodore Melfi is an American film director, screenwriter, 
 *      and producer known for his work on the films \"St. Vincent\" and \"Hidden Figures\".",
 *     "birth": "1970",
 *     "death": ""
 *   }
 * }
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
 * Route to register a new user.
 * @tags POST /users
 * @param {array} middleware - Validation checks for username, password, and email.
 * @param {function} middleware - Hashes password, checks if username exists, creates new user.
 * @returns {object} - 200 Success response - created user information.
 * @returns {Error} - 400 Error response - username already exists.
 * @returns {Error} - 422 Error response - validation errors.
 * @returns {Error} - 500 Error response - server error message.
 * @example
 * Request data format: JSON
 * Request example:
 * {
 *   "username": "Enisa",
 *   "password": "12345678",
 *   "email": "enisa@gmail.com",
 *   "birthday": "1985-10-02"
 * }
 * 
 * Response data format: JSON
 * Response example:
 * {
 *   "_id": "667d2898ce584ed14052eff8",
 *   "username": "Enisa",
 *   "password": "12345678",
 *   "email": "enisa@gmail.com",
 *   "birthday": "1985-10-02T00:00:00.000Z",
 *   "favorites": []
 * }
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
          return res.status(400).send(req.body.username + ' already exists.');
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
 * Route to get user data by ID.
 * @tags GET /users/:id
 * @param {string} path - User ID as path parameter.
 * @param {function} middleware - JWT authentication.
 * @returns {object} - 200 Success response - user information.
 * @returns {Error} - 400 Error response - permission denied.
 * @returns {Error} - 500 Error response - server error message.
 * @example
 * Request data format: none
 * Response data format: JSON
 * Response example:
 * {
 *   "_id": "667d2898ce584ed14052eff8",
 *   "username": "Enisa",
 *   "password": "12345678",
 *   "email": "enisa@gmail.com",
 *   "birthday": "1985-10-02T00:00:00.000Z",
 *   "favorites": []
 * }
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
 * Route to update user data.
 * @tags PUT /users/:id
 * @param {string} path - User ID as path parameter.
 * @param {array} middleware - Validation checks for username, password, and email.
 * @param {function} middleware - JWT authentication, checks if user updates their own data, updates user data.
 * @returns {object} - 200 Success response - updated user information.
 * @returns {Error} - 400 Error response - permission denied.
 * @returns {Error} - 422 Error response - validation errors.
 * @returns {Error} - 500 Error response - server error message.
 * @example
 * Request data format: JSON
 * Request example:
 * {
 *   "username": "NewUsername",
 *   "password": "newPassword",
 *   "email": "new.email@gmail.com",
 *   "birthday": "1990-03-17"
 * }
 * 
 * Response data format: JSON
 * Response example:
 * {
 *   "_id": "667d2898ce584ed14052eff8",
 *   "username": "NewUsername",
 *   "password": "newPassword",
 *   "email": "new.email@gmail.com",
 *   "birthday": "1990-03-17T00:00:00.000Z",
 *   "favorites": []
 * }
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
 * Route to add a movie to favorites.
 * @tags POST /users/:id/favorites/:movieId
 * @param {string} path - User ID and movie ID as path parameters.
 * @param {function} middleware - JWT authentication, checks if user modifies their own data.
 * @returns {object} - 200 Success response - updated user information with new favorite.
 * @returns {Error} - 400 Error response - permission denied.
 * @returns {Error} - 500 Error response - server error message.
 * @example
 * Request data format: none
 * Response data format: JSON
 * Response example:
 * {
 *   "_id": "667d2898ce584ed14052eff8",
 *   "username": "Enisa",
 *   "password": "12345678",
 *   "email": "enisa@gmail.com",
 *   "birthday": "1985-10-02T00:00:00.000Z",
 *   "favorites": ["667ab189d2e4f08e1b79c88b"] //movie ID
 * }
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
 * Route to remove a movie from favorites.
 * @tags DELETE /users/:id/favorites/:movieId
 * @param {string} path - User ID and movie ID as path parameters.
 * @param {function} middleware - JWT authentication, checks if user modifies their own data.
 * @returns {object} - 200 Success response - updated user information with removed favorite.
 * @returns {Error} - 400 Error response - permission denied.
 * @returns {Error} - 500 Error response - server error message.
 * @example
 * Request data format: none
 * Response data format: JSON
 * Response example:
 * {
 *   "_id": "667d2898ce584ed14052eff8",
 *   "username": "Enisa",
 *   "password": "12345678",
 *   "email": "enisa@gmail.com",
 *   "birthday": "1985-10-02T00:00:00.000Z",
 *   "favorites": [""]
 * }
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
 * Route to delete a user profile.
 * @tags DELETE /users/:id
 * @param {string} path - User ID as path parameter.
 * @param {function} middleware - JWT authentication, checks if user deletes their own data.
 * @returns {object} - 200 Success response - user deletion message.
 * @returns {Error} - 400 Error response - permission denied.
 * @returns {Error} - 500 Error response - server error message.
 * * @example
 * Request data format: none
 * Response data format: string message - User was deleted.
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

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});