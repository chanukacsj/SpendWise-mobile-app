import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { getProfileImage } from "@/services/imageServices";
import { accountOptionType } from "@/type";
import * as Icons from "phosphor-react-native";
import { Image } from "react-native";

const ProfileScreen = () => {
  const { user } = useAuth();
  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Icons.User size={24} color="white" />,
      bgColor: "#6366f1",
      routeName: "/(modals)/profileModal",
    },
    {
      title: "Settings",
      icon: <Icons.GearSix size={24} color="white" />,
      bgColor: "#059669",
      routeName: "/(modals)/settingsModal",
    },
    {
      title: "Privacy Policy",
      icon: <Icons.Lock size={24} color="white" />,
      bgColor: "#525252",
      routeName: "/(modals)/privacyModal",
    },
    {
      title: "Logout",
      icon: <Icons.Power size={24} color="white" />,
      bgColor: "#e11d48",
      routeName: "/login",
    },
  ];
  return (
    <ScreenWrapper>
      <View>
      <View className="position-absolute top-2">
        <Text className="text-center text-3xl mb-3 text-white text-bold">
          Profile
        </Text>

        {/* userInfo */}
        <View className="">
          <View className="mt-5 mb-7">
            {/* userImage */}
            <Image
              source={getProfileImage(user?.photoURL)}
              className="w-[100px] h-[100px] rounded-full mx-auto bg-white "
                style={{ width: 100, height: 100 }}

                resizeMode="cover"

            />
          </View>
          <View className="mb-6">
            {/* userName and email */}
            <View>
              <Text
                className=" text-center font-bold"
                style={{ fontSize: 24, color: "#fafafa" }}
              >
                {auth.currentUser?.displayName || "Guest"}
              </Text>
              <Text
                className=" font-light text-center"
                style={{ fontSize: 15, color: "#a3a3a3" }}
              >
                {user?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Options */}
        <View className="mt-9">
          {accountOptions.map((item, index) => {
            return (
              <View key={index} className="mb-2">
                <TouchableOpacity className="flex-row items-center gap-4  rounded-xl p-2">
                  {/* Icon container */}
                  <View
                    className="items-center justify-center rounded-lg w-[35px] h-[35px]"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    {item.icon && item.icon}
                  </View>

                  {/* Label or text area */}
                  <Text className="text-white flex-1 font-medium text-base ">
                    {item.title}
                  </Text>
                  <Icons.CaretRight size={24} color="white" weight="bold" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;
