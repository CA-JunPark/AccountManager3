// changePW screen
import { Text, StyleSheet, Alert } from "react-native";
import { Pressable } from "react-native";
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HStack } from '@/components/ui/hstack';
import {Avatar,AvatarImage} from "@/components/ui/avatar"

const showMessage = (msg: string) => {
  Alert.alert(
    "Error", 
    msg, 
    [
      {text: "OK"},
    ]
  );
};

export default function About() {

  const backToMain = () => {
    router.back();
  };

  return (
    <VStack style={styles.mainVStack}>
      <HStack style={styles.headerHstack}>
        <Text style={styles.header}> About </Text>
        <Button style={styles.close} onPress={() => backToMain()}>
          <Ionicons name="arrow-back" style={styles.closeIcon} size={40} color="white" />
        </Button>
      </HStack>
      
      <Text style={styles.label}> App Name: Account Manager 3 </Text>
      <Text style={styles.label}> Developer: Jun Park </Text>
      <Text style={styles.label}> Made with </Text>
      <HStack style={styles.avatarStack}>
        <VStack style={styles.avatarImageStack}>
          <Avatar>
            <AvatarImage source={{uri:'https://avatars.githubusercontent.com/u/120183344?s=200&v=4'}}></AvatarImage>
          </Avatar>
          <Avatar>
            <AvatarImage source={{uri:'https://avatars.githubusercontent.com/u/12504344?s=200&v=4'}}></AvatarImage>
          </Avatar>
          <Avatar>
            <AvatarImage source={{uri:'https://avatars.githubusercontent.com/u/108468352?s=200&v=4'}}></AvatarImage>
          </Avatar>
        </VStack>
        <VStack  style={styles.avatarLabelStack}>
          <Text style={styles.avatarLabel}> React Native Expo </Text>
          <Text style={styles.avatarLabel}> gluestack-ui </Text>
          <Text style={styles.avatarLabel}> drizzle </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  mainVStack: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#212121',
    gap: 20,
    padding:20,
    paddingTop: '20%',
  },
  headerHstack:{
    marginLeft:'35%',
    gap:40
  },
  header: {
    fontSize: 35,
    color: 'white',
    width: "auto",
  },
  label: {
    fontSize: 20,
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '55%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterText: {
    fontSize: 20,
  },
  close: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    marginTop: -3,
  },
  avatarStack:{
    width: '70%',
    justifyContent: 'flex-start',
  },
  avatarImageStack:{
    justifyContent: 'center',
    alignItems:'center',
    gap:20
  },
  avatarLabelStack:{
    justifyContent:'center',
    alignItems:'center',
    gap:40
  },
  avatarLabel:{
    fontSize: 20,
    color: 'white', 
  }
});