import { View, Text, Modal, StyleSheet, Pressable, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
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

export interface accountInfo{
  id: number,
  title: string,
  account: string,
  pw: string,
  logo: string,
  note: string
};

interface AccountButtonProps{
  isShown: boolean;
  setIsShown: (newState: boolean) => void;
  info: accountInfo;
  isAdding: boolean;
}

export const AccountModal = ({isShown, setIsShown, info, isAdding}: AccountButtonProps) => {
  const [currentTitle, setCurrentTitle] = useState(info.title);
  const [currentAccount, setCurrentAccount] = useState(info.account);
  const [currentPw, setCurrentPw] = useState(info.pw);
  const [currentNote, setCurrentNote] = useState(info.note);

  useEffect(() => {
    if (info){
      setCurrentTitle(info.title);
      setCurrentAccount(info.account);
      setCurrentPw(info.pw);
      setCurrentNote(info.note);
    }
  }, [info]);

  const closeModal = () => {
    setIsShown(false);
  };

  const uploadLogo = () => {
    console.log("uploading Logo");
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', 
        copyToCacheDirectory: true, 
      });
      if (!result.canceled) {
        console.log('File URI:', result.assets[0].name);
        uploadLogo();
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const deleteAccount = () => {
    console.log("Delete id =", info.id);
  };

  const resetTexts = () => {
    setCurrentTitle(info.title);
    setCurrentAccount(info.account);
    setCurrentPw(info.pw);
    setCurrentNote(info.note)
    console.log("reset id =", info.id);
  };

  const saveAccount = () => {
    console.log("Save id =", info.id);
  }

  const addAccount = () => {

  };

  return (
    <KeyboardAvoidingView>
      <Modal
        visible={isShown} 
        animationType='slide'
        transparent={true}
        onRequestClose={() => setIsShown(false)} // TODO: open confirmation card
        style={styles.modal}
      >
        <Box style={styles.mainBox}>
            <VStack style={styles.mainVStack}>
              <TouchableOpacity style={styles.close} onPress={() => closeModal()}>
                <Ionicons name="arrow-back" size={40} color="white" />
              </TouchableOpacity>

              <HStack style={styles.logoHStack}>
                <Avatar size="2xl">
                  <AvatarFallbackText size="md">{info.account}</AvatarFallbackText> 
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
                    onPress={() => deleteAccount()}
                  >
                    <Text style={styles.bottomBtnText}> Delete </Text>
                  </Button>
                  <Button onPress={() => resetTexts()}>
                    <Ionicons name="refresh" size={24} color="white" />
                  </Button>
                  <Button size="md" style={styles.bottomBtn}
                    onPress={() => saveAccount()}
                  >
                    <Text style={styles.bottomBtnText}> Save </Text>
                  </Button>
                </HStack>
              ): (
                <HStack style={styles.bottomHStack}>
                  <Button onPress={() => resetTexts()}>
                    <Ionicons name="refresh" size={24} color="white" />
                  </Button>
                  <Button size="md" style={styles.bottomBtn}
                    onPress={() => addAccount()}
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

// Todo Trim strings
const CustomInputField = ({ title, content, isNote, inputState, setInput } :CustomInputFieldInterface) => {
  const fieldWidth = 240;
  
  return (
    <Box>
      <VStack style={{justifyContent:'flex-end', alignContent: 'center'}}>
        <Text style={{ fontSize: 12, textAlign: 'left', color:'white'}}> {title}: </Text>
        {!isNote ? (
          <Input style={{ width: fieldWidth}}>
            <InputField style={{ color:'white'}} selectionColor="#FF5733"
              defaultValue={content} value={inputState} 
              onChangeText={setInput}
            /> 
          </Input>
        ) : (
          <Textarea style={{width: fieldWidth, height:200}}>
            <TextareaInput style={{textAlignVertical: 'top', color:'white'}}  selectionColor="#FF5733"
              defaultValue={content} value={inputState}
              onChangeText={setInput}
            />
          </Textarea>
        )}
      </VStack>
    </Box>
  );
};

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