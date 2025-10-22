import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import { configDotenv } from "dotenv";

configDotenv();

export const securityMiddleware = app => {
  app.set("trust proxy", 1);
  // logger
  process.env.NODE_ENV === "development"
    ? app.use(morgan("dev"))
    : app.use(morgan("combined"));
  // body parser
  app.use(express.json({ limit: "50kb" }));
  // secure header
  app.use(helmet());
  // cors
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "DELETE"],
    })
  );
  // prevent http paramter pollution
  app.use(hpp());
};
