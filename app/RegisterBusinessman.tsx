import React, { useState } from 'react';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Alert, Dimensions, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { MultiSelect } from 'react-native-element-dropdown';  // Import dropdown component
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { db } from '../config/FirebaseConfig';
import { doc, getDoc, getDocs, increment, limit, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const screenWidth = Dimensions.get('window').width;

export default function RegisterSciencist() {
    const [form, setForm] = useState({
        email: '',
        login: '',
        password:'',
        confirmPassword: '',
        firstName:'',
        lastName:'',
        about: '',
        joinDate:'',

    });
 

    async function addUserWithIncrement() {
      try {
        const userRef = collection(db, "businessman");
    
        const highestIdQuery = query(userRef, orderBy("id", "desc"), limit(1));
        const querySnapshot = await getDocs(highestIdQuery);
    
        let newId = 1; 
        if (!querySnapshot.empty) {
          const highestDoc = querySnapshot.docs[0];
          newId = highestDoc.data().id + 1; 
        }
    
        await setDoc(doc(userRef, newId.toString()), {
          id: newId,
          email: form.email,
          login: form.login,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          about: form.about,
          userType: 'Businessman',
          joinDate: serverTimestamp(),
        });
    
        console.log("User added with ID:", newId);
      } catch (e) {
        console.error("Error adding user with incremented ID:", e);
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
                            source={require('../assets/images/letter-b.gif')}
                        />
                        <Title>
                            Sign up to <Title style={{ color: '#4acacd' }}>Binder</Title>
                        </Title>
                        <Subtitle>The place where Innovation meets Investmen</Subtitle>
                    </Header>

                    <Form>
                        {}
                        <InputRow>
                            <InputGroupHalf>
                                <InputLabel>Email address</InputLabel>
                                <InputControl
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    keyboardType="email-address"
                                    onChangeText={email => setForm({ ...form, email })}
                                    placeholder="john@example.com"
                                    placeholderTextColor="#6b7280"
                                    value={form.email}
                                />
                            </InputGroupHalf>

                            <InputGroupHalf>
                                <InputLabel>Username</InputLabel>
                                <InputControl
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={login => setForm({ ...form, login })}
                                    placeholder="DanyCaramba"
                                    placeholderTextColor="#6b7280"
                                    value={form.login}
                                />
                            </InputGroupHalf>
                        </InputRow>

                        <InputRow>
                            <InputGroupHalf>
                                <InputLabel>First Name</InputLabel>
                                <InputControl
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={firstName => setForm({ ...form, firstName })}
                                    placeholder="John"
                                    placeholderTextColor="#6b7280"
                                    value={form.firstName}
                                />
                            </InputGroupHalf>

                            <InputGroupHalf>
                                <InputLabel>Last Name</InputLabel>
                                <InputControl
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={lastName => setForm({ ...form, lastName })}
                                    placeholder="DanyCaramba"
                                    placeholderTextColor="#6b7280"
                                    value={form.lastName}
                                />
                            </InputGroupHalf>
                        </InputRow>

                        <InputRow>
                            <InputGroupHalf>
                                <InputLabel>Password</InputLabel>
                                <InputControl
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={password => setForm({ ...form, password })}
                                    placeholder="************"
                                    placeholderTextColor="#6b7280"
                                    secureTextEntry
                                    value={form.password}
                                />
                            </InputGroupHalf>

                            <InputGroupHalf>
                                <InputLabel>Confirm Password</InputLabel>
                                <InputControl
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={confirmPassword => setForm({ ...form, confirmPassword })}
                                    placeholder="************"
                                    placeholderTextColor="#6b7280"
                                    secureTextEntry
                                    value={form.confirmPassword}
                                />
                            </InputGroupHalf>
                        </InputRow>

                        <InputGroup>
                            <InputLabel>About You</InputLabel>
                            <TextArea
                                multiline
                                numberOfLines={4}
                                placeholder="Tell us a bit about yourself..."
                                placeholderTextColor="#6b7280"
                                onChangeText={about => setForm({ ...form, about })}
                                value={form.about}
                            />
                        </InputGroup>

                        <FormAction>
                            <Button onPress={addUserWithIncrement}>
                                <ButtonText>Sign up</ButtonText>
                            </Button>
                        </FormAction>

                        <FormLink />
                    </Form>
                </KeyboardAwareScrollView>

                <TouchableOpacity onPress={() => { }}>
                    <FormFooter>
                        You have an account?
                        <SignUpLink>
                            <Link href="/Login">
                                Sign in
                            </Link>
                        </SignUpLink>
                    </FormFooter>
                </TouchableOpacity>
            </InnerContainer>
        </Container>
    );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color:F0F0F0;
`;

const InnerContainer = styled.View`
  flex: 1;
  padding: 10px;
  width: ${screenWidth > 768 ? '600px' : '100%'};
  margin-top: ${screenWidth > 1024 ? '60px' : screenWidth > 768 ? '10px' : '30px'};
  align-self: center;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 10px;
`;

const HeaderImg = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  border-radius:10px;
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

const InputRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const InputGroupHalf = styled.View`
  flex: 1;
  margin-bottom: 20px;
  margin-right: 10px;
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

const TextArea = styled(TextInput)`
  padding: 12px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  color: #111827;
  height: 100px; /* Możesz dostosować wysokość */
`;

