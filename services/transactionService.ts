import { db } from "@/firebase";
import { TransactionType, WalletType } from "@/type";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServices";
import { ResponseType } from "@/type";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createOrUpdateWallet } from "./walletService";
export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!walletId || !amount || amount <= 0 || !type) {
      return { success: false, message: "invalid data" };
    }
    if (id) {
      const oldTransactionSnapshot = await getDoc(doc(db, "transactions", id));
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOriginal =
        oldTransaction.walletId != walletId ||
        oldTransaction.type != type ||
        oldTransaction.amount != amount;

      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) {
          return res;
        }
      }
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
      return {
        success: false,
        message: "wallet not found",
      };
    }

    const walletData = walletSnapshot.data() as WalletType;

    const currentAmount = Number(walletData.amount || 0);
    const currentIncome = Number(walletData.totalIncome || 0);
    const currentExpenses = Number(walletData.totalExpenses || 0);

    if (type === "expense" && currentAmount - amount < 0) {
      return {
        success: false,
        message: "selected wallet does not have enough balance",
      };
    }

    const updatedType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type === "income" ? currentAmount + amount : currentAmount - amount;

    const updatedTotals =
      type === "income" ? currentIncome + amount : currentExpenses + amount;

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


const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    const originalWalletSnapshot = await getDoc(
      doc(db, "wallets", oldTransaction.walletId!)
    );

    const originalWallet = originalWalletSnapshot.data() as WalletType;

    let newWalletSnapshot = await getDoc(doc(db, "wallets", newWalletId));
    let newWallet = newWalletSnapshot.data() as WalletType;

    // rollback old transaction
    const revertType =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpenses =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertWalletAmount = Number(originalWallet.amount || 0) + revertIncomeExpenses;
    const revertedIncomeExpensesAmount =
      Number(originalWallet[revertType] || 0) - Number(oldTransaction.amount);

    if (newTransactionType === "expense") {
      if (
        oldTransaction.walletId === newWalletId &&
        revertWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          message: "selected wallet does not have enough balance",
        };
      }
      if ((newWallet.amount || 0) < newTransactionAmount) {
        return {
          success: false,
          message: "selected wallet does not have enough balance",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertWalletAmount,
      [revertType]: revertedIncomeExpensesAmount,
    });

    // refetch updated wallet
    newWalletSnapshot = await getDoc(doc(db, "wallets", newWalletId));
    newWallet = newWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType === "income" ? "totalIncome" : "totalExpenses";

    const updatedWalletAmount =
      newTransactionType === "income"
        ? Number(newWallet.amount || 0) + newTransactionAmount
        : Number(newWallet.amount || 0) - newTransactionAmount;

    const updatedTotals =
      newTransactionType === "income"
        ? Number(newWallet.totalIncome || 0) + newTransactionAmount
        : Number(newWallet.totalExpenses || 0) + newTransactionAmount;

    await createOrUpdateWallet({
      id: newWalletId,
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
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


export const deleteTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {

    const transactionRef = doc(db, "transactions", transactionId);

    const transactionSnapshot = await getDoc(transactionRef);

    if (!transactionSnapshot.exists()) {
      return {
        success: false,
        message: "transaction not found",
      };
    }

    const transactionData = transactionSnapshot.data() as TransactionType;

    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    const WalletSnapshot = await getDoc(doc(db, "wallets", walletId));
   const walletData = WalletSnapshot.data() as WalletType;

   //check the fields to be updated based on transaction type

   const updatedType = 
   transactionType == "income" ? "totalIncome" : "totalExpenses";

   const newWalletAmount = 
     walletData?.amount! - (transactionType == "income" ? transactionAmount : -transactionAmount);

     const newIncomeExpensesAmount = 
     walletData[updatedType]! - transactionAmount;

     if(transactionType == "expense" && newWalletAmount < 0){
      return {
        success: false,
        message: "You cannot delete this transaction",
      };
     }

     await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updatedType]: newIncomeExpensesAmount,
    });

    await deleteDoc(transactionRef);

    return { success: true };
  } catch (error: any) {
    console.log("error deleting transaction", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
