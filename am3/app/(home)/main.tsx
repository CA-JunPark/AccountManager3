// Main screen
import { Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Task} from "react-native";
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
import SettingModal from "@/components/modal/settingModal";
import { useSQLiteContext } from "expo-sqlite"; // https://www.youtube.com/watch?v=AT5asDD3u_A
import { drizzle, useLiveQuery} from 'drizzle-orm/expo-sqlite'; // https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0311#live-queries-
import * as schema from '@/db/schema';
import { accounts } from '@/db/schema';
import { eq } from "drizzle-orm";

// TODO change it to real data later Expo SQLite
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

const tempAccounts = generateAccounts(100);

const emptyAccountInfo: accountInfo = {
  id: 0,
  title: '',
  account: '',
  pw: '',
  logo: '',
  note: ''
};

export default function Main() {
  const [isArrowUp, setIsArrowUp] = useState(true);
  const [sortedAccounts, setSortedAccounts] = useState([...tempAccounts]);
  const searchTextRef = useRef("");
  const [accountModalVisibility, setAccountModalVisibility] = useState(false);
  const [selectedAccountInfo, setSelectedAccountInfo] = useState(emptyAccountInfo);
  const [isAdding, setIsAdding] = useState(false);
  const [settingModalVisibility, setSettingModalVisibility] = useState(false);

  const [sqlData, setSqlData] = useState<accountInfo[]>([]);

  const db = useSQLiteContext();
  const drizzleDB = drizzle(db, { schema })

  useEffect(() => {
    sortButtons();
    const load = async() => {
      // await drizzleDB.insert(accounts).values([{
      //     title: '1',
      //     account: 'User1',
      //     pw: 'password1',
      //     logo: 'logo1',
      //     note: 'note1'
      //   },
      //   {
      //     title: '2',
      //     account: 'User2',
      //     pw: 'password2',
      //     logo: 'logo2',
      //     note: 'note2'
      //   }]
      // )

      // await drizzleDB.delete(accounts).where(eq(accounts.title, '1'));
      // await drizzleDB.delete(accounts).where(eq(accounts.title, '2'));
      // await drizzleDB.delete(accounts); // delete All

    // await drizzleDB.update(accounts).set({ title: '3' }).where(eq(accounts.title, '1'));

      const data = await drizzleDB.query.accounts.findMany();
      console.log(data);
      const num = await drizzleDB.$count(accounts);
      console.log(num);

    };
    load()
  }, []);

  const clickSetting = () => {
    console.log('clicked setting');
    setSettingModalVisibility(true);
  };

  const sortButtons = () => {
    const sorted = [...tempAccounts].sort((a, b) => {
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
    setSelectedAccountInfo(emptyAccountInfo)
    setAccountModalVisibility(true)
    // get max id

    // set is when open
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
              openModal={setAccountModalVisibility}
              setIsAdding={setIsAdding}
            />
          ))}
        </ScrollView>

        <Fab onPress={() => clickAdd()}>
          <Entypo name="plus" size={32} color="white" />
        </Fab>

      </VStack>

      <AccountModal 
        isShown={accountModalVisibility} 
        setIsShown={setAccountModalVisibility} 
        info={selectedAccountInfo} 
        isAdding={isAdding}
      ></AccountModal>

      <SettingModal
        isShown={settingModalVisibility}
        setIsShown={setSettingModalVisibility}
      >
      </SettingModal>

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
