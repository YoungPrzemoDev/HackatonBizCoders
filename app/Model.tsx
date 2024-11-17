import { db } from '@/config/FirebaseConfig';
import { router } from 'expo-router';
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView } from 'react-native';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import styled from 'styled-components/native';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchGPTResponseName,fetchTagsResponseDescription,fetchTagsResponseIndustryTags,fetchTagsResponseChallenges  } from './services/gptPromt';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const BusinessCanvasScreen: React.FC = () => {
  const [link, setLink] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);


  const fetchAndSavePrompts = async (link) => {
    if (!link) {
      Alert.alert('Warning', 'Please provide a link.');
      return;
    }
  
    try {
      setLoading(true);
      console.log('Starting prompt generation and save process for link:', link);
  
      // Initialize the results object
      const results = {
        name: '',
        description: '',
        longDescription: '',
        tags: [],
      };
  
      // Fetch data from GPT
      console.log('Fetching name...');
      results.name = await fetchGPTResponseName(link);
  
      console.log('Fetching short description...');
      results.description = await fetchTagsResponseDescription(link);
  
      console.log('Fetching long description...');
      results.longDescription = await fetchTagsResponseChallenges(link); // Replace with appropriate function for long description.
  
      console.log('Fetching tags...');
      results.tags = await fetchTagsResponseIndustryTags(link); // Assuming industry tags are used as general tags.
  
      // Save to Firestore
      console.log('Fetched all prompts successfully:', results);
      console.log('Saving project to Firestore...');
      const projectRef = collection(db, 'projects');
      const projectQuery = query(projectRef, orderBy('id', 'desc'), limit(1));
      const projectSnap = await getDocs(projectQuery);
  
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found in AsyncStorage.');
      }
  
      let newId = 1;
  
      if (!projectSnap.empty) {
        const highestProject = projectSnap.docs[0].data();
        newId = highestProject.id + 1;
      }
  
      const newProject = {
        id: newId,
        userId: userId,
        ...results,
        createdAt: serverTimestamp(),
        image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
      };
  
      await setDoc(doc(projectRef, newId.toString()), newProject);
  
      console.log('Project saved successfully with ID:', newId);
      Alert.alert('Success', 'Project saved successfully!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error in fetchAndSavePrompts:', error.message);
      Alert.alert('Error', 'Failed to generate and save prompts.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepComponent = () => {
    return (
      <>
        <StyledTextInput
          multiline={true}
          placeholder="Add link to your start-up"
          value={link}
          onChangeText={(text) => setLink(text)}
          blurOnSubmit={true}
          style={{ height: 150 }}
        />
        <StyledButton onPress={() => fetchAndSavePrompts(link)} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Generate using AI</ButtonText>}
        </StyledButton>
      </>
    );
  };

  return (
    <FirstContainer>
      {isSubmitted ? (
        <SuccessContainer>
          <SuccessMain>
            <SuccessText>Your project is now live and attracting interested viewers!</SuccessText>
            <DoneImage source={require('../assets/images/done (2).png')} />

            <ButtonsContainer2>
              <StyledButton onPress={() => setIsSubmitted(false)}>
                <ButtonText>Add Next</ButtonText>
              </StyledButton>
              <StyledButton onPress={() => router.push('/Account')}>
                <ButtonText>Menu</ButtonText>
              </StyledButton>
            </ButtonsContainer2>
          </SuccessMain>
        </SuccessContainer>
      ) : (
        <MainContainer>
          <DownContainer>{renderStepComponent()}</DownContainer>
        </MainContainer>
      )}
    </FirstContainer>
  );
};




const SuccessContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #1e1e1e;
`;

const SuccessMain = styled.View`
  width:100%;
    justify-content: center;
  align-items: center;
  border-radius:20px;
  padding:20px;
`;

const DoneImage = styled(Image)`
    width: 200px;
    height: 200px;
    margin-bottom: 10px;
  `;

const SuccessText = styled.Text`
  font-size: 22px;
  margin-bottom: 30px;
  color: white;
    textAlign: center;
`;

const StyledProgressBar2 = styled(ProgressBar)`
  width: ${screenWidth - 110}px; /* Adjust this value to decrease the width */
  margin-bottom: 20px;
  height: 15px;
  border-radius:20px;
`;

const ProgresText = styled.Text`
  color: white;
  font-size: 20px;

`;

const StyledTextInput = styled.TextInput`
  border: 1px solid #ced4da;
  padding: 10px;
  width: 90%;
  border-radius: 20px;
  margin-bottom: 20px;
  min-height: 160px;
  color:white;
 
`;
 // margin-top:-80px;
const StyledQuestions = styled.Text`
  color:#c1c1c1;
  padding: 5px;
  width: 90%;
`;

// const FirstContainer = styled.View`
//   flex:1;
//   align-items: center;
//   background-color: #1e1e1e;
//   justify-content: center;
  
// `;


const FirstContainer = styled(ScrollView).attrs({
  contentContainerStyle: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
})`
    background-color:  #1e1e1e;
        padding-bottom:65px;
  `;

const MainContainer = styled.View`
  align-items: top;
  width:100%;
  align-items: center;
  

`;

const MainText = styled.View`
  width: 90%;
  justify-content: center;
  align-items: center;
  padding: 20px;
  

`;


const UpContainer = styled.View`
  width: 90%;
  justify-content: center;
  align-items: center;
  background-color: #3d3d3d;
  border-radius:20px;
  
`;

const ProContainer = styled.View`
  width: 80%;
  height: 50px;
  justify-content: center;
  align-items: center;
  

`;

const DownContainer = styled.View`
  width: 100%;
  min-height: 450px;
  align-items: center;
  justify-content: center;

  
 
`;

const ButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
`;
const ButtonsContainer2 = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: black;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 50px;
  align-items: center;
`;


const NextButton = styled(StyledButton)`
  margin-left: auto; 
`;

const CenterContainer = styled.View`
  width: 100%;
  border-radius: 10px;
  margin-top:10px;
  align-items: center;
`;


const InputContainer = styled.View`
  width: 90%;
  align-items: center;
  justify-content: center;
  background-color:  #3d3d3d;
  padding: 20px;
  border-radius: 10px;
`;

const QuestionsContainer = styled.View`
  width: 90%;
   background-color:#3d3d3d;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-top:10px
`;
const StepText = styled.Text`
  font-size: 20px;
  margin-bottom: 20px;
  color:white;
`;
const QText = styled.Text`
  font-size: 20px;
    padding: 5px;
  width: 90%;
  color:white;
`;



const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
`;



export default BusinessCanvasScreen;
