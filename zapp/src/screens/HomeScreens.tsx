import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../app/(tabs)/index";

type NavProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <ImageBackground
          source={require("../../assets/images/fundo.png")}
          style={styles.image}
          resizeMode="cover"
        >
          <View style={styles.buttonContainer}>
            
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>INICIAR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RegisterUser")}>
              <Text style={styles.buttonText}>CADASTRAR</Text>
            </TouchableOpacity>

            <Text style={styles.text}>Saiba Mais</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingBottom: 50,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
    rowGap: 20,
  },
  button: {
    backgroundColor: "#B8860B",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Jomhuria",
  },
  text: {
    color: "#ffffff",
    fontFamily: "Jomhuria",
    fontSize: 12,
    textDecorationLine: "underline",
  },
});