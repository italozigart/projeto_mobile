import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../app/(tabs)/index";
import { SHARED } from "../../constants/theme";

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
                        <TouchableOpacity style={SHARED.button} onPress={() => navigation.navigate("LoginUser")}>
                            <Text style={SHARED.buttonText}>INICIAR</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={SHARED.button} onPress={() => navigation.navigate("RegisterUser")}>
                            <Text style={SHARED.buttonText}>CADASTRAR</Text>
                        </TouchableOpacity>

                        <Text style={styles.link}>Saiba Mais</Text>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { flex: 1, justifyContent: "flex-end", alignItems: "center", width: "100%", height: "100%", paddingBottom: 50 },
    buttonContainer: { width: "80%", alignItems: "center", rowGap: 20 },
    link: { color: "#fff", fontFamily: "Jomhuria", fontSize: 12, textDecorationLine: "underline" },
});