import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import * as Icons from "phosphor-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getProfileImage } from "@/services/imageServices";
import { UserDataType } from "@/type";
import { useAuth } from "@/context/AuthContext";
import {uploadImageAndUpdateProfile } from "@/services/authService";
import * as ImagePicker from 'expo-image-picker';
import { updateUser } from "@/services/userService";
import {updateUserProfile} from "@/services/authService";
import { User } from "firebase/auth";

const ProfileModal = () => {

  const {user, updateUserData} = useAuth();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setUserData({
     name:user?.name || "",
     image:user?.image || null
    });
  
}, [user]);

const OnPickImage = async () => {
  console.log("OnPickImage");
  let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
     // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });


    if (!result.canceled) {
      setUserData({...userData,image: result.assets[0]});
    }
  };


  const onSubmit = async () => {

    let {name,image} = userData;
    if(!name.trim){
      Alert.alert("User","Please fill in the name field");
      return;
    }

    console.log("hee")

    setLoading(true);
    const res = await updateUser(user?.uid as string,userData);
    setLoading(false);
    if(res.success){
      updateUserData(user?.uid as string);
      console.log("updated",userData.name);
      Alert.alert("User","Profile updated successfully");
      router.back();
    }else{
      Alert.alert("User","Something went wrong");
    }
  };

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

        <View className="mt-5 mb-7 relative w-[100px] h-[100px] mx-auto">
          {/* userImage */}
          <Image
            source={getProfileImage(userData.image)}
            className="w-full h-full rounded-full bg-white"
            resizeMode="cover"
          />

          {/* Pencil Icon */}
          <TouchableOpacity
            onPress={() => OnPickImage()}
            className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center absolute bottom-0 right-0"
          >
            <Icons.Pencil size={20} color="black" />
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
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </Animatable.View>

          {/* Email */}
          {/* <Animatable.View animation="fadeInUp" delay={400} className="mb-4">
            <Text className="text-gray-300 mb-2">Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#6b7280"
              className="bg-[#1e1e1e] text-white rounded-xl p-3"
              defaultValue="johndoe@example.com"
            />
          </Animatable.View> */}
        </ScrollView>

        {/* Save Button */}
        <Animatable.View animation="bounceIn" delay={600}>
          <TouchableOpacity
            className={`p-4 rounded-2xl mt-6 shadow-md ${
              loading ? "bg-gray-400" : "bg-green-500"
            }`}
            activeOpacity={0.8}
            disabled={loading}
            onPress={onSubmit}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-center text-white font-semibold text-base">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};

export default ProfileModal;
