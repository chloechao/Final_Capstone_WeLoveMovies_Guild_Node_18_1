const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  const { reviewId } = request.params;
  const review = await service.read(reviewId);

  if (review) {
    response.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
}

async function destroy(request, response) {
  const { reviewId } = request.params;
  await service.destroy(reviewId);
  response.sendStatus(204);
}

async function list(request, response, next) {
  try {
    const { movieId } = request.params;
    const data = await service.list(movieId);

    if (data.length > 0) {
      // If data exists, return it with a 200 OK status
      response.status(200).json({ data });
    } else {
      // If no data is found, you can return a 204 No Content or 404 depending on your requirement
      response.status(204).json({ data: [] });
    }
  } catch (error) {
    // Pass any errors to the error handler
    next(error);
  }
}


function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  const data = await service.update(updatedReview);
  response.json({ data });
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
