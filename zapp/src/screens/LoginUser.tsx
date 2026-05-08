import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { auth } from "../../services/connectionFirebase";

export default function LoginUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigation: any = useNavigation();
    const route: any = useRoute();

    //toast — cor e mensagem configuráveis igual ao restante do sistema
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
        //exibe toast verde se vier do cadastro
        if (route.params?.fromRegister) {
            showToast("Cadastro realizado com sucesso!", "#2e7d32");
        }
    }, []);

    const validate = () => {
        let valid = true;

        setEmailError("");
        setPasswordError("");

        if (!email.trim()) {
            setEmailError("Email é obrigatório.");
            valid = false;
        }

        if (!password.trim()) {
            setPasswordError("Senha é obrigatória.");
            valid = false;
        }

        return valid;
    };

    //traduz os códigos de erro do Firebase para mensagens amigáveis em português
    const getFirebaseErrorMessage = (code: string) => {
        switch (code) {
            case "auth/user-not-found":
                return "Email não cadastrado.";
            case "auth/wrong-password":
                return "Senha incorreta.";
            case "auth/invalid-email":
                return "Email inválido.";
            case "auth/invalid-credential":
                return "Email ou senha incorretos.";
            case "auth/too-many-requests":
                return "Muitas tentativas. Tente novamente mais tarde.";
            case "auth/user-disabled":
                return "Esta conta foi desativada.";
            default:
                return "Erro ao entrar. Verifique seus dados.";
        }
    };

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate("UserHome");
        } catch (error: any) {
            //toast vermelho com mensagem amigável traduzida do código Firebase
            showToast(getFirebaseErrorMessage(error.code), "#cc0000");
        } finally {
            setLoading(false);
        }
    };

    const handleHomeScreens = () => navigation.goBack();

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/fundo.png")}
                style={styles.image}
                resizeMode="cover"
            >
                {/*toast — verde para sucesso do cadastro, vermelho para erros de login*/}
                <Animated.View style={[styles.toast, { opacity: toastOpacity, backgroundColor: toastColor }]}>
                    <Ionicons
                        name={toastColor === "#2e7d32" ? "checkmark-circle-outline" : "alert-circle-outline"}
                        size={18}
                        color="#fff"
                    />
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>

                <View style={styles.card}>

                    <TextInput
                        placeholder="Email"
                        style={[styles.input, emailError ? styles.inputError : null]}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setEmailError("");
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
                        <TextInput
                            placeholder="Senha"
                            style={styles.passwordInput}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setPasswordError("");
                            }}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={22}
                                color="#B8860B"
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <Text style={styles.buttonText}>ENTRAR</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleHomeScreens}
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
    image: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingBottom: 100,
    },
    card: {
        width: "90%",
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
        marginBottom: 4,
    },
    inputError: {
        borderColor: "#cc0000",
    },
    errorText: {
        color: "#cc0000",
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 4,
    },
    passwordContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderWidth: 2,
        borderColor: "#B8860B",
        borderRadius: 8,
        marginBottom: 4,
    },
    passwordInput: {
        flex: 1,
        fontFamily: "Jomhuria",
        height: 45,
        paddingHorizontal: 10,
    },
    eyeButton: {
        paddingHorizontal: 10,
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