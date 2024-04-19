import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import {
  LocationAccuracy,
  LocationObject,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from 'expo-location';
import { styles } from './styles';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<LocationObject | null>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          pitch: 70,
          center: response.coords
        })
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      )}
    </View>
  );
}
