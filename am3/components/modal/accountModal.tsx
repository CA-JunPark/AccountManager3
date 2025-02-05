import { Text, Modal, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useEffect, useRef, useState, memo } from 'react'
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HStack } from '@/components/ui/hstack';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import { Avatar, AvatarFallbackText, AvatarImage} from '@/components/ui/avatar';
import {Button,ButtonText} from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { useSQLiteContext } from "expo-sqlite"; // https://www.youtube.com/watch?v=AT5asDD3u_A
import { drizzle, ExpoSQLiteDatabase} from 'drizzle-orm/expo-sqlite'; // https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0311#live-queries-
import * as schema from '@/db/schema';
import { accounts } from '@/db/schema';
import { eq, max } from "drizzle-orm";
import api from '@/components/apis/api';
import { sql } from 'drizzle-orm'
import * as FileSystem from 'expo-file-system';
import { LogoBubble, convertBase64toPngURI } from '@/components/common/Logo';

export interface accountInfo{
  id: number,
  title: string,
  account: string,
  pw: string,
  logo: string,
  note: string
};

interface AccountButtonProps {
  isShown: boolean;
  setIsShown: (newState: boolean) => void;
  info: accountInfo;
  isAdding: boolean;
  drizzleDB: ExpoSQLiteDatabase<typeof schema> ;
}

export const AccountModal = ({isShown, setIsShown, info, isAdding, drizzleDB}: AccountButtonProps) => {
  const [currentID, setCurrentID] = useState(info.id);
  const [currentTitle, setCurrentTitle] = useState(info.title);
  const [currentAccount, setCurrentAccount] = useState(info.account);
  const [currentPw, setCurrentPw] = useState(info.pw);
  const [currentLogo, setCurrentLogo] = useState(info.logo);
  const [currentNote, setCurrentNote] = useState(info.note);
  const [logoUri, setLogoUri] = useState("");
  
  useEffect(() => {
    if (info){
      if (info.id === 0){
        (async () => {
          const newID = await getNewMaxID();
          setCurrentID(newID);
        })();
      }
      else{
        setCurrentID(info.id);
      };
      setCurrentTitle(info.title);
      setCurrentAccount(info.account);
      setCurrentPw(info.pw);
      setCurrentLogo(info.logo);
      setCurrentNote(info.note);
    }
  }, [info]);

  const createLogoUri = async () => {
      const uri = await convertBase64toPngURI(info.logo, info.id);
      setLogoUri(uri);
    };

  useEffect(() => {
    if (info.logo === "@/assets/images/react-logo.png"){
      setLogoUri("@/assets/images/react-logo.png");
    }
    else{
      createLogoUri();
    };
  }, [currentLogo]);
  

  const closeModal = () => {
    setIsShown(false);
  };

  const uploadLogo = (base64Image: string) => {
    setCurrentLogo(base64Image);
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', 
        copyToCacheDirectory: true, 
      });
      if (!result.canceled) {
        const fileUri = result.assets[0].uri;

        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists && fileInfo.size && fileInfo.size > 400 * 1024) { // 409,600 bytes
          Alert.alert("Error", "File size exceeds 400KB. Please choose a smaller file.");
          return;
        }
        const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
        uploadLogo(base64);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const deleteAccount = async() => {
    try {
      await drizzleDB.delete(accounts).where(eq(accounts.id, info.id));
      const response = await api.delete(`/ddb/deleteAccount/${info.id}/`);
      Alert.alert(
        "Success",
        "Account deleted successfully!",
        [{ text: "OK", onPress: () =>  closeModal()}]
      );
    } catch (error: any) {
      const errorMessage = 
        error?.response?.data?.detail || // From Django API
        error.message ||                 // General error message
        "An unknown error occurred";     // Fallback message
      Alert.alert(
        "Error", 
        `Fail to Delete: ${errorMessage}`, 
        [
          {text: "OK"},
        ]
      );
    }
  };

  const clickDeleteAccount = () => {
    Alert.alert(
      "Delete", 
      "Delete Confirm", 
      [
        {text: "Cancel"},
        {text: "OK", onPress: async() => await deleteAccount()},
      ]
    );
  };

  const resetInfo = () => {
    setCurrentTitle(info.title);
    setCurrentAccount(info.account);
    setCurrentPw(info.pw);
    setCurrentNote(info.note)
    console.log("reset id =", info.id);
  };

  const saveAccount = async() => {
    const updatedAccount = {
      targetID: currentID,
      title: currentTitle,
      account: currentAccount,
      pw: currentPw,
      logo: currentLogo,
      note: currentNote,
    }
    try {
      await drizzleDB.update(accounts).
        set({ title: currentTitle, 
              account: currentAccount, 
              pw: currentPw,
              logo: currentLogo, 
              note: currentNote}).
        where(eq(accounts.id, info.id));
      
      await api.put("/ddb/account/", { account: updatedAccount })
        
      Alert.alert(
        "Success",
        `${currentTitle} saved successfully!`,
        [{ text: "OK", onPress: () =>  closeModal()}]
      );
    } catch (error: any) {
      Alert.alert(
        "Error", 
        error.message, 
        [
          {text: "OK"},
        ]
      );
    }
  };

  const clickSaveAccount = () => {
    Alert.alert(
      "Save", 
      `Save ${currentTitle}`, 
      [
        {text: "Cancel"},
        {text: "OK", onPress: async() => await saveAccount()},
      ]
    );
  }

  const getNewMaxID = async() => {
    const maxIdResult = await drizzleDB.select().from(accounts).orderBy(sql`${accounts.id} desc`).limit(1);
    const newID = maxIdResult[0].id + 1;
    return newID;
  };

  const addAccount = async() => {
    try {
      const newID = await getNewMaxID();
      console.log(newID);

      const newAccount = {
        title: currentTitle,
        account: currentAccount,
        pw: currentPw,
        logo: currentLogo,
        note: currentNote,
        id: newID,
      }
      
      await drizzleDB.insert(accounts).values(newAccount)
      await api.post("/ddb/account/", { account: newAccount });

      Alert.alert(
        "Added", 
        `New Account ${currentTitle} is added`, 
        [
          {text: "OK", onPress: () => closeModal()},
        ]
      );
      
    } catch (error) {
      console.error("Insertion error:", error);
      Alert.alert(
        "Error", 
        `Fail adding ${currentTitle}`, 
        [
          {text: "OK"},
        ]
      );
    }
  };

  const clickAddAccount = () => {
    Alert.alert(
      "Add", 
      `Add ${currentTitle}`, 
      [
        {text: "Cancel"},
        {text: "OK", onPress: async() => await addAccount()},
      ]
    );
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
                  <Text style={styles.headerText}> {isAdding ? 'Add Account' : 'Account'} </Text>
                  <Button style={styles.close} onPress={() => closeModal()}>
                      <Ionicons name="arrow-back" size={40} color="white" />
                  </Button>
              </HStack>

              <HStack style={styles.logoHStack}>
                <Avatar size="xl">
                  <LogoBubble title={info.title} logo={logoUri} />
                </Avatar>
                <Box style={{justifyContent:'center'}}>
                    <Button size='lg' style={styles.uploadBtn} onPress={() => pickFile()}>
                      <MaterialIcons name="file-upload" size={40} color="white" />
                      <ButtonText> Upload </ButtonText>
                    </Button>
                </Box>
              </HStack>

              <CustomInputField title="Title" content={info.title} isNote={false} inputState={currentTitle} setInput={setCurrentTitle}/>
              <CustomInputField title="Account" content={info.account} isNote={false} inputState={currentAccount} setInput={setCurrentAccount}/>
              <CustomInputField title="PW" content={info.pw} isNote={false} inputState={currentPw} setInput={setCurrentPw}/>
              <CustomInputField title="Note" content={info.note} isNote={true} inputState={currentNote} setInput={setCurrentNote}/>

              {!isAdding ? (
                <HStack style={styles.bottomHStack}>
                  <Button size="md" style={styles.bottomBtn}
                    onPress={() => clickDeleteAccount()}
                  >
                    <Text style={styles.bottomBtnText}> Delete </Text>
                  </Button>
                  <Button onPress={() => resetInfo()}>
                    <Ionicons name="refresh" size={24} color="white" />
                  </Button>
                  <Button size="md" style={styles.bottomBtn}
                    onPress={() => clickSaveAccount()}
                  >
                    <Text style={styles.bottomBtnText}> Save </Text>
                  </Button>
                </HStack>
              ): (
                <HStack style={styles.bottomHStack}>
                  <Button onPress={() => resetInfo()}>
                    <Ionicons name="refresh" size={24} color="white" />
                  </Button>
                  <Button size="md" style={styles.bottomBtn}
                    onPress={() => clickAddAccount()}
                  >
                    <Text style={styles.bottomBtnText}> Add </Text>
                  </Button>
                </HStack>
              )}
            </VStack>
        </Box>
      </Modal>
    </KeyboardAvoidingView>
  )
}

