import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import { auth } from "@/firebase";
import { Button } from "@react-navigation/elements";
import { signOut } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import HomeCard from "@/components/HomeCard";
import { limit, orderBy, Transaction, where } from "firebase/firestore";
import TransactionList from "@/components/TransactionList";
import { router } from "expo-router";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType, WalletType } from "@/type";

const HomeScreen = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ];

    const {
      data: recentTransactions,
      error,
      loading: transactionLoading,
    } = useFetchData<TransactionType>("transactions", constraints);

  return (
    <ScreenWrapper>
      <View className="flex-1">
        {/* header */}
        <View className="flex-row items-center justify-between">
          <View className="gap-1 px-4">
            <Text className="text-[#a3a3a3] text-xl">Hello,</Text>
            <Text className="text-white text-xl font-medium">{user?.name}</Text>
          </View>
          <TouchableOpacity className="mr-4 bg-[#404040] p-2 rounded-full">
            <Icons.MagnifyingGlassIcon
              color="#e5e5e5"
              size={30}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View>
            <HomeCard />
          </View>
          <TransactionList
            data={recentTransactions}
            loading={transactionLoading}
            emptyListMessage="No recent transactions!"
            title="Recent Transactions"
          />
        </ScrollView>
        <TouchableOpacity
          className="absolute bottom-4 right-4 bg-[#404040] p-2 rounded-full"
          onPress={() => router.push("../(modals)/transactionModal")}
        >
          <Icons.PlusIcon color="white" size={40} weight="bold" />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;
