import { View, Text } from "react-native"
import React from "react"
import { useAuth } from "@/context/AuthContext";

const HomeScreen = () => {

  const {user} = useAuth();

  return (
    <View className="flex-1 w-full justify-center align-items-center">
      <Text className="text-center text-4xl">Home screen</Text>
    </View>
  )
}

export default HomeScreen
