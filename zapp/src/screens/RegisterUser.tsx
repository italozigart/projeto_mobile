import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth"; //cria usuário no FB Auth com email e senha
import { ref, set } from "firebase/database"; //salva dados no Realtime Database
import { useState } from "react"; //controla o estado dos valores dos inputs
import {
    ActivityIndicator, //ícone de carregando nativo do React Native
    Alert,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { TextInputMask } from "react-native-masked-text"; //máscara para o celular, mesmo import do UserPerfil
import { auth, database } from "../../services/connectionFirebase";

export default function RegisterUser() {

    const navigation: any = useNavigation();

    //volta pra tela anterior clicando em voltar, usando goBack pra voltar um elemento na pilha
    const handleHomeScreens = () => {
        navigation.goBack();
    };

    //estados que armazenam os dados digitados
    const [name, setName] = useState("");
    const [cellphone, setCellphone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    //controla visibilidade das senhas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //controla o estado de carregamento durante a chamada ao Firebase
    const [loading, setLoading] = useState(false);

    //estados de erro por campo — string vazia = sem erro
    const [nameError, setNameError] = useState("");
    const [cellphoneError, setCellphoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    //valida todos os campos e retorna true se tudo estiver ok
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

        //celular com máscara BRL completo tem 15 caracteres: (xx) xxxxx-xxxx
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

    //função assíncrona executada ao cadastrar
    const handleRegister = async () => {

        if (!validate()) return;

        setLoading(true); //ativa o carregando antes de chamar o Firebase

        try {
            //cria usuário no FB Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            //salva dados extras no Realtime Database usando o UID do usuário
            await set(ref(database, "users/" + user.uid), {
                name: name,
                cellphone: cellphone,
                email: email,
            });

            //passa fromRegister: true para LoginUser saber que veio do cadastro e exibir o toast
            navigation.navigate("LoginUser", { fromRegister: true });
        } catch (error: any) {
            Alert.alert("Erro", error.message);
        } finally {
            setLoading(false); //desativa o carregando sempre ao final, com sucesso ou erro
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/fundo.png")}
                style={styles.image}
                resizeMode="cover"
            >
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
                            onChangeText={(text) => {
                                setName(text);
                                setNameError("");
                            }}
                        />
                        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

                        <TextInputMask
                            type={"cel-phone"}
                            options={{
                                maskType: "BRL",
                                withDDD: true,
                                dddMask: "(99) ",
                            }}
                            placeholder="Celular"
                            style={[styles.input, cellphoneError ? styles.inputError : null]}
                            value={cellphone}
                            onChangeText={(text) => {
                                setCellphone(text);
                                setCellphoneError("");
                            }}
                            keyboardType="phone-pad"
                        />
                        {cellphoneError ? <Text style={styles.errorText}>{cellphoneError}</Text> : null}

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

                        <View style={[styles.passwordContainer, confirmPasswordError ? styles.inputError : null]}>
                            <TextInput
                                placeholder="Confirmar Senha"
                                style={styles.passwordInput}
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    setConfirmPasswordError("");
                                }}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                    size={22}
                                    color="#B8860B"
                                />
                            </TouchableOpacity>
                        </View>
                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                    </View>

                    <View style={styles.buttonContainer}>
                        {/*botão SALVAR — exibe ActivityIndicator no lugar do texto durante o loading*/}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleRegister}
                            disabled={loading} //bloqueia novo clique enquanto carrega
                        >
                            {loading
                                ? <ActivityIndicator size="small" color="#fff" />
                                : <Text style={styles.buttonText}>SALVAR</Text>
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
        alignItems: "center", //centraliza o ActivityIndicator horizontalmente
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Jomhuria",
    },
});