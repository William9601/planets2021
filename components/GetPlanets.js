import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { LOAD_PLANETS } from '../GraphQL/Queries';
import { Accelerometer } from 'expo-sensors';

export default function GetPlanets() {
  const [num, setNum] = useState(0);
  const [planet, setPlanet] = useState('');
  const [films, setFilms] = useState([]);

  useEffect(() => {
    setNum(randomNumber(1, 60));
  }, []);

  const { data } = useQuery(LOAD_PLANETS, {
    variables: {
      planetID: num,
    },
  });

  useEffect(() => {
    if (data) {
      setPlanet(data.planet.name);
      setFilms(data.planet.filmConnection.films);
    }
  }, [data]);

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const configureShake = (onShake) => {
    Accelerometer.setUpdateInterval(300);

    const onUpdate = ({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const sensibility = 1.8;
      if (acceleration >= sensibility) {
        onShake(acceleration);
      }
    };

    Accelerometer.addListener(onUpdate);
  };

  const subscription = configureShake((acceleration) => {
    setNum(randomNumber(1, 60));
  });

  return (
    planet && (
      <View style={styles.contentCard}>
        <Text style={styles.planetTitle}>{planet}</Text>
        <View style={styles.filmsContent}>
          {films.length > 0 && (
            <FlatList
              data={films}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Text style={styles.filmName}>{item.title}</Text>
              )}
            />
          )}
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  contentCard: {
    borderRadius: 6,
    backgroundColor: '#FCD29F',
    padding: 18,
  },

  planetTitle: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
  },

  filmName: {
    textAlign: 'center',
  },
});
