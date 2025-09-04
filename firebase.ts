import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADF6L-8VVXYKSQWV4Kb3Z_C647mksjALI",
  authDomain: "spend-wise-mobile-app.firebaseapp.com",
  projectId: "spend-wise-mobile-app",
  storageBucket: "spend-wise-mobile-app.firebasestorage.app",
  messagingSenderId: "446942405590",
  appId: "1:446942405590:web:8f2ff73cd2ba92ed70fa77"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);


export const auth = getAuth(app)
export const db = getFirestore(app)