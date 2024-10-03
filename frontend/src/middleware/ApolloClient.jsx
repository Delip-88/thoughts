import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Step 1: Create the HTTP link to your GraphQL server
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
  credentials: 'include', // Include cookies in requests
});




// Step 2: Create the Apollo Client instance
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
