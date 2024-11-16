import React, { useState } from 'react';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import { MultiSelect } from 'react-native-element-dropdown';
import { db } from '../config/FirebaseConfig';
import { collection, doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, query, getDocs, limit, orderBy } from "firebase/firestore";
import { fetchGPTResponse, fetchTagsResponse3, fetchTagsResponse4, fetchTagsResponse5 } from './services/gptPromt';

const screenWidth = Dimensions.get('window').width;

export default function RegisterSciencist() {
  const [form, setForm] = useState({
    email: '',
    login: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    about: '',
  });

  const [description, setDescription] = useState<string[]>([]);
  const [tags, setTags] = useState([]);
  const [problems, setProblems] = useState([]);
  const data = [
    { label: 'Biotechnology', value: 'biotech' },
    { label: 'Artificial Intelligence', value: 'ai' },
    { label: 'Blockchain', value: 'blockchain' },
    { label: 'Programming', value: 'programming' },
    { label: 'Quantum Computing', value: 'quantum' },
  ];

  const [loading, setLoading] = useState(false);

  async function handleGenerateLongDescription() {
    if (form.about) {
      setLoading(true);
      try {
        // Czekaj na wszystkie odpowiedzi równocześnie
        const DescriptionGenerated = await Promise.all([
          fetchTagsResponse4(form.about)
        ]);
        return DescriptionGenerated;
      } catch (error) {
        console.error("Error generating long description:", error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Warning", "Please provide a description first.");
    }
  }
  
  async function handleGenerateLongDescription1() {
    if (form.about) {
      setLoading(true);
      try {
        // Czekaj na wszystkie odpowiedzi równocześnie
        const  Problems = await Promise.all([
          fetchTagsResponse5(form.about)
        ]);
        return Problems;
      } catch (error) {
        console.error("Error generating long description:", error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Warning", "Please provide a description first.");
    }
  }
  async function handleGenerateLongDescription2() {
    if (form.about) {
      setLoading(true);
      try {
        // Czekaj na wszystkie odpowiedzi równocześnie
        const Tags = await Promise.all([
          fetchTagsResponse3(form.about)
        ]);
  
        return Tags;
      } catch (error) {
        console.error("Error generating long description:", error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Warning", "Please provide a description first.");
    }
  }
  async function addUserWithIncrement() {
    try {
      // Generate description
      const w1 = await handleGenerateLongDescription();
      const w2 = await handleGenerateLongDescription1();
      const w3 = await handleGenerateLongDescription2(); 
      console.log(w1);
      
      console.log(w3);
  
      // Reference to the "scientist" collection
      const scientistRef = collection(db, "users");
  
      // Query to get the document with the highest 'id'
      const highestIdQuery = query(scientistRef, orderBy("id", "desc"), limit(1));
      const querySnapshot = await getDocs(highestIdQuery);
  
      let newId = 1; // Default to 1 if no documents exist
      if (!querySnapshot.empty) {
        const highestDoc = querySnapshot.docs[0];
        newId = highestDoc.data().id + 1; // Increment the highest 'id'
      }
  
      // Save to Firestore
      await setDoc(doc(scientistRef, newId.toString()), {
        id: newId,
        tags: w3[0],
        description: w2[0],
        email: form.email,
        login: form.login,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        about: w1[0][0],
        userType: "Scientist",
        joinDate: serverTimestamp(), // Add timestamp for join date
      });
  
      console.log("Scientist added with ID:", newId);
      Alert.alert("Success", "Scientist account created!");
    } catch (e) {
      console.error("Error adding scientist with incremented ID:", e);
      Alert.alert("Error", "Failed to create scientist account.");
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
            <Subtitle>The place where Innovation meets Investment</Subtitle>
          </Header>

          <Form>
            <InputRow>
              <InputGroupHalf>
                <InputLabel>Email address</InputLabel>
                <InputControl
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={email => setForm({ ...form, email })}
                  placeholder="john@example.com"
                  value={form.email}
                />
              </InputGroupHalf>

              <InputGroupHalf>
                <InputLabel>Username</InputLabel>
                <InputControl
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={login => setForm({ ...form, login })}
                  placeholder="DanyCaramba"
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
                  onChangeText={firstName => setForm({ ...form, firstName })}
                  placeholder="John"
                  value={form.firstName}
                />
              </InputGroupHalf>

              <InputGroupHalf>
                <InputLabel>Last Name</InputLabel>
                <InputControl
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={lastName => setForm({ ...form, lastName })}
                  placeholder="Doe"
                  value={form.lastName}
                />
              </InputGroupHalf>
            </InputRow>

            <InputRow>
              <InputGroupHalf>
                <InputLabel>Password</InputLabel>
                <InputControl
                  autoCorrect={false}
                  secureTextEntry
                  onChangeText={password => setForm({ ...form, password })}
                  placeholder="************"
                  value={form.password}
                />
              </InputGroupHalf>

              <InputGroupHalf>
                <InputLabel>Confirm Password</InputLabel>
                <InputControl
                  autoCorrect={false}
                  secureTextEntry
                  onChangeText={confirmPassword => setForm({ ...form, confirmPassword })}
                  placeholder="************"
                  value={form.confirmPassword}
                />
              </InputGroupHalf>
            </InputRow>

            

            <InputGroup>
              <InputLabel>Gives as links to your scient work</InputLabel>
              <TextArea
                multiline
                placeholder="Links..."
                onChangeText={about => setForm({ ...form, about })}
                value={form.about}
              />
            </InputGroup>

            <FormAction>
              <Button onPress={addUserWithIncrement}>
                <ButtonText>Sign up</ButtonText>
              </Button>
            </FormAction>
          </Form>
        </KeyboardAwareScrollView>

        <TouchableOpacity onPress={() => { }}>
          <FormFooter>
            You have an account? <SignUpLink><Link href="/Login">Sign in</Link></SignUpLink>
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

const styles = {
    dropdown: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginTop: 8,
    },
    selectedStyle: {
        backgroundColor: '#e5e7eb',
        borderRadius: 8,
    },
};
