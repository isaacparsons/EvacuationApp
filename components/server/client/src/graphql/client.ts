import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://44.229.20.115:4000/graphql',
  // uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

export default client;
