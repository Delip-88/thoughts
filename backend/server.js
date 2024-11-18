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
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { v2 as cloudinary } from "cloudinary";
import { createServer } from "http";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize RedisPubSub with added logging for Redis connection checks
const redisPublisher = new Redis(process.env.REDIS_URL);
const redisSubscriber = new Redis(process.env.REDIS_URL);
const pubsub = new RedisPubSub({
  publisher: redisPublisher,
  subscriber: redisSubscriber,
});

// Log Redis connection status
redisPublisher.on("connect", () => console.log("Connected to Redis for publisher"));
redisSubscriber.on("connect", () => console.log("Connected to Redis for subscriber"));
redisPublisher.on("error", (err) => console.error("Redis Publisher Error:", err));
redisSubscriber.on("error", (err) => console.error("Redis Subscriber Error:", err));

await redisPublisher.ping();
await redisSubscriber.ping();
console.log("Redis is ready.");


// Middleware setup
app.use(cookieParser());
app.use(helmet()); // Security headers

app.set("trust proxy", true);

// Rate Limiting Middleware for basic protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
app.use(limiter);


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// CORS configuration with environment-based origin control
const corsOptions = {
  origin: [process.env.CLIENT_URL, "https://sandbox.apollo.dev"],
  credentials: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Create schema from typeDefs and resolvers, including subscriptions
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Create HTTP server for both HTTP and WebSocket support
const httpServer = createServer(app);

// Create Apollo Server instance with schema
const server = new ApolloServer({
  schema,
});

const startServer = async () => {
  try {
    console.log("Starting server...");

    await server.start();
    console.log("Apollo Server started");

    await connectDb();
    console.log("Database connected");

    app.use(
      "/graphql",
      bodyParser.json(),
      authenticate,
      expressMiddleware(server, {
        context: async ({ req, res }) => {
          return { req, res, pubsub };
        },
      })
    );

    const wsServer = new WebSocketServer({
      server: httpServer,
      path: "/graphql",
    });

    useServer(
      {
        schema,
        context: async () => {
          return { pubsub };
        },
      },
      wsServer
    );

    httpServer.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
      console.log(`🚀 Subscriptions ready at ws://localhost:${port}/graphql`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit with failure code
  }
};


startServer();
