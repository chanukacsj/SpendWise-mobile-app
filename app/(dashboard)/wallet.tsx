import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import * as Icons from 'phosphor-react-native';
import { router } from "expo-router";
const SettingScreen = () => {
  const getTotalBalance = () => {
    return 2010;
  };

  return (
    <ScreenWrapper style={{ backgroundColor: "black" }}>
      {/* balance view */}
      <View className="items-center mt-10">
        <Text className="text-white font-medium text-5xl">
          ${getTotalBalance().toFixed(2)}
        </Text>
        <Text className="text-gray-400 font-extralight text-2xl mt-2">
          Total Balance
        </Text>
      </View>

      {/* wallet */}
      <View className="flex-1 bg-[#171717] rounded-t-xl mt-10 p-5">
        <View className="flex-row items-center justify-between mb-5">
          <Text className="text-white text-2xl font-medium">My wallets</Text>
          <TouchableOpacity onPress={()=> router.push("/(modals)/walletModal")}>
            <Icons.PlusCircle size={25} weight="fill"  color="green" />
          </TouchableOpacity>
        </View>

        {/* content inside wallet view */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">No wallets yet</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SettingScreen;
