// Main screen
import { Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform} from "react-native";
import { Link } from 'expo-router';
import { Fab, } from '@/components/ui/fab';
import Entypo from '@expo/vector-icons/Entypo'; // https://icons.expo.fyi/Index
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Input, InputField} from '@/components/ui/input';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Avatar, AvatarFallbackText, AvatarImage} from '@/components/ui/avatar';
import { SafeAreaView } from "react-native-safe-area-context";
import AccountModal, { accountInfo } from "@/components/modal/accountModal";

// TODO change it to real data later EXpo SQLite
const generateAccounts = (num: number): accountInfo[] => {
  return Array.from({ length: num }, (_, i) => ({
    id: i + 1,
    title: `title${i + 1}`,
    account: `User${i + 1}`,
    pw: `password${i + 1}`,
    logo: `logo${i + 1}`,
    note: `note${i + 1}`,
  }));
};

const accounts = generateAccounts(100);

const defaultAccountInfo: accountInfo = {
  id: 0,
  title: '',
  account: '',
  pw: '',
  logo: '',
  note: ''
};

export default function Main() {
  const [isArrowUp, setIsArrowUp] = useState(true);
  const [sortedAccounts, setSortedAccounts] = useState([...accounts]);
  const searchTextRef = useRef("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedAccountInfo, setSelectedAccountInfo] = useState(defaultAccountInfo);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    sortButtons()
  }, []);

  const clickSetting = () => {
    console.log('clicked setting');
  };

  const sortButtons = () => {
    const sorted = [...accounts].sort((a, b) => {
      if (isArrowUp) {
        return a.account.localeCompare(b.account);
      } else {
        return b.account.localeCompare(a.account);
      }
    });
    setSortedAccounts(sorted);
  };

  const clickSort = () => {
    setIsArrowUp(!isArrowUp);
    sortButtons();
  };

  const handleTextChange = (value: string) => {
    searchTextRef.current = value;
  };

  const clickSearch = () => {
    console.log('search text: ', searchTextRef.current);
  };

  const clickAdd = () => {
    setIsAdding(true)
    setSelectedAccountInfo(defaultAccountInfo)
    setModalVisibility(true)
    // get max id

    // 
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <VStack style={styles.mainVStack}>
        <SafeAreaView>
          <HStack style={styles.topBar}>

            <TouchableOpacity onPress={() => clickSetting()} style={styles.iconButtons}>
              <Ionicons name="settings-outline" size={30} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => clickSort()} style={styles.iconButtons}>
              <Ionicons name={isArrowUp ? "arrow-up" : "arrow-down"} size={30} color="black" />
            </TouchableOpacity>

            <Input size="xl" variant="rounded" isInvalid={false} style={styles.input}>
              <InputField
                style={styles.inputFiled} textAlign="center"
                selectionColor="#FF5733"
                onChangeText={(value) => handleTextChange(value)}/>
            </Input>

            <TouchableOpacity onPress={clickSearch} style={styles.iconButtons}>
              <FontAwesome name="search" size={24} color="black" />
            </TouchableOpacity>

          </HStack>
        </SafeAreaView>

        <ScrollView style={styles.scrollView}>
          {sortedAccounts.map((account) => (
            <AccountButton 
              key={account.id} 
              selectedAccountInfo={account} 
              setSelectedAccountInfo={setSelectedAccountInfo} 
              openModal={setModalVisibility}
              setIsAdding={setIsAdding}
            />
          ))}
        </ScrollView>

        <Fab onPress={() => clickAdd()}>
          <Entypo name="plus" size={32} color="white" />
        </Fab>

      </VStack>

      <AccountModal 
        isShown={modalVisibility} 
        setIsShown={setModalVisibility} 
        info={selectedAccountInfo} 
        isAdding={isAdding}
      ></AccountModal>
    </KeyboardAvoidingView>
  );
}

interface AccountButtonProps {
  selectedAccountInfo: accountInfo;
  setSelectedAccountInfo: (newInfo: accountInfo) => void;
  openModal: (visibility: boolean) => void;
  setIsAdding: (newIsAdding: boolean) => void;
}

// memo makes this object will only re-render if its props change
// TODO : change AvatarFallbackText to AvatarImage
const AccountButton = memo(({selectedAccountInfo, setSelectedAccountInfo, openModal, setIsAdding}: AccountButtonProps) => {
  const click = () => {
    setSelectedAccountInfo(selectedAccountInfo);
    setIsAdding(false);
    openModal(true);    
  };

  return (
    <TouchableOpacity style={styles.accountBtn} onPress={() => click()}>
      <HStack style={{gap:"8%"}}>
        <Avatar size="xl">
          <AvatarFallbackText size="md">{selectedAccountInfo.account}</AvatarFallbackText>
        </Avatar>
        <VStack style={{justifyContent: 'center', alignContent:'center'}}>
          <Text style={{fontSize:20}}>
            {selectedAccountInfo.account}
          </Text>
          <Text style={{fontSize:15}}>
            {selectedAccountInfo.pw}
          </Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1
  },
  mainVStack: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#212121',
    gap: 20,
  },
  topBar:{
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: '3%',
  },
  input:{
    width: '70%',
    backgroundColor: '#4F4F4F',
  },
  inputFiled:{
    color: 'white',
    fontSize: 20,
  },
  iconButtons: {
    width: 'auto',
  },
  scrollView:{
    flex: 1,
    paddingBottom: 10,
  },
  accountBtn:{
    width: 260,
    height: 100,
    borderWidth: 1,
    borderRadius: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  }
});
