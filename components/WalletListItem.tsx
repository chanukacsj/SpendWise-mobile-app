import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { WalletType } from "@/type";
import { Router } from "expo-router";
import { getFilePath } from "@/services/imageServices";
import * as Icons from "phosphor-react-native";
import * as Animatable from "react-native-animatable";

const WalletListItem = ({
  item,
  router,
  index,
}: {
  item: WalletType;
  router: Router;
  index: number;
}) => {
  const openWallet = () => {
    console.log("openWallet");
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
      },
    });
  };
  return (
    <Animatable.View
      animation="fadeInDown"
      delay={index * 80}
      duration={400}
      className="mb-3"
      useNativeDriver
    >
      <TouchableOpacity onPress={openWallet} className="flex-row items-center bg-[#262626] p-4 rounded-xl justify-between">
        <View className="flex-row items-center">
          {item.image && (
            <Image
              source={getFilePath(item.image)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 12,
              }}
            />
          )}
          <Text className="text-white text-lg font-medium">{item.name}</Text>
        </View>

        <View className="flex-row items-center space-x-2">
          <Text className="text-green-400 text-lg mr-1 font-semibold">
            ${item.amount?.toFixed(2) || "0.00"}
          </Text>
          <Icons.CaretRight size={24} color="white" weight="bold" />
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default WalletListItem;
