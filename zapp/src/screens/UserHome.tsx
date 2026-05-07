import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function UserHome() {

    const navigation: any = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/fundo.png")}
                style={styles.image}
                resizeMode="cover"
            >
                {/*botão no topo pra deslogar e retornar pra tela inicial */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => navigation.navigate("HomeScreen")}
                >
                    <Ionicons name="log-out-outline" size={28} color="#fff" />
                </TouchableOpacity>

                {/*menu inferior*/}
                <View style={styles.footer}>
                    {/*botão HOME sem ação pois ele é usado em outra tela pra voltar pra essa rsrs*/}
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="home" size={30} color="#fff" />
                    </TouchableOpacity>

                    {/*vai para tela de cadastro de produto*/}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("RegisterProduct")}
                    >
                        <Ionicons name="add-circle-outline" size={30} color="#fff" />
                    </TouchableOpacity>

                    {/*vai para tela de listagem de produtos*/}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("ProductList")}
                    >
                        <Ionicons name="list-outline" size={30} color="#fff" />
                    </TouchableOpacity>

                    {/*vai para tela de perfil*/}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("UserPerfil")}
                    >
                        <Ionicons name="person" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "flex-end",
    },
    footer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 15,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
    },
    button: {
        padding: 10,
    },
    logoutButton: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 10,
        borderRadius: 20,
    },
});