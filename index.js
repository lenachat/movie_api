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
app.post('/users', (req, res) => {
  res.send('User has been registered.')
});

// update username
app.put('/users/:id/:username', (req, res) => {
  res.send('Username has been updated.')
});

// add movie to favorites
app.post('/users/:id/favorites/:movieTitle', (req, res) => {
  res.send('Movie has been added to favorites.')
});

// remove movie from favorites
app.delete('/users/:id/favorites/:movieTitle', (req, res) => {
  res.send('Movie has been removed from favorites.')
});

// deregister user
app.delete('/users/:id', (req, res) => {
  res.send('User has been removed.')
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