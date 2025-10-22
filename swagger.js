import { configDotenv } from "dotenv";
import swaggerAutogen from "swagger-autogen";

configDotenv();

const docs = {
  info: {
    version: "1.0.0",
    title: "String Analyzer API",
    description:
      "A RESTful API service that analyzes strings and stores their computed properties",
  },
  basePath: "/",
  schemes: ["https"],
  host: process.env.HOST,
  tags: [
    { name: "Home" },
    { name: "Strings", description: "String Analyzer Endpoints" },
  ],
};

const generateDocs = swaggerAutogen();
generateDocs("./swagger.json", ["./app.js"], docs);
