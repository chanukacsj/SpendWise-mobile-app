import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import * as Icons from "phosphor-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getProfileImage } from "@/services/imageServices";
import { UserDataType, WalletType } from "@/type";
import { useAuth } from "@/context/AuthContext";
import { uploadImageAndUpdateProfile } from "@/services/authService";
import * as ImagePicker from "expo-image-picker";
import { updateUser } from "@/services/userService";
import { updateUserProfile } from "@/services/authService";
import { User } from "firebase/auth";
import ImageUpload from "@/components/imageUpload";
import { createOrUpdateWallet } from "@/services/walletService";

const walletModal = () => {
  const { user, updateUserData } = useAuth();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim || !image) {
      Alert.alert("Wallet", "Please fill in the name field");
      return;
    }

    console.log("hee");

    const data: WalletType = {
      name,
      image,
      uid: user?.uid
    };


    setLoading(true);
    const res = await createOrUpdateWallet(data);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.message);
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Animated Modal Body */}
      <Animatable.View
        animation="slideInUp"
        duration={500}
        easing="ease-out-cubic"
        className="flex-1 bg-[#262626] mt-10 border-t rounded-t-3xl p-5 shadow-lg"
      >
        {/* Header */}
        <View className="flex-row items-center justify-center mb-6 relative top-8">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.push("/(dashboard)/wallet")}
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
            New Wallet
          </Animatable.Text>
        </View>

        {/* Name */}
        <ScrollView>
          <Animatable.View
            animation="fadeInUp"
            delay={200}
            className="mb-4 mt-20"
          >
            <Text className="text-gray-300 mb-2">Wallet Name</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#6b7280"
              className="bg-[#1e1e1e] text-white rounded-xl p-3"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            delay={200}
            className="mb-4 mt-2"
          >
            <Text className="text-gray-300 mb-2">Wallet Icon</Text>
            <ImageUpload
              file={wallet.image}
              onClear={() => setWallet({ ...wallet, image: null })}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              placeholder="Upload Image"
            />
          </Animatable.View>
        </ScrollView>

        {/* Save Button */}
        <Animatable.View animation="bounceIn" delay={600}>
          <TouchableOpacity
            className={`p-4 rounded-2xl mt-6 shadow-md ${
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
                Add Wallet
              </Text>
            )}
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};

export default walletModal;
