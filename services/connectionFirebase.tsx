
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBjRek4WSLLDCEhzjfK56nbKC7AXpIhnjA",
  authDomain: "bibleosity-2d65a.firebaseapp.com",
  projectId: "bibleosity-2d65a",
  databaseUrl: "https://bibleosity-2d65a-default-rtdb.firebaseio.com/",
  storageBucket: "bibleosity-2d65a.firebasestorage.app",
  messagingSenderId: "434821887048",
  appId: "1:434821887048:web:52c4f344d09586df47947d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;