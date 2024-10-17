# MovieMate - API

MovieMate is a web application that provides users with access to information about movies, directors, and genres. Users can sign up, update their personal information, and create a list of their favorite movies. This repository contains the server-side component of the app, which is a REST API built using Node.js, Express, and MongoDB.

## Features

- **User Registration & Authentication**: 
  - New users can register an account.
  - Existing users can log in with their credentials.
  
- **Movie Information**:
  - Users can retrieve a list of all movies.
  - Get detailed information about a movie, including its description, genre, director, movie image, main actors, 
  release year, age restriction, runtime, and rating.
  
- **Genre & Director Information**:
  - Users can view details about movie genres (e.g., description of the genre).
  - Users can get information about directors, including biography and birth year.

- **User Profile Management**:
  - Users can update their profile information (username, password, email, date of birth).
  - Add or remove movies from their list of favorite movies.
  - Deregister their account if needed.

## API Endpoints

- **Movies**:
  - `GET /movies`: Returns a list of all movies.
  - `GET /movies/:title`: Returns data about a single movie by its title.
  
- **Genres**:
  - `GET /genres/:name`: Returns data about a genre by its name.
  
- **Directors**:
  - `GET /directors/:name`: Returns data about a director, including their bio and birth year.

- **Users**:
  - `POST /users`: Registers a new user.
  - `PUT /users/:id`: Updates an existing user's information.
  - `POST /users/:id/movies/:movieId`: Adds a movie to the user's list of favorites.
  - `DELETE /users/:id/movies/:movieId`: Removes a movie from the user's list of favorites.
  - `DELETE /users/:id`: Deregisters the user.

## Technologies Used

- **Node.js**: JavaScript runtime used for server-side development.
- **Express**: Web framework for creating the REST API.
- **MongoDB**: NoSQL database to store movie and user data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **JSON Web Tokens (JWT)**: Used for user authentication.
- **Render**: Cloud platform for deploying the API.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/lenachat/movie_api.git
    ```

2. Navigate into the project directory:
    ```bash
    cd movie_api
    ```

3. Install the required dependencies:
    ```bash
    npm install
    ```

4. Start the server:
    ```bash
    npm start
    ```

5. Test the API using [Postman](https://www.postman.com/) or any API testing tool.

## Database

The database is built using MongoDB, and all movie and user data is stored in a non-relational format. Mongoose is used to define schemas and handle data validation.

## Authentication & Security

- The API uses JWT for secure user authentication.
- User passwords are hashed for security.
- Data validation and security measures are implemented to ensure safe handling of user information.

## Deployment

The API is deployed on Render and accessible via a publicly available URL. You can view the live API here: https://moviemate-mk9e.onrender.com
