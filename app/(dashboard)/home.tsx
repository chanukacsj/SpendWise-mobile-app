import { View, Text } from "react-native"
import React from "react"
import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "@/components/ScreenWrapper";

const HomeScreen = () => {

  const {user} = useAuth();

  return (
    <ScreenWrapper>
      <Text className="text-center text-4xl">Home screen</Text>
    </ScreenWrapper>
  )
}

export default HomeScreen
