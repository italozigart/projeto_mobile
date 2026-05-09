import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SHARED } from "../../constants/theme";

export default function UserHome() {
    const navigation: any = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require("../../assets/images/fundo.png")} style={styles.image} resizeMode="cover">

                <TouchableOpacity style={SHARED.logoutButton} onPress={() => navigation.navigate("HomeScreen")}>
                    <Ionicons name="log-out-outline" size={28} color="#fff" />
                </TouchableOpacity>

                <View style={SHARED.footer}>
                    <TouchableOpacity style={styles.btn}>
                        <Ionicons name="home" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("RegisterProduct")}>
                        <Ionicons name="add-circle-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("ProductList")}>
                        <Ionicons name="list-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("UserPerfil")}>
                        <Ionicons name="person" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { flex: 1, width: "100%", height: "100%", justifyContent: "flex-end" },
    btn: { padding: 10 },
});