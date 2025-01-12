import { Text, View } from "react-native";
import { Link } from 'expo-router';
import { Fab, FabLabel, FabIcon } from '@/components/ui/fab';
import Entypo from '@expo/vector-icons/Entypo'; // https://icons.expo.fyi/Index

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/pw">About</Link>
      
      <Fab>
        <Entypo name="plus" size={32} color="white" />
      </Fab>
    </View>
  );
}
