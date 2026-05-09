import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { TextInputMask } from "react-native-masked-text";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SHARED } from "../../constants/theme";

export default function UserPerfil() {
    const navigation: any = useNavigation();
    const user = getAuth().currentUser;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cellphone, setCellPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("#2e7d32");
    const toastOpacity = useRef(new Animated.Value(0)).current;

    //referência estável do banco — criada uma vez, reutilizada no update
    const db = getDatabase();

    const showToast = (message: string, color = "#2e7d32") => {
        setToastMessage(message); setToastColor(color);
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
            setTimeout(() => Animated.timing(toastOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(), 2500);
        });
    };

    useEffect(() => {
        if (!user) return;
        const userRef = ref(db, "users/" + user.uid);
        //onValue retorna o unsubscribe — repassado ao cleanup para cancelar a escuta ao desmontar
        const unsubscribe = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            setName(data?.name || "");
            setEmail(user.email || "");
            setCellPhone(data?.cellphone || "");
        });
        return () => unsubscribe(); //cancela a escuta ao sair da tela — corrige o leak anterior
    }, []);

    const handleUpdateProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await update(ref(db, "users/" + user.uid), { name, cellphone });
            showToast("Dados atualizados com sucesso!");
        } catch {
            showToast("Não foi possível atualizar os dados.", "#cc0000");
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

                <View style={styles.content}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Perfil</Text>

                        <Text style={styles.label}>Nome:</Text>
                        <TextInput style={SHARED.input} value={name} onChangeText={setName} placeholder="Digite seu nome" />

                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{email || "Carregando..."}</Text>

                        <Text style={styles.label}>Telefone:</Text>
                        <TextInputMask type={"cel-phone"} options={{ maskType: "BRL", withDDD: true, dddMask: "(99) " }}
                            style={SHARED.input} value={cellphone} onChangeText={setCellPhone}
                            placeholder="Digite seu telefone" keyboardType="numeric" />

                        <TouchableOpacity style={[SHARED.button, { marginTop: 20 }]} onPress={handleUpdateProfile} disabled={loading}>
                            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={SHARED.buttonText}>Salvar alterações</Text>}
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={SHARED.logoutButton} onPress={() => navigation.navigate("HomeScreen")}>
                    <Ionicons name="log-out-outline" size={28} color="#fff" />
                </TouchableOpacity>

                <View style={SHARED.footer}>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("UserHome")}>
                        <Ionicons name="home" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("RegisterProduct")}>
                        <Ionicons name="add-circle-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("ProductList")}>
                        <Ionicons name="list-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <Ionicons name="person" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { flex: 1, width: "100%", height: "100%" },
    content: { flex: 1, justifyContent: "center", alignItems: "center" },
    card: { width: "85%", backgroundColor: "#fff", borderRadius: 20, padding: 20, elevation: 5, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
    label: { fontSize: 14, color: "#666", marginTop: 10, marginBottom: 5 },
    value: { fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 10 },
    btn: { padding: 10 },
});