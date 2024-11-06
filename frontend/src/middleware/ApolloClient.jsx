import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const apiUrl =
  import.meta.env.VITE_MODE === "development"
    ? import.meta.env.VITE_GRAPHQL_API_URL
    : import.meta.env.VITE_SERVER_URL; // Use relative path in production

// Step 1: Create the HTTP link to your GraphQL server
const httpLink = createHttpLink({
  uri: apiUrl,
  credentials: "include", // Include cookies in requests
});

// Step 2: Create the Apollo Client instance
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;

// cache: new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         keyArgs: false,

//         merge(existing, incoming, { args: { offset = 0 } }) {
//           // Slicing is necessary because the existing data is
//           // immutable, and frozen in development.
//           const merged = existing ? existing.slice(0) : [];

//           for (let i = 0; i < incoming.length; ++i) {
//             merged[offset + i] = incoming[i];
//           }

//           return merged;
//         },
//       },
//     },
//   },
// }),