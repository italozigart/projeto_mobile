import { useState } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterUser() {
  const [name, setName] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    
    <SafeAreaView style={styles.container}>
        <ImageBackground
            source={require("../../assets/images/fundo.png")}
            style={styles.image}
            resizeMode="cover"
        >
            <View style={styles.card}>
                <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
                <TextInput placeholder="Celular" style={styles.input} value={cellphone} onChangeText={setCellphone} keyboardType="phone-pad" />
                <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <TextInput placeholder="Senha" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>SALVAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
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
        elevation: 10
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
        marginBottom: 12
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
