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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
  return signOut(auth);
};

export const register = async (email: string, password: string) => {
  try {
    console.log("Registering user...", email, password);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user: User = userCredential.user;

    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: new Date().toISOString(),
    });

    return { success: true, user };
  } catch (error: any) {
    console.log("Error registering user:", error);
    return { success: false, message: error.message || "Failed to register user." };
  }
};

const updateUserEmail = (user: User, newEmail: string) => {
  return updateEmail(user, newEmail);
};

const updateUserPassword = (user: User, newPassword: string) => {
  return updatePassword(user, newPassword);
};

const updateUserProfile = (user: User, name?: string) => {
  return updateProfile(user, {
    displayName: name
  });
}

// const updateUserProfile = async (
//   user: User,
//   name?: string,
//   photoURL?: string
// ): Promise<{ success: boolean; message: string }> => {
//   try {
//     console.log("photoURL", photoURL);
//     await updateProfile(user, {
//       displayName: name,
//       photoURL: photoURL,
//     });

//     return {

//       success: true,
//       message: "Profile updated successfully!",
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Failed to update profile.",
//     };
//   }
// };

  
const deleteCurrentUser = (user: User) => {
  return deleteUser(user);
};



// export const uploadImageAndUpdateProfile = async (
//   user: User,
//   name?: string,
//   localUri?: string
// ): Promise<{ success: boolean; message: string }> => {
//   try {
//     let photoURL: string | undefined = undefined;

//     if (localUri) {
//       // Read the local file as a blob
//       const file = await FileSystem.readAsStringAsync(localUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
//       const imgBlob = new Blob([Uint8Array.from(atob(file), c => c.charCodeAt(0))]);

//       // Upload to Firebase Storage
//       const storage = getStorage();
//       const storageRef = ref(storage, `profileImages/${user.uid}.jpg`);
//       await uploadBytes(storageRef, imgBlob);

//       // Get download URL
//       photoURL = await getDownloadURL(storageRef);
//     }

//     // Update Firebase Auth profile
//     await updateProfile(user, { displayName: name, photoURL });

//     return { success: true, message: "Profile updated successfully!" };
//   } catch (error: any) {
//     return { success: false, message: error.message || "Failed to update profile." };
//   }
// };

export const uploadImageAndUpdateProfile = async (
  user: User,
  name?: string,
  localUri?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log("localUri", localUri);
    let photoURL: string | undefined;

    if (localUri) {
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${user.uid}.jpg`);

      const response = await fetch(localUri);
      const blob = await response.blob();  // Expo compatible
      await uploadBytes(storageRef, blob);

      photoURL = await getDownloadURL(storageRef); // assign to photoURL
    }

    await updateProfile(user, { displayName: name, photoURL });

    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
  console.log(" STORAGE ERROR FULL:", JSON.stringify(error, null, 2));
  return {
    success: false,
    message: error.message || "Failed to update profile.",
  };
  }
};




export { login, logOut, updateUserEmail, updateUserPassword,updateUserProfile, deleteCurrentUser };
