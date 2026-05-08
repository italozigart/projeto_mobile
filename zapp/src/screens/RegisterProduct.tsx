import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { push, ref } from "firebase/database";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { database } from "../../services/connectionFirebase";

export default function RegisterProduct() {

    const navigation: any = useNavigation();

    const [nome, setNome] = useState("");
    const [traducao, setTraducao] = useState("");
    const [editora, setEditora] = useState("");
    const [imagem, setImagem] = useState("");
    const [loading, setLoading] = useState(false);

    //mensagem atual do toast
    const [toastMessage, setToastMessage] = useState("");

    //opacidade animada do toast
    const toastOpacity = useRef(new Animated.Value(0)).current;

    //exibe toast verde por 2.5s — mesmo padrão do ProductList
    const showToast = (message: string) => {
        setToastMessage(message);

        Animated.timing(toastOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                Animated.timing(toastOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    //navega para UserHome somente após o toast desaparecer
                    navigation.navigate("UserHome");
                });
            }, 2500);
        });
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleRegisterProduct = async () => {
        setLoading(true);

        try {
            await push(ref(database, "products"), {
                nome: nome,
                traducao: traducao,
                editora: editora,
                imagem: imagem,
            });

            //limpa os campos após salvar
            setNome("");
            setTraducao("");
            setEditora("");
            setImagem("");

            //exibe toast e navega ao final dele
            showToast("Produto cadastrado com sucesso!");
        } catch (error: any) {
            Alert.alert("Erro", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/fundo.png")}
                style={styles.image}
                resizeMode="cover"
            >
                {/*toast verde — aparece após cadastro bem-sucedido*/}
                <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>

                <View style={styles.card}>
                    <TextInput
                        placeholder="Nome"
                        style={styles.input}
                        value={nome}
                        onChangeText={setNome}
                    />

                    <TextInput
                        placeholder="Tradução"
                        style={styles.input}
                        value={traducao}
                        onChangeText={setTraducao}
                    />

                    <TextInput
                        placeholder="Editora"
                        style={styles.input}
                        value={editora}
                        onChangeText={setEditora}
                    />

                    <TextInput
                        placeholder="URL da Imagem"
                        style={styles.input}
                        value={imagem}
                        onChangeText={setImagem}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegisterProduct}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <Text style={styles.buttonText}>SALVAR</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleGoBack}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>VOLTAR</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
    },
    card: {
        width: "100%",
        padding: 10,
        borderRadius: 10,
        elevation: 10,
    },
    input: {
        width: "100%",
        backgroundColor: "#f5f5f5",
        fontFamily: "Jomhuria",
        height: 45,
        borderWidth: 2,
        borderColor: "#B8860B",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 12,
    },
    image: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingBottom: 100,
    },
    buttonContainer: {
        width: "80%",
        alignItems: "center",
        rowGap: 10,
        paddingBottom: -200,
    },
    button: {
        backgroundColor: "#B8860B",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Jomhuria",
    },
    //toast verde — mesmo padrão do LoginUser e ProductList
    toast: {
        position: "absolute",
        top: 60,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2e7d32",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 8,
        zIndex: 99,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    toastText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});