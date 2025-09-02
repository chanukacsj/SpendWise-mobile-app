import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import * as Animatable from "react-native-animatable";

const Welcome = () => {
  return (
    <ScreenWrapper>
      <View className="flex-1 bg-[#171717] justify-center items-center pt-2">
        {/* Sign in button */}
        <Animatable.View animation="fadeInDown" duration={1000} className="absolute top-0 right-4">
          <TouchableOpacity>
            <Text className="text-white text-center font-bold">Sign in</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Welcome Image */}
        <Animatable.Image
          animation="fadeInUp"
          delay={500}
          duration={1200}
          resizeMode="contain"
          className="w-[350px] h-[220px] relative bottom-[75px]"
          source={require("../../assets/images/5275.png")}
        />

        {/* Footer */}
        <Animatable.View
          animation="fadeInUp"
          delay={1000}
          duration={1500}
          className="absolute bottom-0 w-full bg-neutral-900 items-center pt-[25px] pb-[25px] gap-5"
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: -0.25 },
            shadowOpacity: 0.25,
            shadowRadius: 30,
            elevation: 10,
          }}
        >
          <View className="items-center">
            <Text className="text-white text-center font-bold text-3xl">
              Always take control
            </Text>
            <Text className="text-white text-center font-bold text-3xl">
              of your finances
            </Text>
          </View>

          <View className="items-center gap-2">
            <Text className="text-gray-300 text-center text-1xl">
              Managing your finances effectively today ensures a better
            </Text>
            <Text className="text-gray-300 text-center text-1xl">
              lifestyle in the future.
            </Text>
          </View>

          <Animatable.View animation="pulse" iterationCount="infinite" delay={1500}>
            <TouchableOpacity className="bg-green-500 items-center w-[300px] py-3 pt-3 mt-1 px-10 rounded-full">
              <Text className="text-black font-bold text-2xl">Get Started</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;
