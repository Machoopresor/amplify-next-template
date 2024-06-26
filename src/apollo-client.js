import { ApolloClient, InMemoryCache } from '@apollo/client';
import awsconfig from './aws-exports';// Asegúrate de que la ruta sea correcta

const client = new ApolloClient({
  uri: awsconfig.aws_appsync_graphqlEndpoint,
  cache: new InMemoryCache(),
  headers: {
    'x-api-key': awsconfig.aws_appsync_apiKey,
  },
});

export default client;