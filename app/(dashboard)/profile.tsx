import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { getProfileImage } from "@/services/imageServices";
import { accountOptionType } from "@/type";
import * as Icons from "phosphor-react-native";
import { Image } from "react-native";
import * as Animatable from "react-native-animatable";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";


const ProfileScreen = () => {
  const { user } = useAuth();
  const router = useRouter();

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

   const handleLogout = async () => {
       await signOut(auth);
     };

  const showLogoutAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            handleLogout();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handlePress = async (item: accountOptionType)=>{
    if(item.title === 'Logout'){
      showLogoutAlert();
  }
  if(item.routeName){
    router.push(item.routeName);
  }
}
  return (
    <ScreenWrapper>
      <View>
        <View className="position-absolute top-2">
          <Animatable.Text 
          animation="fadeInDown"
          duration={600}
          className="text-center text-3xl mb-3 text-white text-bold">
            Profile
          </Animatable.Text>

          {/* userInfo */}
          <View className="">
            <View className="mt-5 mb-7">
              {/* userImage */}
              <Image
                source={getProfileImage(user?.image)}
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
                  {user?.name|| "Guest"}
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
          <View className="mt-9 px-3">
            {accountOptions.map((item, index) => {
              return (
                <Animatable.View
                  key={index.toString()}
                  animation="slideInRight"
              delay={index * 150}
                  className="mb-2"
                >
                  <TouchableOpacity className="flex-row items-center gap-4  rounded-xl p-2" onPress={()=> handlePress(item)}>
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
                </Animatable.View>
              );
            })}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;
