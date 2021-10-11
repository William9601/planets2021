import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  HttpLink,
} from '@apollo/client';
import GetPlanets from './components/GetPlanets';

const link = from([
  new HttpLink({
    uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Text>
          <GetPlanets />
        </Text>
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
