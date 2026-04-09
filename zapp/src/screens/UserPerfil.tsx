import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth"; //importando módulo de autenticação do Firebase
import { getDatabase, onValue, ref, update } from "firebase/database"; //importando funções do Realtime Database
import { TextInputMask } from "react-native-masked-text"; //importando campo com máscara para telefone
import { useEffect, useState } from "react"; //importando hooks de estado e ciclo de vida
import {
    Alert, //exibe mensagens popup na tela
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput, //campo de texto editável
    TouchableOpacity,
    View,
} from "react-native";

export default function UserPerfil() {
    const navigation: any = useNavigation(); //controla navegação entre telas

    const auth = getAuth(); //inicializa autenticação Firebase
    const user = auth.currentUser; //captura usuário logado atualmente

    //estado que armazena dados completos do usuário vindos do Firebase
    const [userData, setUserData] = useState<any>(null);

    //estados editáveis dos campos do formulário
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cellphone, setCellPhone] = useState("");

    useEffect(() => {
        //executa ao abrir a tela
        if (user) {
            //só busca dados se houver usuário logado

            const db = getDatabase(); //obtém instância do banco
            const userRef = ref(db, "users/" + user.uid); //aponta para caminho do usuário no banco

            onValue(userRef, (snapshot) => {
                //escuta alterações em tempo real no Firebase
                const data = snapshot.val(); //captura dados retornados

                setUserData(data); //salva objeto completo no estado

                //preenche os campos editáveis com os dados carregados
                setName(data?.name || "");
                setEmail(user.email || "");
                setCellPhone(data?.cellphone || "");
            });
        }
    }, []); //array vazio = executa apenas uma vez ao abrir

    async function handleUpdateProfile() {
        //função chamada ao clicar em salvar alterações
        if (user) {
            try {
                const db = getDatabase(); //obtém banco novamente
                const userRef = ref(db, "users/" + user.uid); //referência do usuário logado

                await update(userRef, {
                    //atualiza apenas os campos abaixo
                    name: name,
                    cellphone: cellphone,
                });

                Alert.alert("Sucesso", "Dados atualizados com sucesso."); //mensagem sucesso
            } catch (error) {
                Alert.alert("Erro", "Não foi possível atualizar os dados."); //mensagem erro
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/fundo.png")}
                style={styles.image}
                resizeMode="cover"
            >
                <View style={styles.content}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Perfil</Text>

                        <Text style={styles.label}>Nome:</Text>
                        <TextInput
                            style={styles.input}
                            value={name} //valor atual do nome
                            onChangeText={setName} //atualiza estado enquanto digita
                            placeholder="Digite seu nome"
                        />

                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>
                            {email || "Carregando..."}
                            {/* exibe email carregado do Firebase Auth */}
                        </Text>

                        <Text style={styles.label}>Telefone:</Text>
                        <TextInputMask
                            type={"cel-phone"} //define máscara celular
                            options={{
                                maskType: "BRL",
                                withDDD: true,
                                dddMask: "(99) ",
                            }}
                            style={styles.input}
                            value={cellphone} //valor atual telefone
                            onChangeText={setCellPhone} //atualiza enquanto digita
                            placeholder="Digite seu telefone"
                            keyboardType="numeric"
                        />

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleUpdateProfile}
                        >
                            <Text style={styles.saveButtonText}>
                                Salvar alterações
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => navigation.navigate("HomeScreen")}
                >
                    <Ionicons name="log-out-outline" size={28} color="#fff" />
                    {/* botão logout volta para tela inicial */}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("UserHome")}
                    >
                        <Ionicons name="home" size={30} color="#fff" />
                        {/* botão rodapé home */}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("UserPerfil")}
                    >
                        <Ionicons name="person" size={30} color="#fff" />
                        {/* botão rodapé perfil */}
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, //ocupa tela inteira
    },

    image: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

    content: {
        flex: 1,
        justifyContent: "center", //centraliza verticalmente
        alignItems: "center", //centraliza horizontalmente
    },

    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,

        elevation: 5, //sombra Android
        shadowColor: "#000", //sombra iOS
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

    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: "#000",
        backgroundColor: "#f9f9f9",
        marginBottom: 10,
    },

    saveButton: {
        marginTop: 20,
        backgroundColor: "#007bff",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },

    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    footer: {
        width: "100%",
        flexDirection: "row", //organiza ícones lado a lado
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
});