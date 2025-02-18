// Main screen
import { Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform} from "react-native";
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
import { drizzle} from 'drizzle-orm/expo-sqlite'; // https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0311#live-queries-
import * as schema from '@/db/schema';
import { LogoBubble, convertBase64toPngURI } from '@/components/common/Logo';

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
  const [allAccounts, setAllAccounts] = useState<accountInfo[]>([]);
  const [sortedAccounts, setSortedAccounts] = useState<accountInfo[]>([]);
  const searchTextRef = useRef("");
  const [accountModalVisibility, setAccountModalVisibility] = useState(false);
  const [selectedAccountInfo, setSelectedAccountInfo] = useState(emptyAccountInfo);
  const [isAdding, setIsAdding] = useState(false);
  const [settingModalVisibility, setSettingModalVisibility] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);

  const db = useSQLiteContext();
  const drizzleDB = drizzle(db, { schema })

  const loadSqlite = async() => {
    if (searchTextRef.current === ""){
      const accountsData = await drizzleDB.query.accounts.findMany();
      const sortedAccountData = [...accountsData].sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      setAllAccounts([...sortedAccountData]);
      setSortedAccounts([...sortedAccountData]);
    };
  };
  
  // update accounts when added or saved or deleted + initial load
  useEffect(()=>{
    loadSqlite();
  },[accountModalVisibility, settingModalVisibility])

  // sort when isArrowUp change
  useEffect(() => {
    // TODO Delete this at the end
    // const deleteAccounts = async () => {
    //   await drizzleDB.delete(accounts);
    // };
    // deleteAccounts();
    sortButton(sortedAccounts);
  }, [isArrowUp])

  const clickSetting = () => {
    setSettingModalVisibility(true);
  };

  const sortButton = (accounts: accountInfo[]) => {
    const sorted = [...accounts].sort((a, b) => {
      if (isArrowUp) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setSortedAccounts(sorted);
  };

  const clickSort = () => {
    setIsArrowUp(!isArrowUp);
  };

  const handleTextChange = (value: string) => {
    searchTextRef.current = value;
  };

  const searchFilter = async(key: string, accounts: accountInfo[]) => {
    const regex = new RegExp(key, 'i');
    return accounts.filter(account => 
      regex.test(account.title)
    );
  };

  const clickSearch = async() => {
    const filterText = searchTextRef.current;
    if (filterText == ""){
      sortButton(allAccounts);
    }
    else{
      const filteredAccounts = await searchFilter(searchTextRef.current, allAccounts)
      setSortedAccounts(filteredAccounts);
    }
  };

  const clickAdd = () => {
    setIsAdding(true)
    setSelectedAccountInfo(emptyAccountInfo)
    setAccountModalVisibility(true)
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
                onChangeText={(value) => handleTextChange(value)}
                onSubmitEditing={() => clickSearch()}
              />  
            </Input>

            <TouchableOpacity onPress={() => clickSearch()} style={styles.iconButtons}>
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
              isSecretMode={isSecretMode}
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
        drizzleDB={drizzleDB}
      ></AccountModal>

      <SettingModal
        isShown={settingModalVisibility}
        setIsShown={setSettingModalVisibility}
        isSecretMode={isSecretMode}
        setIsSecretMode={setIsSecretMode}
        drizzleDB={drizzleDB}
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
  isSecretMode: boolean;
}

// memo makes this object will only re-render if its props change
const AccountButton = memo(({selectedAccountInfo, setSelectedAccountInfo, openModal, setIsAdding, isSecretMode}: AccountButtonProps) => {
  const click = () => {
    setSelectedAccountInfo(selectedAccountInfo);
    setIsAdding(false);
    openModal(true);    
  };

  const [logoUri, setLogoUri] = useState("");

  const createLogoUri = async () => {
    const uri = await convertBase64toPngURI(selectedAccountInfo.logo, selectedAccountInfo.id);
    setLogoUri(uri);
  };

  useEffect(() => {
    if (selectedAccountInfo.logo === "@/assets/images/react-logo.png"){
      setLogoUri("@/assets/images/react-logo.png");
    }
    else{
      createLogoUri();
    };
  }, [selectedAccountInfo.logo]);

  return (
    <TouchableOpacity style={styles.accountBtn} onPress={() => click()}>
      <HStack style={{gap:"3%"}}>
        <Avatar size="xl">
          <LogoBubble title={selectedAccountInfo.title} logo={logoUri} />
        </Avatar>
        <VStack style={{justifyContent: 'center', alignContent:'center'}}>
          <Text style={styles.accountBtnTitleText}>
            {selectedAccountInfo.title}
          </Text>
          <Text style={styles.accountBtnAccountText}>
            {selectedAccountInfo.account}
          </Text>
          <Text style={styles.accountBtnPWText}>
            {isSecretMode ? "***********" : selectedAccountInfo.pw}
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
    width: 280,
    height: 100,
    borderWidth: 1,
    borderRadius: '5%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
    paddingLeft: 15,
  },
  accountBtnTitleText:{
    fontSize: 12,
  },
  accountBtnAccountText:{
    fontSize: 12,
  },
  accountBtnPWText:{
    fontSize: 11,
  }
});
