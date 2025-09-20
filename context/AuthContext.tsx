import { auth, db } from "@/firebase";
import { AuthContextType, UserType } from "@/type";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,(firebaseUser) => {
      console.log("unsub")
      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName ?? null,
        });
        updateUserData(firebaseUser.uid);
        router.push("/(dashboard)/home");
      } else {
        setUser(null);
        router.push("/(auth)/welcome");
      }
    });

    return () => unsubscribe();
  }, []);


  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);

      // update state
      setUser({
        uid: res.user.uid,
        email: res.user.email,
        name: res.user.displayName ?? null,
        image: res.user.photoURL ?? null,
      });

      return { success: true };
    } catch (error: any) {
      console.error(error);
      let msg = error.message;
      return { success: false, msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      let response = await createUserWithEmailAndPassword(auth, email, password);

      // save to firestore
      await setDoc(doc(db, "users", response.user.uid), {
        email,
        name,
        uid: response.user.uid,
      });

      setUser({
        uid: response.user.uid,
        email,
        name,
        image: null,
      });

      return { success: true };
    } catch (error: any) {
      console.error(error);
      let msg = error.message;
      return { success: false, msg };
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      setLoading(true);
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid,
          email: data?.email || null,
          name: data?.name || null,
          image: data?.image || null,
        };
        setUser(userData);
      }
    } catch (error: any) {
      console.error("Error updating user data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
