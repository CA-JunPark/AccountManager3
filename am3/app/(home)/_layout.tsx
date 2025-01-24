import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false, animation: "none"}}/>
      <Stack.Screen name="main" options={{headerShown: false, animation: "none"}}/>
      <Stack.Screen name="changePW" options={{headerShown: false, animation: "none"}}/>
    </Stack> 
  )
}
