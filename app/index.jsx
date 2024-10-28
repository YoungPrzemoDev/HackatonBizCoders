import { Link, Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Redirect href={'/Home'}/>
    </View>
  );
}

