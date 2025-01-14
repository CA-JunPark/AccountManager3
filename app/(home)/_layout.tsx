import { Stack } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, View } from 'react-native';


export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false, animation: "none"}}/>
      <Stack.Screen name="main" options={{headerShown: false, animation: "none"}}/>
    </Stack> 
  )
}
