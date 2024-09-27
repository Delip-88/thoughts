import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./config/db_config.js";
import { typeDefs } from "./model/Schema.js";
import resolvers from "./model/resolver.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/authenticate.js";
import path from 'path';
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend build folder
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  
  // Handle SPA routes and serve index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Middleware setup
app.use(cookieParser());
app.use(helmet()); // Security headers

// Rate Limiting Middleware for basic protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// CORS configuration with environment-based origin control
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? "https://your-production-domain.com" // Replace with your production domain
    : ["http://localhost:5173", "https://sandbox.apollo.dev"],
  credentials: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
console.log("CORS middleware applied");


// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    if (process.env.NODE_ENV === 'production') {
      // Don't expose stack trace or detailed error information in production
      delete err.extensions.exception;
    }
    return err;
  },
});

const startServer = async () => {
  console.log("Starting server...");
  await server.start();
  console.log("Apollo Server started");

  await connectDb();
  console.log("Database connected");

  app.use(
    "/graphql",
    bodyParser.json(),
    authenticate, // Ensure authenticate is a middleware function
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return { req, res }; // Properly set context with req and res
      },
    })
  );
  console.log("Apollo middleware applied");

  // Centralized error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack trace for server logs
    res.status(500).send("Something went wrong!"); // Send generic error message
  });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
};

startServer();
