import { db } from "@/firebase";
import { TransactionType, WalletType } from "@/type";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServices";
import { ResponseType } from "@/type";
export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!walletId || !amount || amount <= 0 || !type) {
      return { success: false, message: "invalid data" };
    }
    if (id) {
      //update transaction
    } else {
      //update wallet for new transaction
      //update wallet
      let res = await updateWalletForNewTransaction(
        walletId,
        Number(amount!),
        type
      );
      if (!res.success) {
        return res;
      }
    }
    if (image) {
      const imageUploadRes = await uploadFileToCloudinary(
        image,
        "transactions"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          message: imageUploadRes.message || "Failed to upload receipt.",
        };
      }
      transactionData.image = imageUploadRes.data;
    }
    const transactionRef = id
      ? doc(db, "transactions", id)
      : doc(collection(db, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    console.log("error creating or updating transaction", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(db, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists()) {
      console.log("error updating wallet for new transaction");
      return {
        success: false,
        message: "wallet not found",
      };
    }
    const walletData = walletSnapshot.data() as WalletType;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        message: "selected wallet does not have enough balance",
      };
    }
    const updatedType = type == "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;
    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updatedType]: updatedTotals,
    });
    return { success: true };
  } catch (error: any) {
    console.log("error updating wallet for new transaction", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
