import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ImageUplaodProps } from '@/type';
import * as Icons from 'phosphor-react-native';
import { getFilePath } from '@/services/imageServices';
import * as ImagePicker from 'expo-image-picker';
import { Image } from "react-native";


const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  placeholder = "",
  conrainerStyle,
  imageStyle
}: ImageUplaodProps) => {

  const pickImage = async () => {
    console.log("pickImage");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      //allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      console.log(result.assets[0]);
      onSelect(result.assets[0]);
    }
  };

  return (
    <View className="flex-col items-center justify-center">
      {!file && (
        <TouchableOpacity
          className="flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-5"
          onPress={pickImage}
        >
          <Icons.UploadSimple size={32} color="#e5e5e5" />
          {placeholder &&<Text className="text-gray-400 mt-2 text-center">{placeholder}</Text>}
        </TouchableOpacity>
      )}
      {
        file && (
            <View className="relative">
          <Image
            style = {{flex: 1}}
            source={getFilePath(file)}
            className="w-32 h-50 rounded-lg"
          />
          
          <TouchableOpacity
            onPress={onClear}
            className="absolute top-1 right-1"
          >
            <Icons.XCircle size={29} color="#e5e5e5" />
          </TouchableOpacity>
        </View>
        )
      }
    </View>
  );
};

export default ImageUpload;
