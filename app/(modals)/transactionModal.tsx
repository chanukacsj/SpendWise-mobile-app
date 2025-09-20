import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import * as Icons from "phosphor-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getProfileImage } from "@/services/imageServices";
import {
  TransactionListType,
  TransactionType,
  UserDataType,
  WalletType,
} from "@/type";
import { useAuth } from "@/context/AuthContext";
import { uploadImageAndUpdateProfile } from "@/services/authService";
import * as ImagePicker from "expo-image-picker";
import { updateUser } from "@/services/userService";
import { updateUserProfile } from "@/services/authService";
import { User } from "firebase/auth";
import ImageUpload from "@/components/imageUpload";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { Picker } from "@react-native-picker/picker";
import { expenseCategories, transactionTypes } from "@/config/data";
import { Dropdown } from "react-native-element-dropdown";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { createOrUpdateTransaction } from "@/services/transactionService";

const TransactionModal = () => {
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const oldTransaction: { name: string; image: string; id: string } =
    useLocalSearchParams();

  const OnDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };

  //   useEffect(() => {
  //     if (oldTransaction?.id) {
  //       setTransaction({
  //         name: oldTransaction?.name,
  //         image: oldTransaction?.image,
  //       });
  //     }
  //   }, []);

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;

    if (!walletId || !date || !amount || (type == "expense" && !category)) {
      Alert.alert("Transaction", "please fill all the fields");
      return;
    }
    console.log("goo");

    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid,
    };
    console.log("transactionData", transactionData);

    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);

    if (res.success){
      router.push("/(dashboard)/home");
    }else{
      Alert.alert("Transaction", res.message);
    }
  };

  const onDelete = async () => {
    console.log("onDelete", oldTransaction?.id);
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldTransaction?.id);
    setLoading(false);
    if (res.success) {
      router.push("/(dashboard)/wallet");
    } else {
      Alert.alert("Wallet", res.message);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this wallet?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View className="flex-1 bg-black">
      <Animatable.View
        animation="slideInUp"
        duration={500}
        easing="ease-out-cubic"
        className="flex-1 bg-[#262626] mt-10 border-t rounded-t-3xl p-5 shadow-lg"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-center mb-6 relative top-8">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/home")}
              className="absolute left-1 bg-gray-600 rounded-2xl p-2  w-[45px]  items-center"
            >
              <FontAwesome
                name="caret-left"
                size={28}
                color="white"
                className="mr-1"
              />
            </TouchableOpacity>

            {/* Title */}
            <Animatable.Text
              animation="fadeInDown"
              duration={600}
              className="text-xl font-bold text-white"
            >
              {oldTransaction?.id ? "Update Transaction" : "New Transaction"}
            </Animatable.Text>
          </View>

          {/* Name */}
          <Animatable.View animation="fadeInUp" delay={200} className="mt-12">
            <Text className="text-gray-300 mb-5">Type</Text>
            {/* dropdown */}
            <Dropdown
              style={[
                {
                  backgroundColor: "#1e1e1e",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: "#737373",
                },
              ]}
              placeholderStyle={{
                color: "#9ca3af",
                fontSize: 16,
              }}
              selectedTextStyle={{
                color: "white",
                fontSize: 16,
              }}
              inputSearchStyle={{
                color: "white",
                fontSize: 16,
              }}
              iconStyle={{
                width: 20,
                height: 20,
              }}
              itemTextStyle={{
                color: "white",
              }}
              itemContainerStyle={{}}
              containerStyle={{
                borderRadius: 12,
                backgroundColor: "#171717",
                shadowColor: "black",
                borderColor: "#737373",
                shadowOffset: { width: 0, height: 5 },
                top: 5,
                shadowOpacity: 1,
                shadowRadius: 15,
                elevation: 5,
              }}
              activeColor="#404040"
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              //placeholder={!isFocus ? "Select item" : "..."}
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
            />
          </Animatable.View>
          {/* wallet input */}
          <Animatable.View
            animation="fadeInUp"
            delay={200}
            className="mb-5 mt-5"
          >
            <Text className="text-gray-300 mb-5">Wallet</Text>
            {/* dropdown */}
            <Dropdown
              style={[
                {
                  backgroundColor: "#1e1e1e",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: "#737373",
                },
              ]}
              placeholderStyle={{
                color: "#9ca3af",
                fontSize: 16,
              }}
              selectedTextStyle={{
                color: "white",
                fontSize: 16,
              }}
              inputSearchStyle={{
                color: "white",
                fontSize: 16,
              }}
              iconStyle={{
                width: 20,
                height: 20,
              }}
              itemTextStyle={{
                color: "white",
              }}
              itemContainerStyle={{}}
              containerStyle={{
                borderRadius: 12,
                backgroundColor: "#171717",
                shadowColor: "black",
                borderColor: "#737373",
                shadowOffset: { width: 0, height: 5 },
                top: 5,
                shadowOpacity: 1,
                shadowRadius: 15,
                elevation: 5,
              }}
              activeColor="#404040"
              data={wallets.map((wallet) => ({
                label: `${wallet?.name}($${wallet.amount})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={"Select wallet"}
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
            />
          </Animatable.View>

          {/* expense category */}
          {transaction.type === "expense" && (
            <Animatable.View animation="fadeInUp" delay={200} className="mb-5">
              <Text className="text-gray-300 mb-5">Expense Category</Text>
              {/* dropdown */}
              <Dropdown
                style={[
                  {
                    backgroundColor: "#1e1e1e",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderColor: "#737373",
                  },
                ]}
                placeholderStyle={{
                  color: "#9ca3af",
                  fontSize: 16,
                }}
                selectedTextStyle={{
                  color: "white",
                  fontSize: 16,
                }}
                inputSearchStyle={{
                  color: "white",
                  fontSize: 16,
                }}
                iconStyle={{
                  width: 20,
                  height: 20,
                }}
                itemTextStyle={{
                  color: "white",
                }}
                itemContainerStyle={{}}
                containerStyle={{
                  borderRadius: 12,
                  backgroundColor: "#171717",
                  shadowColor: "black",
                  borderColor: "#737373",
                  shadowOffset: { width: 0, height: 5 },
                  top: 5,
                  shadowOpacity: 1,
                  shadowRadius: 15,
                  elevation: 5,
                }}
                activeColor="#404040"
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={"Select category"}
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
              />
            </Animatable.View>
          )}

          {/* {date picker} */}

          <Animatable.View animation="fadeInUp" delay={200} className="mb-5">
            <Text className="text-gray-300 mb-2">Date</Text>
            {!showDatePicker && (
              <Pressable
                style={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderWidth: 1,
                  borderColor: "#737373",
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <Text className="text-white text-lg font-medium">
                  {(transaction.date as Date).toLocaleDateString()}
                </Text>
              </Pressable>
            )}
            {showDatePicker && (
              <View style={Platform.OS == "ios" && { paddingTop: 20 }}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  mode="date"
                  textColor="white"
                  display={Platform.OS == "ios" ? "spinner" : "default"}
                  onChange={OnDateChange}
                />
                {Platform.OS == "ios" && (
                  <TouchableOpacity
                    className="mt-3 bg-[#404040] px-4 py-2 rounded-lg items-center"
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text className="text-white text-lg font-medium">OK</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Animatable.View>
          {/* {amount} */}

          <Animatable.View animation="fadeInUp" delay={200} className="mb-4">
            <Text className="text-gray-300 mb-2">Amount</Text>
            <TextInput
              // placeholder="Enter your name"
              placeholderTextColor="#6b7280"
              className="bg-[#1e1e1e] rounded-xl px-4 py-4 border text-white border-[#737373]"
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </Animatable.View>
          <Animatable.View animation="fadeInUp" delay={200} className="mb-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-300 mr-2">Description</Text>
              <Text className="text-gray-500 text-sm">(optional)</Text>
            </View>

            <TextInput
              placeholder="Enter description"
              placeholderTextColor="#6b7280"
              className="bg-[#1e1e1e] rounded-xl px-4 py-4 border border-[#737373] text-white"
              value={transaction.description}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={200}>
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-300 mr-2">Receipt</Text>
              <Text className="text-gray-500 text-sm">(optional)</Text>
            </View>

            <ImageUpload
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              placeholder="Upload Image"
              imageStyle={{ width: 20, height: 20, borderRadius: 12 }}
            />
          </Animatable.View>

          {/* Save Button and delete Button */}
          <Animatable.View
            animation="bounceIn"
            delay={600}
            className="flex-row mt-6 items-center space-x-3"
          >
            {oldTransaction?.id && !loading && (
              <TouchableOpacity
                className=" mr-3 p-3 rounded-2xl bg-red-500 shadow-md items-center justify-center"
                onPress={showDeleteAlert}
              >
                <FontAwesome name="trash" size={28} color="white" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className={`flex-1 p-4 rounded-2xl shadow-md items-center justify-center ${
                loading ? "bg-gray-400" : "bg-green-500"
              }`}
              activeOpacity={0.8}
              disabled={loading}
              onPress={onSubmit}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-center text-white font-semibold text-base">
                  {oldTransaction?.id ? "Update" : "Submit"}
                </Text>
              )}
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default TransactionModal;
