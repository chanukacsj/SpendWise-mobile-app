import { View, Text, ImageBackground } from "react-native";
import React from "react";
import * as Icons from "phosphor-react-native";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/type";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";


const HomeCard = () => {

    const { user } = useAuth();
  

  const {
      data: wallets,
      error,
      loading: walletLoading,
    } = useFetchData<WalletType>("wallets", [
      where("uid", "==", user?.uid),
      orderBy("created", "desc"),
    ]);
  
    const getTotals = () =>{
     return wallets.reduce((totals:any, item: WalletType)=>{
        totals.balance = totals.balance + Number(item.amount);
        totals.income = totals.income + Number(item.totalIncome);
        totals.expenses = totals.expenses + Number(item.totalExpenses);
        return totals;
  
      },{balance:0 , income: 0, expenses: 0})
    }

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
          <Text className="text-black text-4xl font-extrabold">  LKR {getTotals()?.balance?.toFixed(2)}</Text>
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
                          LKR {getTotals()?.income?.toFixed(2)}
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
                        LKR {getTotals()?.expenses?.toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;
