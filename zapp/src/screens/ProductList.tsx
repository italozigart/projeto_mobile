import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { onValue, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, //spinner de carregamento da lista
    Alert,
    Animated, //animação fade dos toasts
    FlatList,
    Image,
    ImageBackground,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useRef } from "react";
import { database } from "../../services/connectionFirebase";

interface Product {
    id: string;
    nome: string;
    traducao: string;
    editora: string;
    imagem: string;
}

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

    //controla se a lista ainda está sendo carregada do Firebase
    const [loadingList, setLoadingList] = useState(true);

    //controla loading do botão salvar no modal de edição
    const [loadingSave, setLoadingSave] = useState(false);

    //mensagem atual do toast
    const [toastMessage, setToastMessage] = useState("");

    //opacidade animada do toast
    const toastOpacity = useRef(new Animated.Value(0)).current;

    //exibe um toast verde com a mensagem recebida por 3s e some com fade
    const showToast = (message: string) => {
        setToastMessage(message);

        //fade in em 300ms
        Animated.timing(toastOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            //aguarda 2.5s visível e depois fade out em 500ms
            setTimeout(() => {
                Animated.timing(toastOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            }, 2500);
        });
    };

    useEffect(() => {
        const productsRef = ref(database, "products");

        const unsubscribe = onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            const list: Product[] = [];
            for (let id in data) {
                list.push({ id, ...data[id] });
            }
            setProducts(list);
            setLoadingList(false); //lista recebida — encerra o carregando
        });

        return () => unsubscribe();
    }, []);

    const handleOpenEdit = (product: Product) => {
        setSelectedProduct(product);
        setNome(product.nome);
        setTraducao(product.traducao);
        setEditora(product.editora);
        setImagem(product.imagem);
        setModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedProduct) return;

        setLoadingSave(true); //ativa loading no botão salvar

        try {
            await update(ref(database, "products/" + selectedProduct.id), {
                nome: nome,
                traducao: traducao,
                editora: editora,
                imagem: imagem,
            });
            setModalVisible(false);
            showToast("Produto atualizado com sucesso!"); //toast de edição
        } catch (error: any) {
            Alert.alert("Erro", error.message);
        } finally {
            setLoadingSave(false); //desativa loading sempre ao final
        }
    };

    const handleConfirmDelete = async (id: string) => {
        try {
            await remove(ref(database, "products/" + id));
            setConfirmDeleteId(null);
            showToast("Produto excluído com sucesso!"); //toast de exclusão
        } catch (error: any) {
            Alert.alert("Erro ao excluir", error.message);
            setConfirmDeleteId(null);
        }
    };

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>

            {item.imagem ? (
                <Image
                    source={{ uri: item.imagem }}
                    style={styles.productImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.productImagePlaceholder}>
                    <Ionicons name="image-outline" size={24} color="#ccc" />
                </View>
            )}

            <View style={styles.productInfo}>
                <Text style={styles.productNome}>{item.nome}</Text>
                <Text style={styles.productDetail}>Tradução: {item.traducao}</Text>
                <Text style={styles.productDetail}>Editora: {item.editora}</Text>
            </View>

            <View style={styles.productActions}>
                {confirmDeleteId === item.id ? (
                    <View style={styles.confirmRow}>
                        <TouchableOpacity
                            style={styles.confirmYes}
                            onPress={() => handleConfirmDelete(item.id)}
                        >
                            <Ionicons name="checkmark" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.confirmNo}
                            onPress={() => setConfirmDeleteId(null)}
                        >
                            <Ionicons name="close" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleOpenEdit(item)}
                        >
                            <Ionicons name="pencil-outline" size={20} color="#B8860B" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => setConfirmDeleteId(item.id)}
                        >
                            <Ionicons name="trash-outline" size={20} color="#cc0000" />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/fundo.png")}
                style={styles.image}
                resizeMode="cover"
            >
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => navigation.navigate("HomeScreen")}
                >
                    <Ionicons name="log-out-outline" size={28} color="#fff" />
                </TouchableOpacity>

                {/*toast verde — aparece após qualquer ação bem-sucedida*/}
                <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>

                <View style={styles.content}>
                    <View style={styles.listContainer}>
                        <Text style={styles.title}>Produtos</Text>

                        {/*exibe spinner enquanto o Firebase não respondeu ainda*/}
                        {loadingList ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#B8860B" />
                                <Text style={styles.loadingText}>Carregando produtos...</Text>
                            </View>
                        ) : products.length === 0 ? (
                            <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
                        ) : (
                            <FlatList
                                data={products}
                                keyExtractor={(item) => item.id}
                                renderItem={renderItem}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("UserHome")}
                    >
                        <Ionicons name="home" size={30} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("RegisterProduct")}
                    >
                        <Ionicons name="add-circle-outline" size={30} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="list-outline" size={30} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("UserPerfil")}
                    >
                        <Ionicons name="person" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Editar Produto</Text>

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

                        <View style={styles.modalButtons}>
                            {/*botão salvar com loading durante o update*/}
                            <TouchableOpacity
                                style={styles.button2}
                                onPress={handleSaveEdit}
                                disabled={loadingSave}
                            >
                                {loadingSave
                                    ? <ActivityIndicator size="small" color="#fff" />
                                    : <Text style={styles.buttonText}>SALVAR</Text>
                                }
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button2, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                                disabled={loadingSave}
                            >
                                <Text style={styles.buttonText}>CANCELAR</Text>
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

    image: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 80,
    },

    listContainer: {
        width: "85%",
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 10,
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

    //container do spinner de carregamento da lista
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },

    loadingText: {
        color: "#B8860B",
        fontSize: 14,
    },

    emptyText: {
        textAlign: "center",
        color: "#999",
        fontSize: 14,
        marginTop: 20,
    },

    productCard: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingVertical: 12,
        gap: 10,
    },

    productImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
    },

    productImagePlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
    },

    productInfo: {
        flex: 1,
    },

    productNome: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },

    productDetail: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
    },

    productActions: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },

    editButton: {
        padding: 6,
    },

    deleteButton: {
        padding: 6,
    },

    confirmRow: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
    },

    confirmYes: {
        backgroundColor: "#cc0000",
        borderRadius: 6,
        padding: 6,
    },

    confirmNo: {
        backgroundColor: "#888",
        borderRadius: 6,
        padding: 6,
    },

    footer: {
        width: "100%",
        flexDirection: "row",
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

    //toast verde igual ao do LoginUser
    toast: {
        position: "absolute",
        top: 60,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2e7d32",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 8,
        zIndex: 99,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    toastText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalCard: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
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

    modalButtons: {
        rowGap: 10,
        marginTop: 5,
    },

    button2: {
        backgroundColor: "#B8860B",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: "100%",
        alignItems: "center",
    },

    cancelButton: {
        backgroundColor: "#888",
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Jomhuria",
    },
});