// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBt3DK8cNPgOK9a_XBpi3-bCI8fdw0pDBs",
  authDomain: "storage-aktif.firebaseapp.com",
  projectId: "storage-aktif",
  storageBucket: "storage-aktif.firebasestorage.app",
  messagingSenderId: "503324619180",
  appId: "1:503324619180:web:100778def46bab2df3ca09",
  measurementId: "G-4BCGKLTGX4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
