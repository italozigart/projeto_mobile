import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { onValue, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    ImageBackground,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { database } from "../../services/connectionFirebase";

//tipagem do produto alinhada com o que é salvo no RegisterProduct
interface Product {
    id: string;
    nome: string;
    traducao: string;
    editora: string;
    imagem: string;
}

export default function ProductList() {

    const navigation: any = useNavigation();

    //lista de produtos carregada do Firebase
    const [products, setProducts] = useState<Product[]>([]);

    //controla se o modal de edição está visível
    const [modalVisible, setModalVisible] = useState(false);

    //produto que está sendo editado no momento
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    //estados dos campos do formulário de edição
    const [nome, setNome] = useState("");
    const [traducao, setTraducao] = useState("");
    const [editora, setEditora] = useState("");
    const [imagem, setImagem] = useState("");

    useEffect(() => {
        //escuta em tempo real o nó "products" no Firebase
        const productsRef = ref(database, "products");

        const unsubscribe = onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            const list: Product[] = [];

            //converte o objeto do Firebase em array com id
            for (let id in data) {
                list.push({ id, ...data[id] });
            }

            setProducts(list);
        });

        //cancela a escuta ao sair da tela
        return () => unsubscribe();
    }, []);

    //abre o modal preenchendo os campos com os dados do produto selecionado
    const handleOpenEdit = (product: Product) => {
        setSelectedProduct(product);
        setNome(product.nome);
        setTraducao(product.traducao);
        setEditora(product.editora);
        setImagem(product.imagem);
        setModalVisible(true);
    };

    //salva as alterações no Firebase
    const handleSaveEdit = async () => {
        if (!selectedProduct) return;

        try {
            await update(ref(database, "products/" + selectedProduct.id), {
                nome: nome,
                traducao: traducao,
                editora: editora,
                imagem: imagem,
            });

            Alert.alert("Sucesso", "Produto atualizado com sucesso.");
            setModalVisible(false);
        } catch (error: any) {
            Alert.alert("Erro", "Não foi possível atualizar o produto.");
        }
    };

    //confirma antes de excluir
    const handleDelete = (id: string) => {
        Alert.alert(
            "Excluir produto",
            "Tem certeza que deseja excluir este produto?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await remove(ref(database, "products/" + id));
                            Alert.alert("Sucesso", "Produto excluído.");
                        } catch (error: any) {
                            Alert.alert("Erro", "Não foi possível excluir o produto.");
                        }
                    },
                },
            ]
        );
    };

    //renderiza cada item da lista
    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <View style={styles.productInfo}>
                <Text style={styles.productNome}>{item.nome}</Text>
                <Text style={styles.productDetail}>Tradução: {item.traducao}</Text>
                <Text style={styles.productDetail}>Editora: {item.editora}</Text>
            </View>

            <View style={styles.productActions}>
                {/*botão editar*/}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleOpenEdit(item)}
                >
                    <Ionicons name="pencil-outline" size={20} color="#B8860B" />
                </TouchableOpacity>

                {/*botão excluir*/}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#cc0000" />
                </TouchableOpacity>
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
                {/*botão logout no topo*/}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => navigation.navigate("HomeScreen")}
                >
                    <Ionicons name="log-out-outline" size={28} color="#fff" />
                </TouchableOpacity>

                {/*área central com a lista*/}
                <View style={styles.content}>
                    <View style={styles.listContainer}>
                        <Text style={styles.title}>Produtos</Text>

                        {products.length === 0 ? (
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

                {/*footer igual ao UserPerfil*/}
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

            {/*modal de edição*/}
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
                            <TouchableOpacity
                                style={styles.button2}
                                onPress={handleSaveEdit}
                            >
                                <Text style={styles.buttonText}>SALVAR</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button2, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
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
        paddingTop: 80, //espaço pro botão de logout
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

    emptyText: {
        textAlign: "center",
        color: "#999",
        fontSize: 14,
        marginTop: 20,
    },

    productCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingVertical: 12,
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
        gap: 12,
    },

    editButton: {
        padding: 6,
    },

    deleteButton: {
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

    //modal
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