// Main screen
import { Text, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import { Link } from 'expo-router';
import { Fab, } from '@/components/ui/fab';
import Entypo from '@expo/vector-icons/Entypo'; // https://icons.expo.fyi/Index
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Input, InputField} from '@/components/ui/input';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Avatar, AvatarFallbackText, AvatarImage} from '@/components/ui/avatar';

const accounts = Array.from({ length: 100 }, (_, i) => ({
  id: `${i + 1}`,
  account: `User${i + 1}`,
  pw: `password${i + 1}`,
  logo: `logo${i + 1}`,
  note: `note${i + 1}`,
}));

export default function Main() {
  const [isArrowUp, setIsArrowUp] = useState(true);
  const [sortedAccounts, setSortedAccounts] = useState([...accounts]); // Initialize with a copy of accounts
  const searchTextRef = useRef("");

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
    console.log('clicked add');
  };

  return (
    <VStack style={styles.mainVStack}>

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
            onChangeText={(value) => handleTextChange(value)}/>
        </Input>

        <TouchableOpacity onPress={clickSearch} style={styles.iconButtons}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>

      </HStack>
      <ScrollView style={styles.scrollView}>
        {sortedAccounts.map(({ id, account, pw, logo, note }) => (
          <AccountButton key={id} account={account} pw={pw} logo={logo} note={note} />
        ))}
      </ScrollView>

      <Fab onPress={() => clickAdd()}>
        <Entypo name="plus" size={32} color="white" />
      </Fab>
    </VStack>
  );
}

interface AccountButtonProps {
  account: string;
  pw: string;
  logo: string;
  note: string;
}

// memo makes this object will only re-render if its props change
// TODO : change AvatarFallbackText to AvatarImage
const AccountButton = memo(({account, pw, logo, note}: AccountButtonProps) => {
  const click = () => {
    console.log(account, pw, logo, note);
  };

  return (
    <TouchableOpacity style={styles.accountBtn} onPress={() => click()}>
      <HStack style={{gap:"8%"}}>
        <Avatar size="xl">
          <AvatarFallbackText size="md">{account}</AvatarFallbackText>
        </Avatar>
        <VStack style={{justifyContent: 'center', alignContent:'center'}}>
          <Text style={{fontSize:20}}>
            {account}
          </Text>
          <Text style={{fontSize:15}}>
            {pw}
          </Text>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
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
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
  },
  input:{
    width: '70%',
    backgroundColor: 'grey',
  },
  inputFiled:{
    color: 'black',
    fontSize: 20,
  },
  iconButtons: {
    width: 'auto',
  },
  scrollView:{
    paddingBottom: '5%',
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
