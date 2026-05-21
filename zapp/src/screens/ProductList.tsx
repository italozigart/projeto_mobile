import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Animated, FlatList, Image, ImageBackground, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SHARED } from "../../constants/theme";
import { Product } from "../../src/models/Product";
import { cartService } from "../../services/cart_service";
import { productService } from "../../services/products_services";

export default function ProductList() {
    const navigation: any = useNavigation();
    const [products, setProducts] = useState<Product[]>([]);
    const [busca, setBusca] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [nome, setNome] = useState("");
    const [traducao, setTraducao] = useState("");
    const [editora, setEditora] = useState("");
    const [imagem, setImagem] = useState("");
    const [preco, setPreco] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [loadingList, setLoadingList] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState("");
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const showToast = (message: string) => {
        setToastMessage(message);
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
            setTimeout(() => Animated.timing(toastOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(), 2500);
        });
    };

    const loadProducts = async () => {
        setLoadingList(true);
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (error: any) {
            showToast("Erro ao carregar: " + error.message);
        } finally {
            setLoadingList(false);
        }
    };

    useFocusEffect(useCallback(() => { loadProducts(); }, []));

    // filtragem local em tempo real
    const produtosFiltrados = products.filter(p =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const handleOpenEdit = (p: Product) => {
        setSelectedProduct(p);
        setNome(p.nome); setTraducao(p.traducao); setEditora(p.editora);
        setImagem(p.imagem); setPreco(String(p.preco ?? ""));
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedProduct) return;
        setLoadingSave(true);
        try {
            await productService.update(selectedProduct.id!, { nome, traducao, editora, imagem, preco: parseFloat(preco.replace(",", ".")) });
            setModalVisible(false);
            showToast("Produto atualizado com sucesso!");
            loadProducts();
        } catch (error: any) {
            showToast("Erro ao atualizar: " + error.message);
        } finally {
            setLoadingSave(false);
        }
    };

    const handleConfirmDelete = async (id: string) => {
        try {
            await productService.delete(id);
            setConfirmDeleteId(null);
            showToast("Produto excluído com sucesso!");
            loadProducts();
        } catch (error: any) {
            showToast("Erro ao excluir: " + error.message);
            setConfirmDeleteId(null);
        }
    };

    const handleAddToCart = async (product: Product) => {
        const user = getAuth().currentUser;
        if (!user) { showToast("Você precisa estar logado."); return; }
        setAddingToCartId(product.id!);
        try {
            const cartItems = await cartService.getByUser(user.uid);
            const existing = cartItems.find(i => i.productId === product.id);
            if (existing) {
                await cartService.updateQuantity(existing.id!, existing.quantidade + 1);
            } else {
                await cartService.addItem({
                    userId: user.uid,
                    productId: product.id!,
                    nome: product.nome,
                    imagem: product.imagem,
                    preco: product.preco,
                    quantidade: 1,
                });
            }
            showToast("Adicionado ao carrinho!");
        } catch (error: any) {
            showToast("Erro: " + error.message);
        } finally {
            setAddingToCartId(null);
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
                <Text style={styles.productPreco}>R$ {Number(item.preco).toFixed(2)}</Text>
            </View>
            <View style={styles.productActions}>
                {confirmDeleteId === item.id ? (
                    <View style={styles.confirmRow}>
                        <TouchableOpacity style={styles.confirmYes} onPress={() => handleConfirmDelete(item.id!)}>
                            <Ionicons name="checkmark" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmNo} onPress={() => setConfirmDeleteId(null)}>
                            <Ionicons name="close" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => handleAddToCart(item)} disabled={addingToCartId === item.id}>
                            {addingToCartId === item.id
                                ? <ActivityIndicator size="small" color="#B8860B" />
                                : <Ionicons name="cart-outline" size={20} color="#B8860B" />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => handleOpenEdit(item)}>
                            <Ionicons name="pencil-outline" size={20} color="#B8860B" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => setConfirmDeleteId(item.id!)}>
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

                        {/* Campo de busca */}
                        <View style={styles.buscaRow}>
                            <Ionicons name="search-outline" size={18} color="#B8860B" style={styles.buscaIcon} />
                            <TextInput
                                style={styles.buscaInput}
                                placeholder="Buscar por nome..."
                                value={busca}
                                onChangeText={setBusca}
                                autoCapitalize="none"
                            />
                            {busca.length > 0 && (
                                <TouchableOpacity onPress={() => setBusca("")}>
                                    <Ionicons name="close-circle-outline" size={18} color="#999" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {loadingList ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#B8860B" />
                                <Text style={styles.loadingText}>Carregando produtos...</Text>
                            </View>
                        ) : produtosFiltrados.length === 0 ? (
                            <Text style={styles.emptyText}>
                                {busca.length > 0 ? "Nenhum produto encontrado." : "Nenhum produto cadastrado."}
                            </Text>
                        ) : (
                            <FlatList
                                data={produtosFiltrados}
                                keyExtractor={(item) => item.id!}
                                renderItem={renderItem}
                                showsVerticalScrollIndicator={false}
                            />
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
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("CartScreen")}>
                        <Ionicons name="cart-outline" size={30} color="#fff" />
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
                        <TextInput placeholder="Preço (ex: 29,90)" style={SHARED.input} value={preco} onChangeText={setPreco} keyboardType="decimal-pad" />
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
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    buscaRow: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#B8860B", borderRadius: 10, paddingHorizontal: 10, marginBottom: 12, backgroundColor: "#fafafa" },
    buscaIcon: { marginRight: 6 },
    buscaInput: { flex: 1, height: 40, fontSize: 14 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    loadingText: { color: "#B8860B", fontSize: 14 },
    emptyText: { textAlign: "center", color: "#999", fontSize: 14, marginTop: 20 },
    productCard: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 12, gap: 8 },
    productImage: { width: 56, height: 56, borderRadius: 8, borderWidth: 1, borderColor: "#eee" },
    productImagePlaceholder: { width: 56, height: 56, borderRadius: 8, backgroundColor: "#f5f5f5", borderWidth: 1, borderColor: "#eee", justifyContent: "center", alignItems: "center" },
    productInfo: { flex: 1 },
    productNome: { fontSize: 15, fontWeight: "bold", color: "#000" },
    productDetail: { fontSize: 12, color: "#666", marginTop: 1 },
    productPreco: { fontSize: 13, fontWeight: "bold", color: "#B8860B", marginTop: 3 },
    productActions: { flexDirection: "row", gap: 4, alignItems: "center" },
    iconBtn: { padding: 5 },
    confirmRow: { flexDirection: "row", gap: 6, alignItems: "center" },
    confirmYes: { backgroundColor: "#cc0000", borderRadius: 6, padding: 6 },
    confirmNo: { backgroundColor: "#888", borderRadius: 6, padding: 6 },
    btn: { padding: 10 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
    modalCard: { width: "85%", backgroundColor: "#fff", borderRadius: 20, padding: 20, elevation: 10, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8 },
    modalTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
    modalButtons: { rowGap: 10, marginTop: 5 },
});