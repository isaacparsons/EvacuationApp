import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://ec2-3-23-225-206.us-east-2.compute.amazonaws.com:4000',
  cache: new InMemoryCache()
});

export default client;
