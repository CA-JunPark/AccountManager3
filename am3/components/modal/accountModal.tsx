import React, { useEffect, useCallback, useState, memo, useRef } from 'react';
import { Text, Modal, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HStack } from '@/components/ui/hstack';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from '@/db/schema';
import { accounts } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import api from '@/components/apis/api';
import * as FileSystem from 'expo-file-system';
import { LogoBubble, convertBase64toPngURI } from '@/components/common/Logo';

export interface accountInfo {
  id: number;
  title: string;
  account: string;
  pw: string;
  logo: string;
  note: string;
}

interface AccountModalProps {
  isShown: boolean;
  setIsShown: (newState: boolean) => void;
  info: accountInfo;
  isAdding: boolean;
  drizzleDB: ExpoSQLiteDatabase<typeof schema>;
}

export const AccountModal = ({isShown, setIsShown, info, isAdding, drizzleDB}: AccountModalProps) => {
  const [currentID, setCurrentID] = useState(0);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentAccount, setCurrentAccount] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [currentLogo, setCurrentLogo] = useState('');
  const [currentNote, setCurrentNote] = useState('');
  const [logoUri, setLogoUri] = useState('');
  const isLogoReadyRef = useRef(false);

  // Returns a new ID if there is no valid one
  const getNewMaxID = useCallback(async () => {
    const maxIdResult = await drizzleDB
      .select()
      .from(accounts)
      .orderBy(sql`${accounts.id} desc`)
      .limit(1);
    return maxIdResult.length ? maxIdResult[0].id + 1 : 1;
  }, [drizzleDB]);

  // Update logo URI based on current logo and id.
  // If using the default react logo, return that; otherwise, convert base64 to a PNG URI.
  const updateLogoUri = async (logo: string, id: number) => {
    isLogoReadyRef.current = false;
    if (logo === "@/assets/images/react-logo.png") {
      setLogoUri(logo);
    } else {
      const uri = await convertBase64toPngURI(logo, id);
      setLogoUri(uri);
    }
    isLogoReadyRef.current = true;
  };

  // Initialize or update the account data when `info` changes.
  useEffect(() => {
    const initializeData = async () => {
      if (info) {
        const newID = info.id === 0 ? await getNewMaxID() : info.id;
        setCurrentID(newID);
        setCurrentTitle(info.title);
        setCurrentAccount(info.account);
        setCurrentPw(info.pw);
        setCurrentNote(info.note);
        setCurrentLogo(info.logo);
        await updateLogoUri(info.logo, newID);
      }
    };
    initializeData();
  }, [info]);

  // Also update the logo URI when the logo or id changes.
  // useEffect(() => {
  //   updateLogoUri(currentLogo, currentID);
  // }, [currentLogo, currentID]);

  const closeModal = useCallback(() => {
    setIsShown(false);
  }, [setIsShown]);

  // uploadLogo
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists && fileInfo.size && fileInfo.size > 400 * 1024) {
          Alert.alert("Error", "File size exceeds 400KB. Please choose a smaller file.");
          return;
        }
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setCurrentLogo(base64);
        await updateLogoUri(base64, currentID);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const deleteAccount = async () => {
    try {
      await drizzleDB.delete(accounts).where(eq(accounts.id, info.id));
      await api.delete(`/ddb/deleteAccount/${info.id}/`);
      Alert.alert("Success", "Account deleted successfully!", [
        { text: "OK", onPress: closeModal },
      ]);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error.message || "An unknown error occurred";
      Alert.alert("Error", `Fail to Delete: ${errorMessage}`, [{ text: "OK" }]);
    }
  };

  const clickDeleteAccount = () => {
    Alert.alert("Delete", "Delete Confirm", [
      { text: "Cancel" },
      { text: "OK", onPress: async () => await deleteAccount() },
    ]);
  };

  const resetInfo = useCallback(async () => {
    setCurrentTitle(info.title);
    setCurrentAccount(info.account);
    setCurrentPw(info.pw);
    setCurrentNote(info.note);
    setCurrentLogo(info.logo);
    await updateLogoUri(info.logo, currentID);
  }, [info]);

  const saveAccount = async () => {
    const updatedAccount = {
      targetID: currentID,
      title: currentTitle,
      account: currentAccount,
      pw: currentPw,
      logo: currentLogo,
      note: currentNote,
    };
    try {
      await drizzleDB
        .update(accounts)
        .set({
          title: currentTitle,
          account: currentAccount,
          pw: currentPw,
          logo: currentLogo,
          note: currentNote,
        })
        .where(eq(accounts.id, info.id));

      await api.put("/ddb/account/", { account: updatedAccount });
      Alert.alert("Success", `${currentTitle} saved successfully!`, [
        { text: "OK", onPress: closeModal },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message, [{ text: "OK" }]);
    }
  };

  const clickSaveAccount = () => {
    Alert.alert("Save", `Save ${currentTitle}`, [
      { text: "Cancel" },
      { text: "OK", onPress: async () => await saveAccount() },
    ]);
  };

  const addAccount = async () => {
    try {
      const newID = await getNewMaxID();
      const newAccount = {
        id: newID,
        title: currentTitle,
        account: currentAccount,
        pw: currentPw,
        logo: currentLogo,
        note: currentNote,
      };
      await drizzleDB.insert(accounts).values(newAccount);
      await api.post("/ddb/account/", { account: newAccount });
      Alert.alert("Added", `New Account ${currentTitle} is added`, [
        { text: "OK", onPress: closeModal },
      ]);
    } catch (error) {
      console.error("Insertion error:", error);
      Alert.alert("Error", `Fail adding ${currentTitle}`, [{ text: "OK" }]);
    }
  };

  const clickAddAccount = () => {
    Alert.alert("Add", `Add ${currentTitle}`, [
      { text: "Cancel" },
      { text: "OK", onPress: async () => await addAccount() },
    ]);
  };
  
  return (
    <KeyboardAvoidingView>
      <Modal
        visible={isShown}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
        style={styles.modal}
      >
        <Box style={styles.mainBox}>
          <VStack style={styles.mainVStack}>
            <HStack style={styles.header}>
              <Text style={styles.headerText}>
                {isAdding ? 'Add Account' : 'Account'}
              </Text>
              <Button style={styles.close} onPress={closeModal}>
                <Ionicons name="arrow-back" style={styles.closeIcon} size={40} color="white" />
              </Button>
            </HStack>

            <HStack style={styles.logoHStack}>
              {isLogoReadyRef.current ? 
                (<Avatar size="xl">
                  <LogoBubble title={info.title} logo={logoUri} />
                </Avatar>) 
                : 
                <Avatar size="xl">
                  <AvatarFallbackText size="md">{info.title}</AvatarFallbackText>
                </Avatar>}
              <Box style={{ justifyContent: 'center' }}>
                <Button size="lg" style={styles.uploadBtn} onPress={pickFile}>
                  <MaterialIcons name="file-upload" size={40} color="white" />
                  <ButtonText> Upload </ButtonText>
                </Button>
              </Box>
            </HStack>

            <CustomInputField
              title="Title"
              content={info.title}
              isNote={false}
              inputState={currentTitle}
              setInput={setCurrentTitle}
            />
            <CustomInputField
              title="Account"
              content={info.account}
              isNote={false}
              inputState={currentAccount}
              setInput={setCurrentAccount}
            />
            <CustomInputField
              title="PW"
              content={info.pw}
              isNote={false}
              inputState={currentPw}
              setInput={setCurrentPw}
            />
            <CustomInputField
              title="Note"
              content={info.note}
              isNote={true}
              inputState={currentNote}
              setInput={setCurrentNote}
            />

            {!isAdding ? (
              <HStack style={styles.bottomHStack}>
                <Button size="md" style={styles.bottomBtn} onPress={clickDeleteAccount}>
                  <Text style={styles.bottomBtnText}> Delete </Text>
                </Button>
                <Button onPress={resetInfo}>
                  <Ionicons name="refresh" size={24} color="white" />
                </Button>
                <Button size="md" style={styles.bottomBtn} onPress={clickSaveAccount}>
                  <Text style={styles.bottomBtnText}> Save </Text>
                </Button>
              </HStack>
            ) : (
              <HStack style={styles.bottomHStack}>
                <Button onPress={resetInfo}>
                  <Ionicons name="refresh" size={24} color="white" />
                </Button>
                <Button size="md" style={styles.bottomBtn} onPress={clickAddAccount}>
                  <Text style={styles.bottomBtnText}> Add </Text>
                </Button>
              </HStack>
            )}
          </VStack>
        </Box>
      </Modal>
    </KeyboardAvoidingView>
  );
};

