import { View, Text } from "react-native";
import React from "react";
import { Transaction } from "firebase/firestore";
import { TransactionItemProps, TransactionListType } from "@/type";
import { FlashList } from "@shopify/flash-list";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {


  const handleClick = () => {
    console.log(" handleClick");
  };

  return (
    <View className="gap-2 ml-4">
      {title && <Text className="text-white text-lg font-bold">{title}</Text>}
      <View className="min-h-[100px]">
        <FlashList
          data={data}
          renderItem={({ item, index }) => <TransactionItem item={item} index={index} handleClick={handleClick} />}
          estimatedItemSize={60}
        />
      </View>
      {!loading && data.length == 0 && (
        <Text className="text-white text-lg text-center font-bold">{emptyListMessage}</Text>
      )}
    </View>
  );
};
const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  return (
    <View className="flex-row items-center bg-[#262626] p-4 rounded-xl justify-between">
      <Text className="text-white text-lg font-bold">Transaction Item</Text>
    </View>
  );
};

export default TransactionList;
