import { StyleSheet, Text, View } from 'react-native'
import React, { use, useEffect } from 'react'
import { Image } from 'react-native';
import { useRouter } from 'expo-router';

const index = () => {
    const router = useRouter();
    useEffect(() => {
      setTimeout(() => {
        router.replace("/(auth)/welcome");
      }, 2000);
    })

  return (
    <View style={styles.container}>
      <Image
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
        source={require('../assets/images/money.png')}
       />
       {/* <Text className='text-red-500 text-2xl font-bold'>Spend-Wise</Text> */}
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
})