import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Text } from "@react-navigation/elements";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import index from "@/app";
import { useIsFocused } from "@react-navigation/native";
import * as Icons from "react-native-feather";
import { MaterialIcons } from "@expo/vector-icons";
import { JSX } from "react";

export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const colors = {
    primary: "#2ecc71",
    text: "white",

    card: "#bdc3c7",
  };
  const tabbarIcons: Record<string, (isFocused: boolean) => JSX.Element> = {
  home: (isFocused) => (
    <MaterialIcons
      name="home"
      size={26}
      color={isFocused ? colors.primary : colors.text}
    />
  ),
  profile: (isFocused) => (
    <MaterialIcons
      name="person"
      size={26}
      color={isFocused ? colors.primary : colors.text}
    />
  ),
  wallet: (isFocused) => (
    <MaterialIcons
      name="account-balance-wallet"
      size={26}
      color={isFocused ? colors.primary : colors.text}
    />
  ),
  statistics: (isFocused) => (
    <MaterialIcons
      name="bar-chart"
      size={26}
      color={isFocused ? colors.primary : colors.text}
    />
  ),
};

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabItem, isFocused && styles.focusedTab]}
          >
            { 
              tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)
            }
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS === "ios" ? 70 : 55,
    backgroundColor: "#262626",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: "#404040",
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 10 : 0,
  },
  focusedTab: {
    borderTopWidth: 0,
    borderTopColor: "#2ecc71",
  },
});

