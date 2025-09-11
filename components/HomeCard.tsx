import { View, Text, ImageBackground } from "react-native";
import React from "react";
import * as Icons from "phosphor-react-native";

const HomeCard = () => {
  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      resizeMode="stretch"
      className="w-full h-[250px] mt-4 rounded-xl overflow-hidden"
    >
      {/* container */}
      <View className="p-4 justify-between">
        <View>
          {/* total balance */}
          <View className="flex-row justify-between align-items-center mb-4">
            <Text className="text-black text-xl font-bold">Total Balance</Text>
            <Icons.DotsThreeOutlineIcon color="black" size={25} weight="bold" />
          </View>
          <Text className="text-black text-4xl font-extrabold">$2345.22</Text>
        </View>
        {/* expense and income */}
        <View className="flex-row mt-12 justify-between items-center">
            {/* income */}
            <View className="gap-1">
                <View className="flex-row gap-2">
                    <View className="bg-[#F2F2F2] p-2 rounded-full">
                       <Icons.ArrowDownIcon color="black" size={15} weight="bold"/> 
                    </View>
                    <Text className="text-black text-lg font-bold">
                        Income
                    </Text>
                </View>
                <View>
                    <Text className="text-green-500 p-2 text-xl font-extrabold">
                        $2345.22
                    </Text>
                </View>
            </View>
            {/* expense */}
             <View className="gap-1">
                <View className="flex-row gap-2">
                    <View className="bg-[#F2F2F2] p-2 rounded-full">
                       <Icons.ArrowUpIcon color="black" size={15} weight="bold"/> 
                    </View>
                    <Text className="text-black text-lg font-bold">
                        Expense
                    </Text>
                </View>
                <View>
                    <Text className="text-red-500 p-2 text-xl font-extrabold">
                        $2345.22
                    </Text>
                </View>
            </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;
