import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://52.43.200.19:4000/graphql',
  // uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

export default client;
