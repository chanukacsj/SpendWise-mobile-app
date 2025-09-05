import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import { auth } from "@/firebase";
import { Button } from "@react-navigation/elements";
import { signOut } from "firebase/auth";

const HomeScreen = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <ScreenWrapper>
      <Text className="text-center text-4xl mb-6">Home</Text>
      <TouchableOpacity
        className="bg-red-600 px-6 py-3 rounded-md items-center"
        onPress={handleLogout}
      >
        <Text className="text-white font-bold text-lg">Logout</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default HomeScreen;
