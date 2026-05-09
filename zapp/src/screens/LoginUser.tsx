import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../services/connectionFirebase";
import { SHARED } from "../../constants/theme";

export default function LoginUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("#2e7d32");
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const navigation: any = useNavigation();
    const route: any = useRoute();

    const showToast = (message: string, color = "#2e7d32") => {
        setToastMessage(message);
        setToastColor(color);
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
            setTimeout(() => Animated.timing(toastOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(), 2500);
        });
    };

    useEffect(() => {
        if (route.params?.fromRegister) showToast("Cadastro realizado com sucesso!");
    }, []);

    const validate = () => {
        let valid = true;
        setEmailError(""); setPasswordError("");
        if (!email.trim()) { setEmailError("Email é obrigatório."); valid = false; }
        if (!password.trim()) { setPasswordError("Senha é obrigatória."); valid = false; }
        return valid;
    };

    const getErrorMessage = (code: string) => ({
        "auth/user-not-found": "Email não cadastrado.",
        "auth/wrong-password": "Senha incorreta.",
        "auth/invalid-email": "Email inválido.",
        "auth/invalid-credential": "Email ou senha incorretos.",
        "auth/too-many-requests": "Muitas tentativas. Tente mais tarde.",
        "auth/user-disabled": "Esta conta foi desativada.",
    }[code] ?? "Erro ao entrar. Verifique seus dados.");

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate("UserHome");
        } catch (error: any) {
            showToast(getErrorMessage(error.code), "#cc0000");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require("../../assets/images/fundo.png")} style={styles.image} resizeMode="cover">

                <Animated.View style={[SHARED.toast, { opacity: toastOpacity, backgroundColor: toastColor }]}>
                    <Ionicons name={toastColor === "#2e7d32" ? "checkmark-circle-outline" : "alert-circle-outline"} size={18} color="#fff" />
                    <Text style={SHARED.toastText}>{toastMessage}</Text>
                </Animated.View>

                <View style={styles.card}>
                    <TextInput
                        placeholder="Email" style={[SHARED.input, emailError ? SHARED.inputError : null]}
                        value={email} onChangeText={(t) => { setEmail(t); setEmailError(""); }}
                        keyboardType="email-address" autoCapitalize="none"
                    />
                    {emailError ? <Text style={SHARED.errorText}>{emailError}</Text> : null}

                    <View style={[styles.passwordContainer, passwordError ? SHARED.inputError : null]}>
                        <TextInput
                            placeholder="Senha" style={styles.passwordInput}
                            value={password} onChangeText={(t) => { setPassword(t); setPasswordError(""); }}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#B8860B" />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={SHARED.errorText}>{passwordError}</Text> : null}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={SHARED.button} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={SHARED.buttonText}>ENTRAR</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={SHARED.button} onPress={() => navigation.goBack()} disabled={loading}>
                        <Text style={SHARED.buttonText}>VOLTAR</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { flex: 1, justifyContent: "flex-end", alignItems: "center", width: "100%", height: "100%", paddingBottom: 100 },
    card: { width: "90%", padding: 10 },
    passwordContainer: { width: "100%", flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", borderWidth: 2, borderColor: "#B8860B", borderRadius: 8, marginBottom: 4 },
    passwordInput: { flex: 1, fontFamily: "Jomhuria", height: 45, paddingHorizontal: 10 },
    eyeButton: { paddingHorizontal: 10 },
    buttonContainer: { width: "80%", alignItems: "center", rowGap: 10, paddingBottom: 0 },
});