interface CustomInputFieldProps {
  title: string;
  content: string;
  isNote: boolean;
  inputState: string;
  setInput: (value: string) => void;
}

const CustomInputField = memo(
  ({ title, content, isNote, inputState, setInput }: CustomInputFieldProps) => {
    const fieldWidth = 240;

    const handleBlur = () => {
      setInput(inputState.trim());
    };

    return (
      <Box>
        <VStack style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={styles.inputLabel}>{title}:</Text>
          {!isNote ? (
            <Input style={{ width: fieldWidth }}>
              <InputField
                style={{ color: 'white' }}
                selectionColor="#FF5733"
                value={inputState}
                onChangeText={setInput}
                onBlur={handleBlur}
              />
            </Input>
          ) : (
            <Textarea style={{ width: fieldWidth, height: 200 }}>
              <TextareaInput
                style={{ textAlignVertical: 'top', color: 'white' }}
                selectionColor="#FF5733"
                value={inputState}
                onChangeText={setInput}
                onBlur={handleBlur}
              />
            </Textarea>
          )}
        </VStack>
      </Box>
    );
  }
);

const styles = StyleSheet.create({
  modal: {
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  mainVStack: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
  },
  close: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    marginTop: -3,
  },
  logoHStack: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  uploadBtn: {
    width: 130,
  },
  bottomHStack: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  bottomBtn: {
    width: 100,
  },
  bottomBtnText: {
    fontSize: 20,
    color: 'white',
  },
  inputLabel: {
    fontSize: 12,
    textAlign: 'left',
    color: 'white',
  },
});

export default AccountModal;
