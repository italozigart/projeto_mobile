import { get, push, ref, remove, update } from 'firebase/database';
import { db } from '../services/connectionFirebase';
import { Product } from '../src/models/Product';

const PATH = 'products';

export const productService = {
  async create(product: Product) {
    const productRef = ref(db, PATH);
    await push(productRef, product);
  },

  async getAll(): Promise<Product[]> {
    const snapshot = await get(ref(db, PATH));
    const data = snapshot.val();

    const products: Product[] = [];

    for (let id in data) {
      products.push({ id, ...data[id] });
    }

    return products;
  },

  async update(id: string, product: Product) {
    const productRef = ref(db, `${PATH}/${id}`);
    await update(productRef, product);
  },

  async delete(id: string) {
    const productRef = ref(db, `${PATH}/${id}`);
    await remove(productRef);
  }
};