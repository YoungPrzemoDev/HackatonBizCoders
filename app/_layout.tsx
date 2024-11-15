import { Stack } from "expo-router";
import { useFonts } from "expo-font";
export default function RootLayout() {

  useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
  })

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ChatDetails" options={{ headerShown: false }} />
      <Stack.Screen name="Select" options={{ headerShown: false }} />
      <Stack.Screen name="Stories" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScientist" options={{ headerShown: false }} />
      <Stack.Screen name="RegisterBusinessman" options={{ headerShown: false }} />
      <Stack.Screen name="Home" options={{ headerShown: false }} />
      <Stack.Screen name="Account" options={{ headerShown: false }} />
      <Stack.Screen name="Model" options={{ headerShown: false }} />
    </Stack>
  );
}