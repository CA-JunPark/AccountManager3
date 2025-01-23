import { View, Text, KeyboardAvoidingView, Modal, StyleSheet } from 'react-native'
import React from 'react'
import {Button,ButtonText} from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HStack } from '@/components/ui/hstack';
import api from '@/components/apis/api';

const changePW = async(pw: string, newPw: string, confirm: string) =>{
  try{
    const response = await api.put("/ddb/changePW/", {pw:pw, newPw: newPw, confirm: confirm})

    return response.data;
  }
  catch (error){
    console.error('Error updating profile:', error);
    return "change pw fail";
  };
};

interface SettingModalProps{
    isShown: boolean;
    setIsShown: (newState: boolean) => void;
} 

const SettingModal = ({isShown, setIsShown} : SettingModalProps) => {
    const closeModal = () => {
      setIsShown(false);
    };

    const clickSync = () => {
      console.log("click Sync");
    };

    const clickSecretMode = () => {
      console.log("click Secret Mode");
    };

    const clickChangePW = async() => {
      console.log("click Change PW");
      const result = await changePW("qwe", "asd", "asd");
      console.log(result);
    };

    const clickAbout = () => {
      console.log("click About");
    };

    const clickGitHubLink = () => {
      console.log("click GitHub Link");
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