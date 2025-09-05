import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import * as Animatable from "react-native-animatable";
import * as Icons from "phosphor-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getProfileImage } from "@/services/imageServices";

const ProfileModal = () => {
  return (
    <View className="flex-1 bg-black">
      {/* Animated Modal Body */}
      <Animatable.View
        animation="slideInUp"
        duration={500}
        easing="ease-out-cubic"
        className="flex-1 bg-[#262626] mt-10 border-t rounded-t-3xl p-5 shadow-lg"
      >
        {/* Header */}
        <View className="flex-row items-center justify-center mb-6 relative top-8">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-1 bg-gray-600 rounded-2xl p-2  w-[45px]  items-center"
          >
            <FontAwesome
              name="caret-left"
              size={28}
              color="white"
              className="mr-1"
            />
          </TouchableOpacity>

          {/* Title */}
          <Animatable.Text
            animation="fadeInDown"
            duration={600}
            className="text-xl font-bold text-white"
          >
            Update Profile
          </Animatable.Text>
        </View>

        <View className="mt-5 mb-7">
          {/* userImage */}
          <Image
            source={getProfileImage(null)}
            className="w-[100px] h-[100px] rounded-full mx-auto bg-white "
            style={{ width: 100, height: 100 }}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => console.log("Edit pressed")}
            className="bg-gray-200 rounded-full"
          >
            <Icons.Pencil size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* Name */}
        <ScrollView>
          <Animatable.View
            animation="fadeInUp"
            delay={200}
            className="mb-4 mt-20"
          >
            <Text className="text-gray-300 mb-2">Name</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#6b7280"
              className="bg-[#1e1e1e] text-white rounded-xl p-3"
              defaultValue="John Doe"
            />
          </Animatable.View>

          {/* Email */}
          <Animatable.View animation="fadeInUp" delay={400} className="mb-4">
            <Text className="text-gray-300 mb-2">Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#6b7280"
              className="bg-[#1e1e1e] text-white rounded-xl p-3"
              defaultValue="johndoe@example.com"
            />
          </Animatable.View>
        </ScrollView>

        {/* Save Button */}
        <Animatable.View animation="bounceIn" delay={600}>
          <TouchableOpacity
            className="bg-green-500 p-4 rounded-2xl mt-6 shadow-md"
            activeOpacity={0.8}
          >
            <Text className="text-center text-white font-semibold text-base">
              Save Changes
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};

export default ProfileModal;
