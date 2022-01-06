import React, {useEffect, useRef} from 'react';
import {useSubscription} from '@apollo/client';
import {StyleSheet, View, Text} from 'react-native';

import MapView, {Marker} from 'react-native-maps';

import SlidingUpPanel from 'rn-sliding-up-panel';

import CloseButton from './CloseButton';

import {CARS_SUBSCRIPTION} from '../utils/subscriptions';
import {Car} from '../utils/types';

const CarMap = () => {
  // At the top of this component you should subscribe to updates from the server.
  // See https://www.apollographql.com/docs/react/data/subscriptions/#executing-a-subscription
  const {data} = useSubscription(CARS_SUBSCRIPTION);

  const [cars, setCars] = React.useState<Car[]>([]);
  const [index, setIndex] = React.useState(-1);

  const panelEl = useRef<SlidingUpPanel>(null);

  const handleClose = () => {
    panelEl.current?.hide();
    setIndex(-1);
  };

  useEffect(() => panelEl.current?.show());

  useEffect(() => {
    setCars(data?.cars ?? []);
  }, [data]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.785091,
          longitude: -73.968258,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        }}>
        {data?.cars.map((car: Car, i: string) => (
          <Marker
            key={i}
            tracksViewChanges={false}
            coordinate={car?.location}
            onPress={() => setIndex(Number(car?.id) - 1)}
            image={require('./Car.png')}
            style={styles.marker}
          />
        ))}
      </MapView>
      {/* For documentation on the MapView see https://github.com/react-native-maps/react-native-maps */}
      {index !== -1 && (
        <SlidingUpPanel
          ref={panelEl}
          draggableRange={{top: 200, bottom: 0}}
          showBackdrop={false}
          allowDragging={false}>
          <View style={styles.panel}>
            <CloseButton onPress={handleClose} />
            <View>
              <Text style={styles.panelTitle}>{`Car #${cars[index].id}`}</Text>
              <Text style={styles.panelText}>{`Location: ${cars[
                index
              ].location.latitude.toFixed(5)}, ${cars[
                index
              ].location.longitude.toFixed(5)}`}</Text>
              <Text
                style={
                  styles.panelText
                }>{`Distance to destination: ${cars[index].distanceToDestination}`}</Text>
            </View>
          </View>
        </SlidingUpPanel>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingTop: 20,
  },
  marker: {
    height: 80,
    width: 80,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  panelText: {
    fontSize: 16,
  },
});

export default CarMap;
