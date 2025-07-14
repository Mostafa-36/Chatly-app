import AppError from "./AppError.js";

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

export default handleJWTExpiredError;
