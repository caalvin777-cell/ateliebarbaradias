import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBP-gn3YfZeqK7LoKky3GWMemVJInqTGS4",
  authDomain: "ateliebarbaradias-d8494.firebaseapp.com",
  projectId: "ateliebarbaradias-d8494",
  storageBucket: "ateliebarbaradias-d8494.firebasestorage.app",
  messagingSenderId: "1020281501442",
  appId: "1:1020281501442:web:2257ef925578f20aaf741b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);