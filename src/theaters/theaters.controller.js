const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  try {
    const theaters = await service.list();
    res.status(200).json({ data: theaters });
  } catch (error) {
    next(error); // Pass errors to the error handler middleware
  }
}
module.exports = {
  list: asyncErrorBoundary(list),
};
