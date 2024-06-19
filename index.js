const express = require('express'),
  morgan = require('morgan'),
  path = require('path');

const app = express();

let topMovies = [
  {
    title: 'Hidden Figures',
    director: 'Theodore Melfi'
  },
  {
    title: 'Forrest Gump',
    director: 'Robert Zemeckis'
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan'
  },
  {
    title: 'The Help',
    director: 'Tate Taylor'
  },
  {
    title: 'Interstellar',
    director: 'Christopher Nolan'
  },
  {
    title: '8 Mile',
    director: 'Curtis Hanson'
  },
  {
    title: 'The Untouchables',
    director: 'Olivier Nakache, Éric Toledano'
  },
  {
    title: 'The Wolf of Wall Street',
    director: 'Martin Scorsese'
  },
  {
    title: 'Barbie',
    director: 'Greta Gerwig'
  },
  {
    title: 'Top Gun',
    director: 'Tony Scott, Joseph Kosinski'
  },
  {
    title: 'The Greatest Showman',
    director: 'Michael Gracey'
  },
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