import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Timestamp, Transaction } from "firebase/firestore";
import { TransactionItemProps, TransactionListType, TransactionType } from "@/type";
import { FlashList } from "@shopify/flash-list";
import { expenseCategories, incomeCategory } from "@/config/data";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount,
        description: item?.description,
        category: item?.category,
        date: (item?.date as unknown as Timestamp)?.toDate()?.toISOString(),
        walletId: item?.walletId,
        image: item?.image,
        uid: item?.uid,
      },
    })
  };

  return (
    <View className="gap-2 ml-4">
      {title && <Text className="text-white text-lg font-bold">{title}</Text>}
      <View className="min-h-[100px]">
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={60}
        />
      </View>
      {!loading && data.length == 0 && (
        <Text className="text-white text-lg text-center font-bold">
          {emptyListMessage}
        </Text>
      )}
    </View>
  );
};
const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  let category =
    item?.type == "income" ? incomeCategory : expenseCategories[item.category!];
  const IconComponent = category.icon;

  const date = (item?.date as unknown as Timestamp)
    ?.toDate()
    ?.toLocaleDateString("en-LK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <Animatable.View
      animation="fadeInDown"
      delay={index * 80}
      duration={400}
      className="flex-row items-center bg-[#262626] mt-3 p-4 rounded-xl justify-between"
    >
      <TouchableOpacity
        className="flex-row items-center gap-4 justify-content-between"
        onPress={() => handleClick(item)}
      >
        <View
          style={{ backgroundColor: category.bgColor }}
          className="bg-[#262626] p-2 rounded-full"
        >
          <IconComponent color="white" size={25} weight="fill" />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-white text-lg font-medium">
            {category.label}
          </Text>
          <Text className="text-white text-md font-light" numberOfLines={1}>
            {item?.description}
          </Text>
        </View>
        <View>
          <Text
            className={`text-xl font-bold ${
              item?.type === "income" ? "text-green-500" : "text-red-500"
            }`}
          >
            {`${item?.type === "income" ? "+ LKR" : "- LKR"} ${item?.amount}`}
          </Text>

          <Text className="text-white text-md font-light">{date}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default TransactionList;
