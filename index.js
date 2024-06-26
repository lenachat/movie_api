const express = require('express'),
  morgan = require('morgan'),
  path = require('path'),
  mongoose = require('mongoose');

const models = require('./models.js');

const movies = models.movie,
  users = models.user;

mongoose.connect('mongodb://localhost:27017/moviemateDB',
  { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: ture }));

// Welcome
app.get('/', (req, res) => {
  res.send('Welcome! MovieMate is your ultimate companion for exploring the world of cinema!');
});

// get complete movie list
app.get('/movies', (req, res) => {
  res.status(200).json(topMovies);
});

// get movie info
app.get('/movies/:movieTitle', (req, res) => {
  res.status(200).send('Returns data on a single movie with [movieTitle]');
});

// get genre info
app.get('/movies/genre/:genreName', (req, res) => {
  res.send('Returns description about a genre with [genreName] ');
});

// get director info
app.get('/movies/director/:directorName', (req, res) => {
  res.send('Returns data about a director with [directorName]');
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