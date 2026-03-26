import {
    ImageBackground,
    SafeAreaView,
    StyleSheet
} from "react-native";

export default function UserHome() {
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/fundo.png")}
                style={styles.image}
                resizeMode="cover"
            >
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
    },
});