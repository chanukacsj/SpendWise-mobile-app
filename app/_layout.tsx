import { View, Text } from "react-native"
import React from "react"
import { Slot, Stack } from "expo-router"
import "./../global.css"
import { AuthProvider } from "@/context/AuthContext"
import { LoaderProvider } from "@/context/LoaderContext"


const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(modals)\profileModal"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  )
}

const RootLayout = () => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout
