import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const App = () => {
  const [localizacao, setLocalizacao] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [erroMsg, setErroMsg] = useState(null);

  useEffect(() => {
    const obterPermissao = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErroMsg("Permissão para acessar a localização foi negada");
        return;
      }

      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setLocalizacao({
        ...localizacao,
        latitude: localizacaoAtual.coords.latitude,
        longitude: localizacaoAtual.coords.longitude,
      });

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (novaLocalizacao) => {
          setLocalizacao({
            ...localizacao,
            latitude: novaLocalizacao.coords.latitude,
            longitude: novaLocalizacao.coords.longitude,
          });
        }
      );
    };

    obterPermissao();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapa}
        region={localizacao}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: localizacao.latitude,
            longitude: localizacao.longitude,
          }}
          pinColor="red"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapa: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
