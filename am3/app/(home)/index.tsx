// PW screen
import { Text, StyleSheet, Alert} from "react-native";
import { Pressable } from "react-native";
import { Input, InputField} from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { useRef } from "react";
import * as SecureStore from 'expo-secure-store';
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

const login = async(password: string) => {
  // login with password > if success get the jwt tokens
  try {
    const response = await api.post("/token/", {username:"JP", password: password});
    const { access, refresh } = response.data;

    // Store tokens in SecureStore
    await SecureStore.setItemAsync('accessToken', access);
    await SecureStore.setItemAsync('refreshToken', refresh);

    return true;
  } catch (error) {
    showMessage("Wrong Password")
    return false;
  }
};

export default function Index() {
  const passwordRef = useRef("");

  const handleChange = (value: string) => {
    passwordRef.current = value; 
  };

  const pressEnter = async() => {
    console.log("Checking password");
    const loginResult = await login(passwordRef.current)

    if (loginResult){
      router.navigate("/main");
    }
  }

  return (
    <VStack style={styles.mainVStack}>

      <Text style={styles.passwordText}>Password</Text>

      <Input size="xl" variant="rounded" isInvalid={false} style={styles.input}>
        <InputField 
          style={styles.inputFiled} type={"password"} textAlign="center" 
          onChangeText={(value) => handleChange(value)}
          onSubmitEditing={() => pressEnter()}
        />
      </Input>

      <Pressable onPress={() => pressEnter()} style={styles.button}>
        <Text style={styles.enterText}>Enter</Text>
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
    paddingTop: '45%',
  },
  passwordText: {
    fontSize: 40,
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