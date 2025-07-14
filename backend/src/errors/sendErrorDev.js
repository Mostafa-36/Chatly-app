export default (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    stack: err.stack,
    err,
    status: err.status,
  });
};
