import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-error.js";

export class UnprocessableEntityError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}
