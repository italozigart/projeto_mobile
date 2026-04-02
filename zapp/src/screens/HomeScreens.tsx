import React from "react";
import { useNavigation } from "@react-navigation/native"; //recurso pra navegar entre telas
import { StackNavigationProp } from "@react-navigation/stack"; //navegação "empilhada" pra evitar erros de rota
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaProvider,
    SafeAreaView,
} from "react-native-safe-area-context";
import { RootStackParamList } from "../../app/(tabs)/index";

//tipa as rotas disponíveis no navigation
type NavProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
    //hook (permite ciclo de vida em funções simples) que permite navegar entre telas
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
                        {/*vai para tela de login usando onPress*/}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("LoginUser")}
                        >
                            <Text style={styles.buttonText}>INICIAR</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("RegisterUser")}
                        >
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
    container: { flex: 1 },
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