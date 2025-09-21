import { ResponseType, WalletType } from "@/type";
import { uploadFileToCloudinary } from "./imageServices";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/firebase";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletTosave = { ...walletData };

    if (walletData.image) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          message: imageUploadRes.message || "Failed to upload wallet icon.",
        };
      }
      walletTosave.image = imageUploadRes.data;
    }
    if (!walletData?.id) {
      //new wallet
      walletTosave.amount = 0;
      walletTosave.totalIncome = 0;
      walletTosave.totalExpenses = 0;
      walletTosave.created = new Date();
    }
    const walletRef = walletData?.id
      ? doc(db, "wallets", walletData?.id)
      : doc(collection(db, "wallets"));

    await setDoc(walletRef, walletTosave, { merge: true }); //updates only the data that is provided
    return { success: true, data: { ...walletTosave, id: walletRef.id } };
  } catch (error: any) {
    console.log("error creating wallet", error);
    return {
      success: false,
      message: error.message || "Failed to create wallet.",
    };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(db, "wallets", walletId);
    await deleteDoc(walletRef);

    deleteTransactionByWallet(walletId);

    return { success: true, message: "Wallet deleted successfully!" };
  } catch (error: any) {
    console.log("error deleting wallet", error);
    return {
      success: false,
      message: error.message || "Failed to delete wallet.",
    };
  }
};

export const deleteTransactionByWallet = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransactions = true;

    while (hasMoreTransactions) {
      const transactionQuery = query(
        collection(db, "transactions"),
        where("walletId", "==", walletId)
      );

      const transactionSnapshot = await getDocs(transactionQuery);
      if (transactionSnapshot.size == 0) {
        hasMoreTransactions = false;
        break;
      }
      const batch = writeBatch(db);

      //   transactionSnapshot.forEach((doc) => {
      //     batch.delete(doc.ref);

      //   });

      transactionSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.uid === auth.currentUser?.uid) {
          batch.delete(docSnap.ref);
        }
      });

      await batch.commit();
      console.log("transactions deleted" + transactionSnapshot.size);
    }

    return { success: true, message: "Wallet deleted successfully!" };
  } catch (error: any) {
    console.log("error deleting wallet", error);
    return {
      success: false,
      message: error.message || "Failed to delete wallet.",
    };
  }
};
