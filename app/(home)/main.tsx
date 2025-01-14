// PW screen
import { Text, View } from "react-native";
import { Link,  } from 'expo-router';
import { Fab, } from '@/components/ui/fab';
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
      <Link href="/">PW</Link>
      <Text>Main Screen</Text>
      
      <Fab onPress={() => console.log('touched')}>
        <Entypo name="plus" size={32} color="white" />
      </Fab>
    </View>
  );
}
