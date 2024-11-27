import React, { useEffect, useState } from 'react';
import { Button, View, Text, FlatList, StyleSheet, TouchableOpacity, DeviceEventEmitter, Linking, Alert } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import queryString from 'query-string';

const Stack = createStackNavigator();

const App = () => {

  // const [paramsApp1, setParamsApp1] = useState({
  //   param1: "",
  //   param2: ""
  // });

  useEffect(() => {
    // Listener para eventos enviados desde el código nativo
    const subscription = DeviceEventEmitter.addListener('openScreen', (screenName) => {
      console.log("screenName ===> ", screenName)
      if (screenName) {
        handleNavigation(screenName);
      }
    });

    // Limpieza al desmontar
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = event.url; // URL recibida
      if (url) {
        const parsed = queryString.parseUrl(url);
        const { param1, param2 } = parsed.query;
        // setParamsApp1({
        //   param1,
        //   param2
        // })
        Alert.alert('Parámetros recibidos', `Param1: ${param1}, Param2: ${param2}`);

      }
    };

    // Detecta si la app fue abierta con un enlace
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    Linking.addEventListener('url', handleDeepLink);

    // Limpia el listener
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  const handleNavigation = (screenName) => {
    // Accede al navegador global
    if (navigationRef.current?.navigate) {
      navigationRef.current.navigate(screenName);
    } else {
      console.warn('No se pudo navegar, el navegador no está disponible');
    }
  };

  const navigationRef = React.useRef();

  const linking = {
    // Los prefijos aceptados por el contenedor de navegación deben coincidir con los esquemas agregados (androidManifest)
    prefixes: ["testapp://"],
    // Configuración de ruta a mapear
    config: {
      // Nombre de ruta inicial que se agregará a la pila antes de cualquier navegación posterior.
      // Debe coincidir con una de las pantallas disponibles
      initialRouteName: "Home" as const,
      screens: {
        // testapp://home -> HomeScreen
        Home: "home",
        // testapp://details/1 -> DetailsScreen con param id: 1
        Details: "details",
      },
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef} //Para mantener la navegacion
      linking={linking} // Para configurar los App Links
      fallback={<Text>Cargando...</Text>} // Pantalla que se muestra al cargar
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "blue"
  },
  list: {
    width: '100%',
  },
  button: {
    padding: 10,
    borderBottomWidth: 1,
  },
});


/**
 * Screens
 */
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>APP 2</Text>
      <TouchableOpacity
        style={{ padding: 10, borderBottomWidth: 1 }}
        onPress={() => navigation.navigate("Details")}
      >
        <Text>CAMBIAR VISTA</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailsScreen({ route, navigation }) {

  const finalizarProceso = () => {
    const callbackUrl = `testgoogle://callback?status=${"PROCESO CORRECTO"}&resultado=${"OPERACION REALIZADA CON EXITO"}`;
    Linking.openURL(callbackUrl).catch((err) => {
      Alert.alert('Error', 'No se pudo devolver el callback a App 1.');
      console.error(err);
    });
  };

  return (
    <View style={styles.container}>
      <Text>
        PANTALLA DE CONSULTA
      </Text>
      <Button title="FINALIZAR" onPress={() => {
        finalizarProceso()
      }} />
    </View>
  );
}

export default App;
