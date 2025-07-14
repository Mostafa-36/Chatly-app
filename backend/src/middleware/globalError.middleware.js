import errorHandlersList from "../errors/errorHandlersList.js";
import sendErrorDev from "../errors/sendErrorDev.js";
import sendErrorProd from "../errors/sendErrorProd.js";

export default (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "production") {
    let error = {
      ...err,
      message: err.message,
      name: err.name,
      stack: err.stack,
    };

    for (let handler of errorHandlersList) {
      if (handler.match(error)) {
        error = handler.helper(error);
      }
    }

    sendErrorProd(error, res);
  } else {
    sendErrorDev(err, res);
  }
};
