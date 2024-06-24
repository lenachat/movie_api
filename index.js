const express = require('express'),
  morgan = require('morgan'),
  path = require('path');

const app = express();

let users = [
  {
    id: 1,
    username: 'John',
    email: 'john.doe@gmail.com'
  }
];

let topMovies = [
  {
    title: 'Hidden Figures',
    director: {
      name: 'Theodore Melfi',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Drama',
      description: ''
    }
  },
  {
    title: 'Forrest Gump',
    director: {
      name: 'Robert Zemeckis',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Adventure',
      description: ''
    }
  },
  {
    title: 'Inception',
    director: {
      name: 'Christopher Nolan',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Science-Fiction',
      description: ''
    }
  },
  {
    title: 'The Help',
    director: {
      name: 'Tate Taylor',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Drama',
      description: ''
    }
  },
  {
    title: 'Interstellar',
    director: {
      name: 'Christopher Nolan',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Science-Fiction',
      description: ''
    }
  },
  {
    title: '8 Mile',
    director: 'Curtis Hanson',
    director: {
      name: 'Curtis Hanson',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Music',
      description: ''
    }
  },
  {
    title: 'Intouchables',
    director: {
      name: 'Olivier Nakache, Éric Toledano',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Tragicomedy',
      description: ''
    }
  },
  {
    title: 'The Wolf of Wall Street',
    director: {
      name: 'Martin Scorsese',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Biography',
      description: ''
    }
  },
  {
    title: 'Barbie',
    director: {
      name: 'Greta Gerwig',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Comedy',
      description: ''
    }
  },
  {
    title: 'Top Gun',
    director: {
      name: 'Tony Scott, Joseph Kosinski',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Action',
      description: ''
    }
  },
  {
    title: 'The Greatest Showman',
    director: {
      name: 'Michael Gracey',
      biography: '',
      birth: ''
    },
    genre: {
      name: 'Musical',
      description: ''
    }
  },
];

app.use(morgan('common'));

app.use(express.static('public'));

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