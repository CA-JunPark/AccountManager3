// changePW screen
import { Text, StyleSheet, Alert } from "react-native";
import { Pressable } from "react-native";
import { Input, InputField} from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { useRef } from "react";
import api from '@/components/apis/api';

const showMessage = (msg: string) => {
  Alert.alert(
    "Error", 
    msg, 
    [
      {text: "OK"},
    ]
  );
};

const changePW = async(pw: string, newPw: string, confirm: string) =>{
  try{
    await api.put("/ddb/changePW/", {pw:pw, newPw: newPw, confirm: confirm})
    return true;
  }
  catch (error: any){
    showMessage(error.response.data.detail);
    return false;
  };
};

export default function Index() {
  const passwordRef = useRef("");
  const newPasswordRef = useRef("");
  const confirmRef = useRef("");

  const handlePWChange = (value: string) => {
    passwordRef.current = value; 
  };

  const handleNewPWChange = (value:string) => {
    newPasswordRef.current = value;
  };

  const handleConfirmChange = (value: string) => {
    confirmRef.current = value; 
  };

  const pressEnter = async() => {
    const result = await changePW(passwordRef.current, newPasswordRef.current, confirmRef.current);
    if (result){
      router.navigate("/(home)");
    }
  }

  const pressCancel = () => {
    Alert.alert(
      "Close", 
      "Go back to Main?", 
      [
        {text: "Cancel"},
        {text: "OK", onPress: () => backToMain()},
      ]
    );
  };

  const backToMain = () => {
    router.back();
  };

  return (
    <VStack style={styles.mainVStack}>

      <Text style={styles.passwordText}> Change Password </Text>

      <Text style={styles.label}> Current </Text>
      <Input size="xl" variant="rounded" isInvalid={false} style={styles.input}>
        <InputField 
          style={styles.inputFiled} type={"password"} textAlign="center" 
          onChangeText={(value) => handlePWChange(value)}
        />
      </Input>

      <Text style={styles.label}> New Password </Text>
      <Input size="xl" variant="rounded" isInvalid={false} style={styles.input}>
        <InputField 
          style={styles.inputFiled} type={"password"} textAlign="center" 
          onChangeText={(value) => handleNewPWChange(value)}
        />
      </Input>

      <Text style={styles.label}> Confirm Password </Text>
      <Input size="xl" variant="rounded" isInvalid={false} style={styles.input}>
        <InputField 
          style={styles.inputFiled} type={"password"} textAlign="center" 
          onChangeText={(value) => handleConfirmChange(value)}
          onSubmitEditing={() => pressEnter()}
        />
      </Input>

      <Pressable onPress={() => pressEnter()} style={styles.button}>
        <Text style={styles.enterText}>Enter</Text>
      </Pressable>
      <Pressable onPress={() => pressCancel()} style={styles.button}>
        <Text style={styles.enterText}>Cancel</Text>
      </Pressable>

    </VStack>
  );
}

const styles = StyleSheet.create({
  mainVStack: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#212121',
    gap: 20,
    padding:20,
    paddingTop: '20%',
  },
  passwordText: {
    fontSize: 35,
    color: 'white',
    width: "auto",
  },
  label: {
    fontSize: 20,
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '55%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterText: {
    fontSize: 20,
  },
  input:{
    width: '85%',
    backgroundColor: 'white',
  },
  inputFiled: {
    color: 'black',
  }
});