import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { TextInputMask } from "react-native-masked-text";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function UserPerfil() {
    const navigation: any = useNavigation();

    const auth = getAuth();
    const user = auth.currentUser;

    const [userData, setUserData] = useState<any>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cellphone, setCellPhone] = useState("");

    //loading do botão salvar
    const [loading, setLoading] = useState(false);

    //toast — mesma lógica do restante do sistema
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("#2e7d32");
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const showToast = (message: string, color: string = "#2e7d32") => {
        setToastMessage(message);
        setToastColor(color);

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
                }).start();
            }, 2500);
        });
    };

    useEffect(() => {
        if (user) {
            const db = getDatabase();
            const userRef = ref(db, "users/" + user.uid);

            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                setUserData(data);
                setName(data?.name || "");
                setEmail(user.email || "");
                setCellPhone(data?.cellphone || "");
            });
        }
    }, []);

    async function handleUpdateProfile() {
        if (!user) return;

        setLoading(true);

        try {
            const db = getDatabase();
            const userRef = ref(db, "users/" + user.uid);

            await update(userRef, {
                name: name,
                cellphone: cellphone,
            });

            //toast verde de sucesso
            showToast("Dados atualizados com sucesso!");
        } catch (error: any) {
            //toast vermelho de erro
            showToast("Não foi possível atualizar os dados.", "#cc0000");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/fundo.png")}
                style={styles.image}
                resizeMode="cover"
            >
                {/*toast — verde para sucesso, vermelho para erro*/}
                <Animated.View style={[styles.toast, { opacity: toastOpacity, backgroundColor: toastColor }]}>
                    <Ionicons
                        name={toastColor === "#2e7d32" ? "checkmark-circle-outline" : "alert-circle-outline"}
                        size={18}
                        color="#fff"
                    />
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>

                <View style={styles.content}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Perfil</Text>

                        <Text style={styles.label}>Nome:</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Digite seu nome"
                        />

                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>
                            {email || "Carregando..."}
                        </Text>

                        <Text style={styles.label}>Telefone:</Text>
                        <TextInputMask
                            type={"cel-phone"}
                            options={{ maskType: "BRL", withDDD: true, dddMask: "(99) " }}
                            style={styles.input}
                            value={cellphone}
                            onChangeText={setCellPhone}
                            placeholder="Digite seu telefone"
                            keyboardType="numeric"
                        />

                        {/*botão salvar padronizado com #B8860B e loading*/}
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleUpdateProfile}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator size="small" color="#fff" />
                                : <Text style={styles.saveButtonText}>Salvar alterações</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => navigation.navigate("HomeScreen")}
                >
                    <Ionicons name="log-out-outline" size={28} color="#fff" />
                </TouchableOpacity>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("UserHome")}
                    >
                        <Ionicons name="home" size={30} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("RegisterProduct")}
                    >
                        <Ionicons name="add-circle-outline" size={30} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("ProductList")}
                    >
                        <Ionicons name="list-outline" size={30} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="person" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginTop: 10,
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
    },
    //inputs agora seguem o padrão do sistema: borda #B8860B, fundo #f5f5f5
    input: {
        width: "100%",
        backgroundColor: "#f5f5f5",
        fontFamily: "Jomhuria",
        height: 45,
        borderWidth: 2,
        borderColor: "#B8860B",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    //botão salvar agora segue o padrão #B8860B do sistema
    saveButton: {
        marginTop: 20,
        backgroundColor: "#B8860B",
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Jomhuria",
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
    toast: {
        position: "absolute",
        top: 60,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
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