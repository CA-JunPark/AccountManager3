import { Text, KeyboardAvoidingView, Modal, StyleSheet, Alert, Linking } from 'react-native'
import React from 'react'
import {Button,ButtonText} from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HStack } from '@/components/ui/hstack';
import api from '@/components/apis/api';
import { router } from 'expo-router';
import { useSQLiteContext } from "expo-sqlite"; // https://www.youtube.com/watch?v=AT5asDD3u_A
import { drizzle} from 'drizzle-orm/expo-sqlite'; // https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0311#live-queries-
import * as schema from '@/db/schema';
import { accounts } from '@/db/schema';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface SettingModalProps{
    isShown: boolean;
    setIsShown: (newState: boolean) => void;
    isSecretMode: boolean;
    setIsSecretMode: (newState: boolean) => void;
} 

const SettingModal = ({isShown, setIsShown, isSecretMode, setIsSecretMode} : SettingModalProps) => {
  const db = useSQLiteContext();
  const drizzleDB = drizzle(db, { schema })

  const sync = async() => {
    // load all the accounts in the cloud 
    try {
      const jsonResponse = await api.get("/ddb/getAll/")
      console.log(`Number of accounts fetched: ${jsonResponse.data.length}`);

      for (const account of jsonResponse.data) {
        if (account.logo === ""){
          account.logo = "@/assets/images/react-logo.png";
        };
        await drizzleDB.insert(accounts).values(account).onConflictDoNothing();
      };
      Alert.alert(
        "Sync", 
        "Sync Success", 
        [
          {text: "OK"},
        ]
      );

      // close setting
      closeModal()
    } catch (error: any) {
      Alert.alert(
        "Error", 
        error.response.data.detail, 
        [
          {text: "OK"},
        ]
      );
    }
    return;
  };

  const closeModal = () => {
    setIsShown(false);
  };

  const clickSync = async() => {
    Alert.alert(
      "Sync", 
      "Sync with Cloud Database?", 
      [
        {text: "Cancel"},
        {text: "OK", onPress: () => sync()},
      ]
    );
  };

  const clickSecretMode = () => {
    setIsSecretMode(!isSecretMode)
  };

  const clickChangePW = async() => {
    setIsShown(false);
    router.push("/changePW");
  };

  const clickAbout = () => {
    console.log("click About");
  };

  const clickGitHubLink = async() => {
    await Linking.openURL("https://github.com/CA-JunPark");
  };
  

  return (
  <KeyboardAvoidingView>
    <Modal
      visible={isShown}
      animationType='slide'
      transparent={true}
      onRequestClose={() => setIsShown(false)}
      style={styles.modal}
    >
      <Box style={styles.mainBox}>
        <VStack style={styles.mainVStack}>
            <HStack style={styles.header}>
                <Text style={styles.headerText}> Settings </Text>
                <Button style={styles.close} onPress={() => closeModal()}>
                    <Ionicons name="arrow-back" size={40} color="white" />
                </Button>
            </HStack>

            <VStack style={styles.buttonVStack}>
                <Button onPress={clickSync} style={styles.button}>
                    <ButtonText style={styles.text}> Sync </ButtonText>
                </Button>

                <Button onPress={clickSecretMode} style={styles.button}>
                  {isSecretMode ? (
                    <MaterialIcons name="check-box" size={24} color="white" />
                  ) : (
                    <MaterialIcons name="check-box-outline-blank" size={24} color="white" />
                  )}
                  <ButtonText style={styles.text}> Secret Mode </ButtonText>
                </Button>
                
                <Button onPress={clickChangePW} style={styles.button}>
                    <ButtonText style={styles.text}> Change PW </ButtonText>
                </Button>

                <Button onPress={clickAbout} style={styles.button}>
                    <ButtonText style={styles.text}> About </ButtonText>
                </Button>

                <Button onPress={clickGitHubLink} style={styles.button}>
                    <ButtonText style={styles.text}> GitHub Link </ButtonText>
                </Button>
            </VStack>
        </VStack>
      </Box>
    </Modal>
  </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  modal:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainBox: {
    flex: 1,
    margin: 20,
    backgroundColor: '#4F4F4F',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  mainVStack:{
    width: "90%",
    justifyContent:'center',
    alignContent: 'center',
    gap: 10,
  },
  header:{
    width: 'auto',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  headerText:{
    textAlign:'center',
    fontSize: 30,
    color: 'white',
  },
  buttonVStack:{
    justifyContent: 'center',
    gap:25
  },
  close:{
    width: 'auto',
    height: 'auto',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  button:{
    height:80
  },
  text:{
    fontSize: 20
  },
});

export default SettingModal 