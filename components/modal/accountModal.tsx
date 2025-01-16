import { View, Text, Modal, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HStack } from '@/components/ui/hstack';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';

export interface accountInfo{
  id: number,
  account: string,
  pw: string,
  logo: string,
  note: string
};

interface AccountButtonProps{
  isShown: boolean
  setIsShown: (newState: boolean) => void;
  info: accountInfo
}

export const AccountModal = ({isShown, setIsShown, info}:AccountButtonProps) => {
  const uploadLogo = () => {
    console.log("uploading Logo");
    
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // Specify the type of files you want to allow, e.g., 'image/*', 'application/pdf'
        copyToCacheDirectory: true, // Copies the selected file to the app's cache directory
      });
      if (!result.canceled) {
        console.log('File URI:', result.assets[0].name);
        uploadLogo();
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  return (
    <Modal
      visible={isShown} 
      animationType='slide'
      transparent={true}
      onRequestClose={() => setIsShown(false)} // TODO: open confirmation card
      style={styles.modal}
    >
      <Box style={styles.mainBox}>
          <VStack style={styles.mainVStack}>


              <TouchableOpacity style={styles.close} onPress={() => setIsShown(false)}>
                <Ionicons name="arrow-back" size={50} color="white" />
              </TouchableOpacity>
              <HStack>

              <TouchableOpacity onPress={() => pickFile()}>
                <MaterialIcons name="file-upload" size={40} color="black" />
              </TouchableOpacity>
              </HStack>
              <Text>{info.id}</Text>
              <Text>{info.pw}</Text>
              <Text>{info.logo}</Text>
              <Text>{info.note}</Text>

          </VStack>
      </Box>
    </Modal>
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
    width: 250,
    height: 120
  },
  close:{
    width: 'auto',
    height: 'auto',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  }
});

export default AccountModal;