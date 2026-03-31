import { getAuth } from "firebase/auth"; //importando módulo de autenticação
import { getDatabase, onValue, ref } from "firebase/database"; //importando funções do Realtime DB
import { useEffect, useState } from "react"; //importando Hooks que controlam estado e ciclo de vida
import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function UserPerfil() {
    //armazenará os dados
    const [userData, setUserData] = useState<any>(null);

    //inicializa o FB Auth
    const auth = getAuth();
    //mapeia o user logado no momento
    const user = auth.currentUser;

    useEffect(() => { //após o componente montado ele roda pra realizar a busca
        if (user) { //só executa se tiver alguém logado
            const db = getDatabase();//obtém a instância do DB
            const userRef = ref(db, "users/" + user.uid);//passa o caminho até o usuário no DB

            onValue(userRef, (snapshot) => {//escuta alterações  no caminho em real time
                const data = snapshot.val();//retorna os dados do DB
                setUserData(data);//armazena os dados no estado
            });
        }
    }, []);//array garante que rode só uma vez ao abrir a tela

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
                        <Text style={styles.value}>
                            {userData?.name || "Carregando..."}
                            {/* 
                          Mostra o nome vindo do banco
                          userData?.name → evita erro se userData for null
                          "Carregando..." aparece enquanto ainda não buscou
                        */}
                        </Text>

                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>
                            {user?.email || "Carregando..."}
                        </Text>

                        <Text style={styles.label}>Telefone:</Text>
                        <Text style={styles.value}>
                            {userData?.cellphone || "Carregando..."}
                        </Text>
                    </View>
                </View>
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
    },

    value: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
});