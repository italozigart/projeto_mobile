import { useNavigation } from "@react-navigation/native";
import { ref, push } from "firebase/database";
import { useState } from "react";
import {
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

    //estados que armazenam os dados digitados
    const [nome, setNome] = useState("");
    const [traducao, setTraducao] = useState("");
    const [editora, setEditora] = useState("");
    const [imagem, setImagem] = useState("");

    //volta pra tela anterior clicando em voltar
    const handleGoBack = () => {
        navigation.goBack();
    };

    //função assíncrona executada ao cadastrar produto
    const handleRegisterProduct = async () => {
        try {
            //salva produto no Firebase Realtime Database
            await push(ref(database, "products"), {
                nome: nome,
                traducao: traducao,
                editora: editora,
                imagem: imagem,
            });

            alert("Produto cadastrado com sucesso!");

            //limpa os campos após salvar
            setNome("");
            setTraducao("");
            setEditora("");
            setImagem("");

            //volta pra UserHome após salvar
            navigation.navigate("UserHome");
        } catch (error: any) {
            alert("Erro: " + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/fundo.png")}
                style={styles.image}
                resizeMode="cover"
            >
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
                    <TouchableOpacity style={styles.button} onPress={handleRegisterProduct}>
                        <Text style={styles.buttonText}>SALVAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleGoBack}
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
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Jomhuria",
    },
});