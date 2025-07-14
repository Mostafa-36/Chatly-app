export default (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
      status: err.status,
    });
  }
  res.status(500).json({
    message: "internal server error: something went very wrong...",
    status: "error",
  });
};
