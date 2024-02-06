/**
 * this isn't application code, its just a mock middleware
 */
module.exports = function logger(req, _, next) {
  console.log(req.method, req.path);
  next();
};
