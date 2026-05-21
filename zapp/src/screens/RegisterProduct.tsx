// RegisterProduct.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { ActivityIndicator, Animated, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SHARED } from "../../constants/theme";
import { productService } from "../../services/products_services";

export default function RegisterProduct() {
    const navigation: any = useNavigation();
    const [nome, setNome] = useState("");
    const [traducao, setTraducao] = useState("");
    const [editora, setEditora] = useState("");
    const [imagem, setImagem] = useState("");
    const [preco, setPreco] = useState("");
    const [loading, setLoading] = useState(false);

    const [nomeError, setNomeError] = useState("");
    const [traducaoError, setTraducaoError] = useState("");
    const [editoraError, setEditoraError] = useState("");
    const [imagemError, setImagemError] = useState("");
    const [precoError, setPrecoError] = useState("");

    const [toastMessage, setToastMessage] = useState("");
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const showToast = (message: string, onEnd?: () => void) => {
        setToastMessage(message);
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
            setTimeout(() => Animated.timing(toastOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(onEnd), 2500);
        });
    };

    const validate = () => {
        let valid = true;
        setNomeError(""); setTraducaoError(""); setEditoraError(""); setImagemError(""); setPrecoError("");

        if (!nome.trim()) { setNomeError("Nome é obrigatório."); valid = false; }
        if (!traducao.trim()) { setTraducaoError("Tradução é obrigatória."); valid = false; }
        if (!editora.trim()) { setEditoraError("Editora é obrigatória."); valid = false; }
        if (!imagem.trim()) { setImagemError("URL da imagem é obrigatória."); valid = false; }
        if (!preco.trim() || isNaN(parseFloat(preco.replace(",", ".")))) { setPrecoError("Preço válido é obrigatório."); valid = false; }

        return valid;
    };

    const handleRegisterProduct = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await productService.create({ nome, traducao, editora, imagem, preco: parseFloat(preco.replace(",", ".")) });
            setNome(""); setTraducao(""); setEditora(""); setImagem(""); setPreco("");
            showToast("Produto cadastrado com sucesso!", () => navigation.navigate("UserHome"));
        } catch (error: any) {
            showToast("Erro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require("../../assets/images/fundo.png")} style={styles.image} resizeMode="cover">

                <Animated.View style={[SHARED.toast, { opacity: toastOpacity, backgroundColor: "#2e7d32" }]}>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                    <Text style={SHARED.toastText}>{toastMessage}</Text>
                </Animated.View>

                <View style={styles.card}>
                    <TextInput
                        placeholder="Nome" style={[SHARED.input, nomeError ? SHARED.inputError : null]}
                        value={nome} onChangeText={(t) => { setNome(t); setNomeError(""); }}
                    />
                    {nomeError ? <Text style={SHARED.errorText}>{nomeError}</Text> : null}

                    <TextInput
                        placeholder="Tradução" style={[SHARED.input, traducaoError ? SHARED.inputError : null]}
                        value={traducao} onChangeText={(t) => { setTraducao(t); setTraducaoError(""); }}
                    />
                    {traducaoError ? <Text style={SHARED.errorText}>{traducaoError}</Text> : null}

                    <TextInput
                        placeholder="Editora" style={[SHARED.input, editoraError ? SHARED.inputError : null]}
                        value={editora} onChangeText={(t) => { setEditora(t); setEditoraError(""); }}
                    />
                    {editoraError ? <Text style={SHARED.errorText}>{editoraError}</Text> : null}

                    <TextInput
                        placeholder="URL da Imagem" style={[SHARED.input, imagemError ? SHARED.inputError : null]}
                        value={imagem} onChangeText={(t) => { setImagem(t); setImagemError(""); }}
                        autoCapitalize="none"
                    />
                    {imagemError ? <Text style={SHARED.errorText}>{imagemError}</Text> : null}

                    <TextInput
                        placeholder="Preço (ex: 29,90)" style={[SHARED.input, precoError ? SHARED.inputError : null]}
                        value={preco} onChangeText={(t) => { setPreco(t); setPrecoError(""); }}
                        keyboardType="decimal-pad"
                    />
                    {precoError ? <Text style={SHARED.errorText}>{precoError}</Text> : null}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={SHARED.button} onPress={handleRegisterProduct} disabled={loading}>
                        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={SHARED.buttonText}>SALVAR</Text>}
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
    card: { width: "100%", padding: 10 },
    buttonContainer: { width: "80%", alignItems: "center", rowGap: 10 },
});