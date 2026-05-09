import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { onValue, ref, remove, update } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, FlatList, Image, ImageBackground, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { database } from "../../services/connectionFirebase";
import { SHARED } from "../../constants/theme";

interface Product { id: string; nome: string; traducao: string; editora: string; imagem: string; }

export default function ProductList() {
    const navigation: any = useNavigation();
    const [products, setProducts] = useState<Product[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [nome, setNome] = useState("");
    const [traducao, setTraducao] = useState("");
    const [editora, setEditora] = useState("");
    const [imagem, setImagem] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [loadingList, setLoadingList] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const showToast = (message: string) => {
        setToastMessage(message);
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
            setTimeout(() => Animated.timing(toastOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(), 2500);
        });
    };

    useEffect(() => {
        const unsubscribe = onValue(ref(database, "products"), (snapshot) => {
            const data = snapshot.val();
            setProducts(data ? Object.entries(data).map(([id, val]: any) => ({ id, ...val })) : []);
            setLoadingList(false);
        });
        return () => unsubscribe();
    }, []);

    const handleOpenEdit = (p: Product) => {
        setSelectedProduct(p); setNome(p.nome); setTraducao(p.traducao); setEditora(p.editora); setImagem(p.imagem);
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedProduct) return;
        setLoadingSave(true);
        try {
            await update(ref(database, "products/" + selectedProduct.id), { nome, traducao, editora, imagem });
            setModalVisible(false);
            showToast("Produto atualizado com sucesso!");
        } catch (error: any) {
            showToast("Erro ao atualizar: " + error.message);
        } finally {
            setLoadingSave(false);
        }
    };

    const handleConfirmDelete = async (id: string) => {
        try {
            await remove(ref(database, "products/" + id));
            setConfirmDeleteId(null);
            showToast("Produto excluído com sucesso!");
        } catch (error: any) {
            showToast("Erro ao excluir: " + error.message);
            setConfirmDeleteId(null);
        }
    };

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            {item.imagem
                ? <Image source={{ uri: item.imagem }} style={styles.productImage} resizeMode="cover" />
                : <View style={styles.productImagePlaceholder}><Ionicons name="image-outline" size={24} color="#ccc" /></View>
            }
            <View style={styles.productInfo}>
                <Text style={styles.productNome}>{item.nome}</Text>
                <Text style={styles.productDetail}>Tradução: {item.traducao}</Text>
                <Text style={styles.productDetail}>Editora: {item.editora}</Text>
            </View>
            <View style={styles.productActions}>
                {confirmDeleteId === item.id ? (
                    <View style={styles.confirmRow}>
                        <TouchableOpacity style={styles.confirmYes} onPress={() => handleConfirmDelete(item.id)}>
                            <Ionicons name="checkmark" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmNo} onPress={() => setConfirmDeleteId(null)}>
                            <Ionicons name="close" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => handleOpenEdit(item)}>
                            <Ionicons name="pencil-outline" size={20} color="#B8860B" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => setConfirmDeleteId(item.id)}>
                            <Ionicons name="trash-outline" size={20} color="#cc0000" />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require("../../assets/images/fundo.png")} style={styles.image} resizeMode="cover">

                <TouchableOpacity style={SHARED.logoutButton} onPress={() => navigation.navigate("HomeScreen")}>
                    <Ionicons name="log-out-outline" size={28} color="#fff" />
                </TouchableOpacity>

                <Animated.View style={[SHARED.toast, { opacity: toastOpacity, backgroundColor: "#2e7d32" }]}>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                    <Text style={SHARED.toastText}>{toastMessage}</Text>
                </Animated.View>

                <View style={styles.content}>
                    <View style={styles.listContainer}>
                        <Text style={styles.title}>Produtos</Text>
                        {loadingList ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#B8860B" />
                                <Text style={styles.loadingText}>Carregando produtos...</Text>
                            </View>
                        ) : products.length === 0 ? (
                            <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
                        ) : (
                            <FlatList data={products} keyExtractor={(item) => item.id} renderItem={renderItem} showsVerticalScrollIndicator={false} />
                        )}
                    </View>
                </View>

                <View style={SHARED.footer}>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("UserHome")}>
                        <Ionicons name="home" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("RegisterProduct")}>
                        <Ionicons name="add-circle-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <Ionicons name="list-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("UserPerfil")}>
                        <Ionicons name="person" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>

            </ImageBackground>

            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Editar Produto</Text>
                        <TextInput placeholder="Nome" style={SHARED.input} value={nome} onChangeText={setNome} />
                        <TextInput placeholder="Tradução" style={SHARED.input} value={traducao} onChangeText={setTraducao} />
                        <TextInput placeholder="Editora" style={SHARED.input} value={editora} onChangeText={setEditora} />
                        <TextInput placeholder="URL da Imagem" style={SHARED.input} value={imagem} onChangeText={setImagem} autoCapitalize="none" />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={SHARED.button} onPress={handleSaveEdit} disabled={loadingSave}>
                                {loadingSave ? <ActivityIndicator size="small" color="#fff" /> : <Text style={SHARED.buttonText}>SALVAR</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity style={[SHARED.button, { backgroundColor: "#888" }]} onPress={() => setModalVisible(false)} disabled={loadingSave}>
                                <Text style={SHARED.buttonText}>CANCELAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { flex: 1, width: "100%", height: "100%" },
    content: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 80 },
    listContainer: { width: "85%", flex: 1, backgroundColor: "#fff", borderRadius: 20, padding: 20, marginBottom: 10, elevation: 5, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    loadingText: { color: "#B8860B", fontSize: 14 },
    emptyText: { textAlign: "center", color: "#999", fontSize: 14, marginTop: 20 },
    productCard: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 12, gap: 10 },
    productImage: { width: 56, height: 56, borderRadius: 8, borderWidth: 1, borderColor: "#eee" },
    productImagePlaceholder: { width: 56, height: 56, borderRadius: 8, backgroundColor: "#f5f5f5", borderWidth: 1, borderColor: "#eee", justifyContent: "center", alignItems: "center" },
    productInfo: { flex: 1 },
    productNome: { fontSize: 16, fontWeight: "bold", color: "#000" },
    productDetail: { fontSize: 13, color: "#666", marginTop: 2 },
    productActions: { flexDirection: "row", gap: 8, alignItems: "center" },
    iconBtn: { padding: 6 },
    confirmRow: { flexDirection: "row", gap: 6, alignItems: "center" },
    confirmYes: { backgroundColor: "#cc0000", borderRadius: 6, padding: 6 },
    confirmNo: { backgroundColor: "#888", borderRadius: 6, padding: 6 },
    btn: { padding: 10 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
    modalCard: { width: "85%", backgroundColor: "#fff", borderRadius: 20, padding: 20, elevation: 10, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8 },
    modalTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
    modalButtons: { rowGap: 10, marginTop: 5 },
});