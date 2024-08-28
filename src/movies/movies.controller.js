const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware to check if the movie exists
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: "Movie cannot be found." });
}

// Handler to respond with a list of movies
async function list(req, res, next) {
  try {
    const { is_showing } = req.query;
    const movies = await service.list(is_showing);

    // Send a 200 status code along with the response
    res.status(200).json({ data: movies });
  } catch (error) {
    // Pass any error to the error handler middleware
    next(error);
  }
}

// Handler to respond with a single movie by ID
async function read(req, res) {
  res.json({ data: res.locals.movie });
}

// Handler to respond with a list of theaters for a specific movie
async function listTheatersByMovie(req, res) {
  const { movieId } = req.params;
  const theaters = await service.listTheatersByMovie(movieId);
  res.json({ data: theaters });
}

// Handler to respond with a list of reviews for a specific movie
async function listReviewsByMovie(req, res) {
  const { movieId } = req.params;
  const reviews = await service.listReviewsByMovie(movieId);
  res.json({ data: reviews });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  listTheatersByMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheatersByMovie),
  ],
  listReviewsByMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviewsByMovie),
  ],
};
