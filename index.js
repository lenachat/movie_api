const express = require('express'),
  morgan = require('morgan'),
  path = require('path');

const app = express();

let topMovies = [
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling'
  },
  {
    title: 'Lord of the Rings',
    author: 'J.R.R. Tolkien'
  },
  {
    title: 'Twilight',
    author: 'Stephanie Meyer'
  }
];

app.use(morgan('common'));

app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome! MovieMate is your ultimate companion for exploring the world of cinema!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
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