import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Button } from 'react-native';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { LOAD_PLANETS } from '../GraphQL/Queries';
import { Accelerometer } from 'expo-sensors';
const _ = require('lodash');

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

  const clickEvent = () => {
    setNum(randomNumber(1, 60));
  };

  console.log(data);

  const configureShake = (onShake) => {
    // update value every 100ms.
    // Adjust this interval to detect
    // faster (20ms) or slower shakes (500ms)
    Accelerometer.setUpdateInterval(300);

    // at each update, we have acceleration registered on 3 axis
    // 1 = no device movement, only acceleration caused by gravity
    const onUpdate = ({ x, y, z }) => {
      // compute a total acceleration value, here with a square sum
      // you can eventually change the formula
      // if you want to prioritize an axis
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      // Adjust sensibility, because it can depend of usage (& devices)
      const sensibility = 1.8;
      if (acceleration >= sensibility) {
        onShake(acceleration);
      }
    };

    Accelerometer.addListener(onUpdate);
  };

  // usage :
  const subscription = configureShake((acceleration) => {
    const randomId = setNum(randomNumber(1, 60));
    _.debounce(randomId, 3000);
    console.log('shake with acceleration ' + acceleration);
  });

  // when you're done, don't forget to unsubscribe
  // Accelerometer.removeAllListeners();

  return (
    planet && (
      <View>
        <Text>{planet}</Text>

        {films.length > 0 && (
          <FlatList
            data={films}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <Text>{item.title}</Text>
              </View>
            )}
          />
        )}
        <Button onPress={clickEvent} title={'click'}></Button>
      </View>
    )
  );
}
