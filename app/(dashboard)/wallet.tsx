import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import * as Icons from 'phosphor-react-native';
import { router } from "expo-router";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/type";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import WalletListItem from "@/components/WalletListItem";
const Wallet = () => {

  const {user} = useAuth();
  const {data:wallets,error,loading} = useFetchData<WalletType>("wallets",[
    where("uid","==",user?.uid),
    orderBy("created","desc"),
  ])

  console.log("wallets",wallets.length);
  const getTotalBalance = () => 
    wallets.reduce((total, item)=>{
      total = total + (item.amount || 0);
      return total;
    },0)
  

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

        
       
        <FlatList data={wallets} 
        renderItem={({item, index}) => {
        return(
            <WalletListItem item={item} index={index} router={router} />
        );
        }}
        />
        
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;
