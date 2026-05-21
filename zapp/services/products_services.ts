import { Product } from '../src/models/Product';

const BASE_URL = 'https://6a0e357b1736097c360994a5.mockapi.io/products';

export const productService = {
    async create(product: Omit<Product, 'id'>) {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error('Erro ao cadastrar produto.');
        return await response.json();
    },

    async getAll(): Promise<Product[]> {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('Erro ao buscar produtos.');
        return await response.json();
    },

    async update(id: string, product: Omit<Product, 'id'>) {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        if (!response.ok) throw new Error('Erro ao atualizar produto.');
        return await response.json();
    },

    async delete(id: string) {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao excluir produto.');
    },
};