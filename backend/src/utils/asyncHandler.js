/**
 * Wraps async route handlers to catch uncaught errors and pass them to the express error middleware.
 * @param {Function} fn - Async controller function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
