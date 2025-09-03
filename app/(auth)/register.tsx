import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    console.log("handle",email,password)
    if (isLoading) return;
    if (!email || !password || !name) {
      Alert.alert("Sign up","Please fill in all fields");
      return;
    }
    setIsLoading(true);

  };
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View>
        {/* Back Button */}
        <TouchableOpacity onPress={()=> router.back()} className="bg-gray-800 rounded-2xl p-2 ms-4 w-[55px] mt-4 items-center">
          <FontAwesome name="caret-left" size={35} color="white" className="mr-1" />
        </TouchableOpacity>

        {/* Welcome Text */}
        <View className="gap-3 mt-10">
          <Text className="text-white ms-4 font-bold text-4xl">Let's</Text>
          <Text className="text-white ms-4 font-bold text-4xl">
            Get Started
          </Text>
        </View>

        {/* Description */}
        <View className="mt-10 gap-4">
          <Text className="text-white opacity-50 ms-4 mb-2">
            Create an account to track your expenses
          </Text>

          {/* Name Input with Icon */}
          <View className="flex-row items-center border border-white rounded-2xl w-[90%] ms-4 mb-4 p-3">
            <FontAwesome
              name="user"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              className="flex-1 text-white"
            />
          </View>

          {/* Email Input with Icon */}
          <View className="flex-row items-center border border-white rounded-2xl w-[90%] ms-4 mb-4 p-3">
            <FontAwesome
              name="envelope"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              className="flex-1 text-white"
            />
          </View>

          {/* Password Input with Icon */}
          <View className="flex-row items-center border border-white rounded-2xl w-[90%] ms-4 mb-4 p-3">
            <FontAwesome
              name="lock"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="flex-1 text-white"
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="self-end me-8">
            <Text className="text-white font-semibold">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-green-500 ms-4 p-3 rounded-2xl items-center w-[90%] mt-4"
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-black font-bold text-2xl">Sign up</Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-white">Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-green-500 font-semibold ml-2">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;
