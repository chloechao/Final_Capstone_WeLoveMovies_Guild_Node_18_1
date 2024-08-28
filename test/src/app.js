const express = require("express");
const cors = require("cors");
const theatersRouter = require("./theaters/theaters.router");
const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");

function notFound(req, res, next) {
    res.status(404).json({ error: `Path not found: ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
    console.error(error); // Log the error
    const { status = 500, message = "Something went wrong!" } = error;
    res.status(status).json({ error: message });
}
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/theaters", theatersRouter);
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);

// Handle 404 for unknown routes
app.use(notFound);

// Handle errors
app.use(errorHandler);

module.exports = app;
