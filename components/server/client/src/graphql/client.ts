import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  // uri: 'http://34.196.64.202:4000/graphql',
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

export default client;
