import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Your Apollo Server URI
  cache: new InMemoryCache()
});

export default client;