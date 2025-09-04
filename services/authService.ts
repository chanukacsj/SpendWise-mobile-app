import { 
  createUserWithEmailAndPassword, 
  deleteUser, 
  signInWithEmailAndPassword, 
  signOut, 
  updateEmail, 
  updatePassword,
  updateProfile,
  User
} from "firebase/auth";
import { auth } from "@/firebase";

const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
  return signOut(auth);
};

const register = (email: string, password: string) => {
    console.log("Registering user...", email, password);
  return createUserWithEmailAndPassword(auth, email, password);
};

const updateUserEmail = (user: User, newEmail: string) => {
  return updateEmail(user, newEmail);
};

const updateUserPassword = (user: User, newPassword: string) => {
  return updatePassword(user, newPassword);
};

const updateUserProfile = (user: User, name?: string, photoURL?: string) => {
  return updateProfile(user, {
    displayName: name,
    photoURL: photoURL,
  });
}
  
const deleteCurrentUser = (user: User) => {
  return deleteUser(user);
};

export { login, logOut, register, updateUserEmail, updateUserPassword, updateUserProfile, deleteCurrentUser };
