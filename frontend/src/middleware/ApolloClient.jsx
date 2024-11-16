import { ApolloClient, InMemoryCache, createHttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_GRAPHQL_SUBSCRIPTION_URL, 
  })
);

// Determine API URL based on environment
const apiUrl =
  import.meta.env.VITE_MODE === "development"
    ? import.meta.env.VITE_GRAPHQL_API_URL // Development URL
    : import.meta.env.VITE_SERVER_URL; // Production URL

// HTTP link for queries and mutations
const httpLink = createHttpLink({
  uri: apiUrl,
  credentials: "include", // Include cookies for authentication
});

// Split based on operation type (query/mutation vs subscription)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Use WebSocket for subscriptions
  httpLink // Use HTTP for queries and mutations
);

// Apollo Client instance
const client = new ApolloClient({
  link: splitLink, // Combined link
  cache: new InMemoryCache(), // Cache for local state and query results
});

export default client;
