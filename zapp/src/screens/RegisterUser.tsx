import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useRef, useState } from "react";
import { ActivityIndicator, Animated, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { auth, database } from "../../services/connectionFirebase";
import { SHARED } from "../../constants/theme";

export default function RegisterUser() {
    const navigation: any = useNavigation();
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
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("#cc0000");
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const showToast = (message: string, color = "#cc0000") => {
        setToastMessage(message); setToastColor(color);
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
            setTimeout(() => Animated.timing(toastOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(), 2500);
        });
    };

    const validate = () => {
        let valid = true;
        setNameError(""); setCellphoneError(""); setEmailError(""); setPasswordError(""); setConfirmPasswordError("");
        if (!name.trim()) { setNameError("Nome é obrigatório."); valid = false; }
        if (cellphone.length < 15) { setCellphoneError("Celular incompleto. Use o formato (xx) xxxxx-xxxx."); valid = false; }
        if (!email.includes("@") || !email.includes(".com")) { setEmailError("Email inválido. Deve conter @ e .com"); valid = false; }
        if (password.length < 6) { setPasswordError("Senha deve ter no mínimo 6 caracteres."); valid = false; }
        if (confirmPassword !== password) { setConfirmPasswordError("As senhas não coincidem."); valid = false; }
        return valid;
    };

    const handleRegister = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await set(ref(database, "users/" + user.uid), { name, cellphone, email });
            navigation.navigate("LoginUser", { fromRegister: true });
        } catch (error: any) {
            showToast("Erro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require("../../assets/images/fundo.png")} style={styles.image} resizeMode="cover">

                <Animated.View style={[SHARED.toast, { opacity: toastOpacity, backgroundColor: toastColor }]}>
                    <Ionicons name="alert-circle-outline" size={18} color="#fff" />
                    <Text style={SHARED.toastText}>{toastMessage}</Text>
                </Animated.View>

                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>

                        <TextInput
                            placeholder="Nome"
                            style={[SHARED.input, nameError ? SHARED.inputError : null]}
                            value={name}
                            onChangeText={(t) => { setName(t); setNameError(""); }}
                        />
                        {nameError ? <Text style={SHARED.errorText}>{nameError}</Text> : null}

                        <TextInputMask
                            type={"cel-phone"}
                            options={{ maskType: "BRL", withDDD: true, dddMask: "(99) " }}
                            placeholder="Celular"
                            style={[SHARED.input, cellphoneError ? SHARED.inputError : null]}
                            value={cellphone}
                            onChangeText={(t) => { setCellphone(t); setCellphoneError(""); }}
                            keyboardType="phone-pad"
                        />
                        {cellphoneError ? <Text style={SHARED.errorText}>{cellphoneError}</Text> : null}

                        <TextInput
                            placeholder="Email"
                            style={[SHARED.input, emailError ? SHARED.inputError : null]}
                            value={email}
                            onChangeText={(t) => { setEmail(t); setEmailError(""); }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {emailError ? <Text style={SHARED.errorText}>{emailError}</Text> : null}

                        {/*campo senha — inline, sem componente filho para evitar perda de foco*/}
                        <View style={[styles.passwordContainer, passwordError ? SHARED.inputError : null]}>
                            <TextInput
                                placeholder="Senha"
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={(t) => { setPassword(t); setPasswordError(""); }}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#B8860B" />
                            </TouchableOpacity>
                        </View>
                        {passwordError ? <Text style={SHARED.errorText}>{passwordError}</Text> : null}

                        {/*campo confirmar senha — inline, sem componente filho para evitar perda de foco*/}
                        <View style={[styles.passwordContainer, confirmPasswordError ? SHARED.inputError : null]}>
                            <TextInput
                                placeholder="Confirmar Senha"
                                style={styles.passwordInput}
                                value={confirmPassword}
                                onChangeText={(t) => { setConfirmPassword(t); setConfirmPasswordError(""); }}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#B8860B" />
                            </TouchableOpacity>
                        </View>
                        {confirmPasswordError ? <Text style={SHARED.errorText}>{confirmPasswordError}</Text> : null}

                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={SHARED.button} onPress={handleRegister} disabled={loading}>
                            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={SHARED.buttonText}>SALVAR</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity style={SHARED.button} onPress={() => navigation.goBack()} disabled={loading}>
                            <Text style={SHARED.buttonText}>VOLTAR</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { flex: 1, width: "100%", height: "100%" },
    scroll: { flexGrow: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 60, paddingTop: 40 },
    card: { width: "90%", padding: 10 },
    passwordContainer: { width: "100%", flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", borderWidth: 2, borderColor: "#B8860B", borderRadius: 8, marginBottom: 4 },
    passwordInput: { flex: 1, fontFamily: "Jomhuria", height: 45, paddingHorizontal: 10 },
    eyeButton: { paddingHorizontal: 10 },
    buttonContainer: { width: "80%", alignItems: "center", rowGap: 10, marginTop: 16 },
});