import { ViewStyle } from "react-native";

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
};
export type accountOptionType = {
    title: string;
    icon: React.ReactNode;
    bgColor: string;
    routeName: any;
}