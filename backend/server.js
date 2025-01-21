import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./config/db_config.js";
import resolvers from "./model/resolver.js";
import typeDefs from "./model/Schema.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/authenticate.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { v2 as cloudinary } from "cloudinary";
import { makeExecutableSchema } from "@graphql-tools/schema";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cookieParser());
app.use(helmet());

// Rate Limiting Middleware for basic protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
app.use(limiter);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// CORS configuration with environment-based origin control
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Create schema from typeDefs and resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create Apollo Server instance
const server = new ApolloServer({
  schema,
});

// Start the server
const startServer = async () => {
  try {
    console.log("Starting server...");

    // Start Apollo Server
    await server.start();
    console.log("Apollo Server started");

    // Connect to MongoDB
    await connectDb();
    console.log("Database connected");

    // Middleware for Apollo Server
    app.use(
      "/graphql",
      bodyParser.json(),
      authenticate,
      expressMiddleware(server, {
        context: async ({ req, res }) => {
          return { req, res }; // Pass request and response objects to context
        },
      })
    );

    // Start the HTTP server
    app.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit with failure code
  }
};

startServer();
