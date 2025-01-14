// PW screen
import { Text, StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { Input, InputField} from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { useRef } from "react";
import axios from 'axios';

export default function Index() {
  const passwordRef = useRef("");
  
  const checkPassword = async (password: string) => {
    console.log("Checking password: ", password);
    
    // const apiUrl = '';
    // try {
    //   const response = await axios.get(apiUrl);
    //   console.log("response: ", response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handleChange = (value: string) => {
    passwordRef.current = value; 
  };

  const pressEnter = () => {
    checkPassword(passwordRef.current);
    // router.push("/main");
  }

  return (
    <VStack style={styles.mainVStack}>

      <Text style={styles.passwordText}>Password</Text>

      <Input size="xl" variant="rounded" isInvalid={false} style={styles.input}>
        <InputField 
          style={styles.inputFiled} type={"password"} textAlign="center" 
          onChangeText={(value) => handleChange(value)}/>
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