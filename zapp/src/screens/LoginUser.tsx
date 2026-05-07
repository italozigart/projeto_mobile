import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native"; //useRoute lê os params da navegação
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator, //ícone de carregando nativo do React Native
    Alert,
    Animated, //usado para a animação de fade do toast
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

    //controla o estado de carregamento durante a chamada ao Firebase
    const [loading, setLoading] = useState(false);

    const navigation: any = useNavigation();
    const route: any = useRoute(); //lê os params recebidos na navegação

    //valor animado que controla a opacidade do toast (começa invisível)
    const toastOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        //só exibe o toast se vier da tela de cadastro
        if (route.params?.fromRegister) {
            //fade in em 400ms
            Animated.timing(toastOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                //aguarda 4s visível e depois fade out em 600ms
                setTimeout(() => {
                    Animated.timing(toastOpacity, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }).start();
                }, 4000);
            });
        }
    }, []); //executa uma vez ao montar a tela

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

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true); //ativa o carregando antes de chamar o Firebase

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate("UserHome");
        } catch (error: any) {
            Alert.alert("Erro ao entrar", error.message);
        } finally {
            setLoading(false); //desativa o carregando sempre ao final, com sucesso ou erro
        }
    };

    const handleHomeScreens = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/fundo.png")}
                style={styles.image}
                resizeMode="cover"
            >
                {/*toast verde — só aparece quando fromRegister é true */}
                <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                    <Text style={styles.toastText}>Cadastro realizado com sucesso!</Text>
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
                    {/*botão ENTRAR — exibe ActivityIndicator no lugar do texto durante o loading*/}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading} //bloqueia novo clique enquanto carrega
                    >
                        {loading
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <Text style={styles.buttonText}>ENTRAR</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleHomeScreens}
                        disabled={loading} //bloqueia voltar também enquanto carrega
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
        alignItems: "center", //centraliza o ActivityIndicator horizontalmente
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Jomhuria",
    },
    //toast verde discreto no topo da tela
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