import { User } from "firebase/auth";
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
export type UserDataType = {
    name:string;
    image?:any;
}
export type UserType = {
    name: string | null;
    email: string | null;
    image?: any;
    uid: string;
}
export type ResponseType = {
  success: boolean;
  data?: any;
  message?: string;
}
export type AuthContextType = { 
  user: UserType | null;
  setUser: Function;
  login:(
    email: string,
    password: string
  )=>Promise<{
    success: boolean;
    msg?: string;
  }>;
  register:(
    email: string,
    password: string,
    name:string
  )=>Promise<{
    success: boolean;
    msg?: string;
  }>;
  updateUserData:(userId:string)=>Promise<void>;
};

export type WalletType = {
  id?: string;
  name: string;
  amount?: number;
  totalIncome?: number;
  totalExpenses?: number;
  image: any;
  uid?: string;
  created?: string;
}

export type ImageUplaodProps = {
  file?: any;
  onSelect: (file: any) => void;
  onClear?: () => void;
  conrainerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder?: string;
}

