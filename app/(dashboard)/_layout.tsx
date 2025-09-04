import { View, Text, SafeAreaView, ActivityIndicator } from "react-native"
import React, { useEffect } from "react"
import { Slot, Tabs, useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"
import CustomTabs from "@/components/CustomTabs"

const DashboardLayout = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  console.log("User Data :", user)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading])

  if (loading) {
    return (
      <View className="flex-1 w-full justify-center align-items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Tabs tabBar={CustomTabs} screenOptions={{ headerShown: false }}>
        <Tabs.Screen name = "home"/>
        <Tabs.Screen name = "statistics"/>
        <Tabs.Screen name = "wallet"/>
        <Tabs.Screen name = "profile"/>
      </Tabs>
    </SafeAreaView>
  )
}

export default DashboardLayout
