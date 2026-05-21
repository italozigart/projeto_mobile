export interface CartItem {
    id?: string;
    userId: string;
    productId: string;
    nome: string;
    imagem: string;
    preco: number;
    quantidade: number;
}