import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "../errors/custom-error.js";

export const ErrorHandler = (err, req, res, next) => {
  const statusCode =
    err instanceof CustomApiError
      ? err.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({ status: "error", message: err.message });
};