interface CustomInputFieldInterface{
  title: string;
  content: string;
  isNote: boolean;
  inputState: string;
  setInput: (value: string) => void;
};

const CustomInputField = memo( ( { title, content, isNote, inputState, setInput } :CustomInputFieldInterface ) => {
  const fieldWidth = 240;

  const trim = (text:string) => {
    setInput(inputState.trim())
  };
  
  return (
    <Box>
      <VStack style={{justifyContent:'flex-end', alignContent: 'center'}}>
        <Text style={{ fontSize: 12, textAlign: 'left', color:'white'}}> {title}: </Text>
        {!isNote ? (
          <Input style={{ width: fieldWidth}}>
            <InputField style={{color:'white'}} selectionColor="#FF5733"
              defaultValue={content} value={inputState} 
              onChangeText={(text:string) => setInput(text)}
              onBlur={() => trim(inputState)}
            /> 
          </Input>
        ) : (
          <Textarea style={{width: fieldWidth, height:200}}>
            <TextareaInput style={{textAlignVertical: 'top', color:'white'}}  selectionColor="#FF5733"
              defaultValue={content} value={inputState}
              onChangeText={(text:string) => setInput(text)}
              onBlur={() => trim(inputState)}
            />
          </Textarea>
        )}
      </VStack>
    </Box>
  );
});

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
  close:{
    width: 'auto',
    height: 'auto',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  logoHStack:{
    justifyContent: 'center',
    alignContent: 'center',
    gap:20,
  },
  uploadBtn:{
    width: 130,
  },
  bottomHStack:{
    justifyContent: 'center',
    alignContent: 'center',
    gap: 10,
  },
  bottomBtn:{
    width: 100
  },
  bottomBtnText:{
    fontSize:20, 
    color:'white'
  }
});

export default AccountModal;