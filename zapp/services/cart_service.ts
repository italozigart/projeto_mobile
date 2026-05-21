import { CartItem } from '../src/models/CartItem';

const BASE_URL = 'https://6a0e357b1736097c360994a5.mockapi.io/cart';

export const cartService = {
    async getByUser(userId: string): Promise<CartItem[]> {
        const response = await fetch(`${BASE_URL}?userId=${userId}`);
        if (!response.ok) throw new Error('Erro ao buscar carrinho.');
        return await response.json();
    },

    async addItem(item: Omit<CartItem, 'id'>): Promise<CartItem> {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error('Erro ao adicionar ao carrinho.');
        return await response.json();
    },

    async updateQuantity(id: string, quantidade: number): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantidade }),
        });
        if (!response.ok) throw new Error('Erro ao atualizar quantidade.');
    },

    async removeItem(id: string): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao remover item.');
    },
};