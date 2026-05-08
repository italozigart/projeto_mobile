import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { auth, database } from "../../services/connectionFirebase";

export default function RegisterUser() {

    const navigation: any = useNavigation();

    const handleHomeScreens = () => navigation.goBack();

    const [name, setName] = useState("");
    const [cellphone, setCellphone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [nameError, setNameError] = useState("");
    const [cellphoneError, setCellphoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    //toast vermelho para erros do Firebase (email já cadastrado, etc)
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("#cc0000");
    const toastOpacity = useRef(new Animated.Value(0)).current;

    //exibe toast com cor e mensagem configuráveis — mesmo padrão do restante do sistema
    const showToast = (message: string, color: string = "#cc0000") => {
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

    const validate = () => {
        let valid = true;

        setNameError("");
        setCellphoneError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        if (!name.trim()) {
            setNameError("Nome é obrigatório.");
            valid = false;
        }

        if (cellphone.length < 15) {
            setCellphoneError("Celular incompleto. Use o formato (xx) xxxxx-xxxx.");
            valid = false;
        }

        if (!email.includes("@") || !email.includes(".com")) {
            setEmailError("Email inválido. Deve conter @ e .com");
            valid = false;
        }

        if (password.length < 6) {
            setPasswordError("Senha deve ter no mínimo 6 caracteres.");
            valid = false;
        }

        if (confirmPassword !== password) {
            setConfirmPasswordError("As senhas não coincidem.");
            valid = false;
        }

        return valid;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(database, "users/" + user.uid), {
                name: name,
                cellphone: cellphone,
                email: email,
            });

            //redireciona com flag — o toast de sucesso fica no LoginUser
            navigation.navigate("LoginUser", { fromRegister: true });
        } catch (error: any) {
            //toast vermelho para erros do Firebase
            showToast("Erro: " + error.message);
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
                {/*toast de erro do Firebase — vermelho*/}
                <Animated.View style={[styles.toast, { opacity: toastOpacity, backgroundColor: toastColor }]}>
                    <Ionicons name="alert-circle-outline" size={18} color="#fff" />
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>

                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>

                        <TextInput
                            placeholder="Nome"
                            style={[styles.input, nameError ? styles.inputError : null]}
                            value={name}
                            onChangeText={(text) => { setName(text); setNameError(""); }}
                        />
                        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

                        <TextInputMask
                            type={"cel-phone"}
                            options={{ maskType: "BRL", withDDD: true, dddMask: "(99) " }}
                            placeholder="Celular"
                            style={[styles.input, cellphoneError ? styles.inputError : null]}
                            value={cellphone}
                            onChangeText={(text) => { setCellphone(text); setCellphoneError(""); }}
                            keyboardType="phone-pad"
                        />
                        {cellphoneError ? <Text style={styles.errorText}>{cellphoneError}</Text> : null}

                        <TextInput
                            placeholder="Email"
                            style={[styles.input, emailError ? styles.inputError : null]}
                            value={email}
                            onChangeText={(text) => { setEmail(text); setEmailError(""); }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                        <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
                            <TextInput
                                placeholder="Senha"
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={(text) => { setPassword(text); setPasswordError(""); }}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#B8860B" />
                            </TouchableOpacity>
                        </View>
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                        <View style={[styles.passwordContainer, confirmPasswordError ? styles.inputError : null]}>
                            <TextInput
                                placeholder="Confirmar Senha"
                                style={styles.passwordInput}
                                value={confirmPassword}
                                onChangeText={(text) => { setConfirmPassword(text); setConfirmPasswordError(""); }}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#B8860B" />
                            </TouchableOpacity>
                        </View>
                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                            {loading
                                ? <ActivityIndicator size="small" color="#fff" />
                                : <Text style={styles.buttonText}>SALVAR</Text>
                            }
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handleHomeScreens} disabled={loading}>
                            <Text style={styles.buttonText}>VOLTAR</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    scroll: {
        flexGrow: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 60,
        paddingTop: 40,
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
        marginTop: 16,
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