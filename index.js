const express = require('express'),
  morgan = require('morgan'),
  path = require('path');

const mongoose = require('mongoose');
const models = require('./models.js');

const movies = models.movie;
const users = models.user;

mongoose.connect('mongodb://127.0.0.1:27017/moviemateDB',
  { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome
app.get('/', (req, res) => {
  res.send('Welcome! MovieMate is your ultimate companion for exploring the world of cinema!');
});

// get complete movie list
app.get('/movies', async (req, res) => {
  movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get movie info
app.get('/movies/:title', async (req, res) => {
  await movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.status(200).json(movie);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get genre info
app.get('/movies/genre/:name', async (req, res) => {
  await movies.findOne({ "genre.name": req.params.name })
    .then((movies) => {
      res.status(200).json(movies.genre.description);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get director info
app.get('/movies/director/:name', async (req, res) => {
  await movies.findOne({ "director.name": req.params.name })
    .then((movies) => {
      res.status(200).json(movies.director);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// register new user
app.post('/users', async (req, res) => {
  await users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + ' already exists.');
      } else {
        users.create({
          username: req.body.username,
          password: req.body.password,
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

// update username
// app.put('/users/:id/:username', async (req, res) => {
//   await users.findOneAndUpdate(
//     { _id: req.params.id },
//     { $set: { username: req.params.username } },
//     { new: true }
//   ).then((updatedUser) => {
//     res.status(200).json(updatedUser);
//   })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     })
// });

app.put('/users/:id', async (req, res) => {
  await users.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday
      }
    },
    { new: true }
  ).then((updatedUser) => {
    res.status(200).json(updatedUser);
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// add movie to favorites
app.post('/users/:id/favorites/:movieId', async (req, res) => {
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

// remove movie from favorites
app.delete('/users/:id/favorites/:movieId', async (req, res) => {
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

// deregister user
app.delete('/users/:id', async (req, res) => {
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
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});