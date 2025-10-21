import "express-async-error";

import fs from "fs";
import express from "express";
import {
  NotFound,
  rateLimiter,
  ErrorHandler,
  securityMiddleware,
} from "./middlewares/index.js";
import { configDotenv } from "dotenv";
import connectDb from "./db/connect.js";
import SwaggerUI from "swagger-ui-express";
import stringRouter from "./routes/string.js";

configDotenv();

const app = express();
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf-8"));

// security middleware
securityMiddleware(app);
// swagger docs
app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));
// api rate limit
app.use("/api/v1", rateLimiter);
// routes
app.get("/", (_, res) =>
  /* #swagger.tags = ['Home'] */
  res.send(
    '<h1>String Analyzer API</h1><a href="/api-docs">Swagger Documentation</a>'
  )
);
app.use("/api/v1/strings", /* #swagger.tags = ['Strings'] */ stringRouter);

// error handler
app.use(NotFound);
app.use(ErrorHandler);

// self-invoked function
(async () => {
  const port = process.env.PORT || 3000;
  try {
    await connectDb();
    app.listen(port, () => {
      console.log("Server running at port:", port);
    });
  } catch (error) {
    console.log("Error while running app:", error.message);
  }
})();
