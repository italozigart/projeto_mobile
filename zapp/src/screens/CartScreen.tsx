import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, FlatList, Image, ImageBackground, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SHARED } from "../../constants/theme";
import { CartItem } from "../../src/models/CartItem";
import { cartService } from "../../services/cart_service";
import { Platform } from "react-native";

const FRETE_FIXO = 15.00;
const CUPONS: Record<string, { tipo: "percentual"; valor: number }> = {
    "MINHAPRIMEIRAVEZ": { tipo: "percentual", valor: 10 },
};

// configura como a notificação aparece enquanto o app está aberto
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function CartScreen() {
    const navigation: any = useNavigation();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [cupom, setCupom] = useState("");
    const [cupomAplicado, setCupomAplicado] = useState<string | null>(null);
    const [cupomErro, setCupomErro] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const showToast = (message: string) => {
        setToastMessage(message);
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
            setTimeout(() => Animated.timing(toastOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(), 2500);
        });
    };

    // solicita permissão ao montar a tela
    useEffect(() => {
        solicitarPermissaoNotificacao();
    }, []);

    const solicitarPermissaoNotificacao = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            console.log("Permissão de notificação negada.");
        }
    };

    const dispararNotificacao = async () => {
    if (Platform.OS === "web") {
        showToast("Pedido confirmado!");
        return;
    }
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "✅ Pedido confirmado!",
            body: "Seus produtos foram confirmados no carrinho. Obrigado pela compra!",
            sound: true,
        },
        trigger: null,
    });
};

    const loadCart = async () => {
        const user = getAuth().currentUser;
        if (!user) return;
        setLoading(true);
        try {
            const data = await cartService.getByUser(user.uid);
            setItems(data);
        } catch (error: any) {
            showToast("Erro ao carregar carrinho: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { loadCart(); }, []));

    const handleChangeQuantity = async (item: CartItem, delta: number) => {
        const novaQtd = item.quantidade + delta;
        if (novaQtd <= 0) { handleRemove(item.id!); return; }
        try {
            await cartService.updateQuantity(item.id!, novaQtd);
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantidade: novaQtd } : i));
        } catch (error: any) {
            showToast("Erro: " + error.message);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            await cartService.removeItem(id);
            setItems(prev => prev.filter(i => i.id !== id));
            showToast("Item removido do carrinho.");
        } catch (error: any) {
            showToast("Erro ao remover: " + error.message);
        }
    };

    const handleLimparCarrinho = async () => {
        try {
            await Promise.all(items.map(i => cartService.removeItem(i.id!)));
            setItems([]);
            setCupomAplicado(null);
            setCupom("");
            showToast("Carrinho esvaziado.");
        } catch (error: any) {
            showToast("Erro ao limpar: " + error.message);
        }
    };

    const handleConfirmarPedido = async () => {
        await dispararNotificacao();
        showToast("Pedido confirmado!");
    };

    const handleAplicarCupom = () => {
        setCupomErro("");
        const codigo = cupom.trim().toUpperCase();
        if (!codigo) { setCupomErro("Digite um cupom."); return; }
        if (CUPONS[codigo]) {
            setCupomAplicado(codigo);
            showToast("Cupom aplicado com sucesso!");
        } else {
            setCupomErro("Cupom inválido.");
            setCupomAplicado(null);
        }
    };

    const handleRemoverCupom = () => {
        setCupomAplicado(null);
        setCupom("");
        setCupomErro("");
    };

    const subtotal = items.reduce((sum, i) => sum + i.preco * i.quantidade, 0);
    const frete = items.length > 0 ? FRETE_FIXO : 0;
    const desconto = cupomAplicado && CUPONS[cupomAplicado]
        ? subtotal * (CUPONS[cupomAplicado].valor / 100)
        : 0;
    const total = subtotal + frete - desconto;

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartCard}>
            {item.imagem
                ? <Image source={{ uri: item.imagem }} style={styles.productImage} resizeMode="cover" />
                : <View style={styles.productImagePlaceholder}><Ionicons name="image-outline" size={24} color="#ccc" /></View>
            }
            <View style={styles.productInfo}>
                <Text style={styles.productNome}>{item.nome}</Text>
                <Text style={styles.productPreco}>R$ {Number(item.preco).toFixed(2)}</Text>
                <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleChangeQuantity(item, -1)}>
                        <Ionicons name="remove" size={16} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantidade}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleChangeQuantity(item, 1)}>
                        <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.itemTotal}>
                <Text style={styles.itemTotalText}>R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id!)}>
                    <Ionicons name="trash-outline" size={20} color="#cc0000" />
                </TouchableOpacity>
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
                        <Text style={styles.title}>Carrinho</Text>

                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#B8860B" />
                                <Text style={styles.loadingText}>Carregando...</Text>
                            </View>
                        ) : items.length === 0 ? (
                            <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
                        ) : (
                            <>
                                <FlatList
                                    data={items}
                                    keyExtractor={(item) => item.id!}
                                    renderItem={renderItem}
                                    showsVerticalScrollIndicator={false}
                                    style={styles.flatList}
                                />

                                {/* Cupom */}
                                {cupomAplicado ? (
                                    <View style={styles.cupomAplicadoRow}>
                                        <Ionicons name="pricetag-outline" size={16} color="#2e7d32" />
                                        <Text style={styles.cupomAplicadoText}>
                                            {cupomAplicado} — {CUPONS[cupomAplicado].valor}% off
                                        </Text>
                                        <TouchableOpacity onPress={handleRemoverCupom}>
                                            <Ionicons name="close-circle-outline" size={18} color="#cc0000" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.cupomRow}>
                                        <TextInput
                                            style={styles.cupomInput}
                                            placeholder="Cupom de desconto"
                                            value={cupom}
                                            onChangeText={(t) => { setCupom(t); setCupomErro(""); }}
                                            autoCapitalize="characters"
                                        />
                                        <TouchableOpacity style={styles.cupomBtn} onPress={handleAplicarCupom}>
                                            <Text style={styles.cupomBtnText}>APLICAR</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {cupomErro ? <Text style={styles.cupomErro}>{cupomErro}</Text> : null}

                                {/* Totalização */}
                                <View style={styles.totalizacao}>
                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>Subtotal</Text>
                                        <Text style={styles.totalValue}>R$ {subtotal.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>Frete</Text>
                                        <Text style={styles.totalValue}>R$ {frete.toFixed(2)}</Text>
                                    </View>
                                    {desconto > 0 && (
                                        <View style={styles.totalRow}>
                                            <Text style={[styles.totalLabel, { color: "#2e7d32" }]}>Desconto</Text>
                                            <Text style={[styles.totalValue, { color: "#2e7d32" }]}>- R$ {desconto.toFixed(2)}</Text>
                                        </View>
                                    )}
                                    <View style={[styles.totalRow, styles.totalFinal]}>
                                        <Text style={styles.totalFinalLabel}>Total</Text>
                                        <Text style={styles.totalFinalValue}>R$ {total.toFixed(2)}</Text>
                                    </View>
                                </View>

                                {/* Confirmar pedido */}
                                <TouchableOpacity style={styles.confirmarBtn} onPress={handleConfirmarPedido}>
                                    <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                                    <Text style={styles.confirmarBtnText}>CONFIRMAR E AVANÇAR</Text>
                                </TouchableOpacity>

                                {/* Limpar carrinho */}
                                <TouchableOpacity style={styles.limparBtn} onPress={handleLimparCarrinho}>
                                    <Ionicons name="trash-outline" size={16} color="#cc0000" />
                                    <Text style={styles.limparBtnText}>Limpar Tudo</Text>
                                </TouchableOpacity>
                            </>
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
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("ProductList")}>
                        <Ionicons name="list-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <Ionicons name="cart-outline" size={30} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("UserPerfil")}>
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
    content: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 80 },
    listContainer: { width: "85%", flex: 1, backgroundColor: "#fff", borderRadius: 20, padding: 20, marginBottom: 10, elevation: 5, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    loadingText: { color: "#B8860B", fontSize: 14 },
    emptyText: { textAlign: "center", color: "#999", fontSize: 14, marginTop: 20 },
    flatList: { flex: 1 },
    cartCard: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 12, gap: 10 },
    productImage: { width: 56, height: 56, borderRadius: 8, borderWidth: 1, borderColor: "#eee" },
    productImagePlaceholder: { width: 56, height: 56, borderRadius: 8, backgroundColor: "#f5f5f5", borderWidth: 1, borderColor: "#eee", justifyContent: "center", alignItems: "center" },
    productInfo: { flex: 1 },
    productNome: { fontSize: 15, fontWeight: "bold", color: "#000" },
    productPreco: { fontSize: 13, color: "#666", marginTop: 2 },
    qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 10 },
    qtyBtn: { backgroundColor: "#B8860B", borderRadius: 4, padding: 3 },
    qtyText: { fontSize: 15, fontWeight: "bold", minWidth: 20, textAlign: "center" },
    itemTotal: { alignItems: "flex-end", gap: 8 },
    itemTotalText: { fontSize: 14, fontWeight: "bold", color: "#B8860B" },
    removeBtn: { padding: 4 },
    cupomRow: { flexDirection: "row", gap: 8, marginTop: 12, alignItems: "center" },
    cupomInput: { flex: 1, height: 40, borderWidth: 1.5, borderColor: "#B8860B", borderRadius: 8, paddingHorizontal: 10, fontSize: 13 },
    cupomBtn: { backgroundColor: "#B8860B", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
    cupomBtnText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
    cupomAplicadoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, backgroundColor: "#f0fff0", borderRadius: 8, padding: 10 },
    cupomAplicadoText: { flex: 1, color: "#2e7d32", fontWeight: "bold", fontSize: 13 },
    cupomErro: { color: "#cc0000", fontSize: 12, marginTop: 4, marginLeft: 2 },
    totalizacao: { borderTopWidth: 1.5, borderTopColor: "#eee", marginTop: 12, paddingTop: 12, gap: 6 },
    totalRow: { flexDirection: "row", justifyContent: "space-between" },
    totalLabel: { fontSize: 14, color: "#666" },
    totalValue: { fontSize: 14, color: "#333" },
    totalFinal: { borderTopWidth: 1.5, borderTopColor: "#B8860B", marginTop: 6, paddingTop: 8 },
    totalFinalLabel: { fontSize: 17, fontWeight: "bold", color: "#000" },
    totalFinalValue: { fontSize: 17, fontWeight: "bold", color: "#B8860B" },
    confirmarBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12, padding: 12, backgroundColor: "#B8860B", borderRadius: 10 },
    confirmarBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
    limparBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8, padding: 10, borderWidth: 1.5, borderColor: "#cc0000", borderRadius: 10 },
    limparBtnText: { color: "#cc0000", fontWeight: "bold", fontSize: 14 },
    btn: { padding: 10 },
});