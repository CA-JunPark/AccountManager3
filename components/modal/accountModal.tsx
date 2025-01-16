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
    >
      <VStack style={styles.main}>
          <Text>Hello</Text>
          <TouchableOpacity style={styles.close} onPress={() => setIsShown(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
          <Text>{info.id}</Text>
          <Text>{info.pw}</Text>
          <Text>{info.logo}</Text>
          <Text>{info.note}</Text>
      </VStack>
    </Modal>
  )
}

const styles = StyleSheet.create({
  main:{
    justifyContent: 'center',
    alignContent: 'center',
  },
  close:{
    borderWidth: 1,
  }
});

export default AccountModal;