import { StatusCodes } from "http-status-codes";

export const NotFound = (_, res) =>
  res.status(StatusCodes.NOT_FOUND).send("Routes not found!");
