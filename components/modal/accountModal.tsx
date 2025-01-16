import { View, Text, Modal, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';

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
              <Text>Hello</Text>
              <TouchableOpacity style={styles.close} onPress={() => setIsShown(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
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
    padding: 35,
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
    borderWidth: 1,
    borderColor: 'red',
    width: 250,
    height: 120
  },
  close:{
    borderWidth: 1,
  }
});

export default AccountModal;