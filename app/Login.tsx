import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dimensions, Alert } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from '@/config/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendUser } from "@/services/RecommenadtionService";
import messaging from '@react-native-firebase/messaging';

const screenWidth = Dimensions.get("window").width;

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { emailProp, passwordProp } = useLocalSearchParams();

  useEffect(() => {
    if (emailProp || passwordProp) {
      setForm((prevForm) => ({
        ...prevForm,
        email: typeof emailProp === "string" ? emailProp : prevForm.email,
        password: typeof passwordProp === "string" ? passwordProp : prevForm.password,
      }));
    }
  }, [emailProp, passwordProp]);

  async function handleLogin() {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill in both fields.");
      return;
    }

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Login Error", "Email not found.");
      } else {
        let userFound = false;
        querySnapshot.forEach(async (doc) => {
          const userData = doc.data();
          if (userData.password === password) {
            userFound = true;
            await AsyncStorage.setItem('userId', doc.id);
            await AsyncStorage.setItem('userType', userData.userType); // Save userId to AsyncStorage
            await AsyncStorage.setItem('userFirstName', userData.firstName);
            // console.log("login type")
            // console.log(userData.userType)
            Alert.alert("Login Successful", "Welcome back!");
            const sendRequest = sendUser(doc.id);

            router.push("/(tabs)/home");
          }
        });

        if (!userFound) {
          Alert.alert("Login Error", "Incorrect password.");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Login Error", "An error occurred while logging in.");
    }
  }
  return (
    <Container>
      <InnerContainer>
        <KeyboardAwareScrollView>
          <Header>
            <HeaderImg
              alt="Logo"
              resizeMode="contain"
              source={require("../assets/images/letter-b.gif")}
            />
            <Title>
              Sign in to <Title style={{ color: "#4acacd" }}>Binder</Title>
            </Title>
            <Subtitle>The place where Innovation meets Investment</Subtitle>
          </Header>

          <Form>
            <InputGroup>
              <InputLabel>Email address</InputLabel>
              <InputControl
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={(email) => setForm({ ...form, email })}
                placeholder="john@example.com"
                placeholderTextColor="#6b7280"
                value={form.email}
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>Password</InputLabel>
              <InputControl
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(password) => setForm({ ...form, password })}
                placeholder="************"
                placeholderTextColor="#6b7280"
                secureTextEntry
                value={form.password}
              />
            </InputGroup>

            <FormAction>
              <Button onPress={handleLogin}>
                <ButtonText>Sign in</ButtonText>
              </Button>
            </FormAction>
            <FormLink>
              <Link href="/Home">Forgot password?</Link>
            </FormLink>
          </Form>
        </KeyboardAwareScrollView>

        <TouchableOpacity onPress={() => {}}>
          <FormFooter>
            Don't have an account?
            <SignUpLink>
              <Link href="/Model">Sign up</Link>
            </SignUpLink>
          </FormFooter>
        </TouchableOpacity>
      </InnerContainer>
    </Container>
  );
}

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: F0F0F0;
`;

const InnerContainer = styled.View`
  flex: 1;
  padding: 20px;
  width: ${screenWidth > 768 ? "600px" : "100%"};
  margin-top: ${screenWidth > 1024
    ? "100px"
    : screenWidth > 768
    ? "10px"
    : "30px"};
  align-self: center;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderImg = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  border-radius: 10px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  text-align: center;
  color: #6b7280;
`;

const Form = styled.View`
  margin-top: 20px;
`;

const InputGroup = styled.View`
  margin-bottom: 20px;
`;

const InputLabel = styled.Text`
  font-size: 14px;
  color: #111827;
  margin-bottom: 5px;
`;

const InputControl = styled(TextInput)`
  padding: 12px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  color: #111827;
`;

const FormAction = styled.View`
  margin-top: 20px;
  align-items: center;
`;

const Button = styled(TouchableOpacity)`
  background-color: #4acacd;
  padding: 15px;
  border-radius: 10px;
  width: 100%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const FormLink = styled.Text`
  margin-top: 20px;
  text-align: center;
  color: #075eec;
  text-decoration-line: underline;
`;

const FormFooter = styled.Text`
  text-align: center;
  color: #6b7280;
`;

const SignUpLink = styled.Text`
  text-decoration-line: underline;
  color: #075eec;
`;
