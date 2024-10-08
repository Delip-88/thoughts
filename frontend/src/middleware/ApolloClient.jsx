import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const apiUrl = import.meta.env.VITE_MODE === 'development' 
  ? import.meta.env.VITE_GRAPHQL_API_URL 
  : 'https://thoughts-ze7l.onrender.com/graphql'; // Use relative path in production


// Step 1: Create the HTTP link to your GraphQL server
const httpLink = createHttpLink({
  uri: apiUrl,
  credentials: 'include', // Include cookies in requests
});

// Step 2: Create the Apollo Client instance
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
