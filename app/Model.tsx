import { db } from '@/config/FirebaseConfig';
import { router } from 'expo-router';
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import styled from 'styled-components/native';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchGPTResponse,fetchTagsResponse2 } from './services/gptPromt';
const screenWidth = Dimensions.get('window').width;

const sections = [
  { label: 'Name', key: 'name' },
  { label: 'Description', key: 'description' },
  { label: 'Overview', key: 'overview' },
  { label: 'Tags', key: 'tags' },
];

const BusinessCanvasScreen: React.FC = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [longDescription, setLongDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const totalSteps = sections.length;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => {
    if (step === 0) {
      router.push('/Account');
    } else {
      setStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleAddAnother = () => {
    setName('');
    setDescription('');
    setLongDescription('');
    setTags([]);
    setStep(0);
    setIsSubmitted(false);
  };

  const saveProjectToFirestore = async () => {
    try {
      const projectRef = collection(db, 'projects');
      const projectQuery = query(projectRef, orderBy('id', 'desc'), limit(1));
      const projectSnap = await getDocs(projectQuery);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error("User ID not found in AsyncStorage.");
      }

      let newId = 1;
      setIsSubmitted(true);
      if (!projectSnap.empty) {
        const highestProject = projectSnap.docs[0].data();
        newId = highestProject.id + 1;
      }

      await setDoc(doc(projectRef, newId.toString()), {
        id: newId,
        userId: userId,
        name: name,
        description: description,
        longDescription: longDescription,
        tags: tags,
        createdAt: serverTimestamp(),
        image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg'
      });

      Alert.alert('Success', 'Project saved successfully!');
      console.log('Project saved with ID:', newId);
    } catch (error) {
      console.error('Error saving project:', error);
      Alert.alert('Error', 'Failed to save the project.');
    }
  };

  const handleGenerateLongDescription = async () => {
    if (longDescription) {
      setLoading(true);
      try {
        const DescriptionGenerated = await fetchGPTResponse(longDescription);
        setDescription(DescriptionGenerated);
      } catch (error) {
        console.error('Error generating long description:', error);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Warning', 'Please provide a description first.');
    }
  };

  const handleGenerateTags = async () => {
    if (longDescription) {
      setLoading2(true);
      try {
        const tagsArray = await fetchTagsResponse2(longDescription);
        setTags(tagsArray);
      } catch (error) {
        console.error('Error generating tags:', error);
      } finally {
        setLoading2(false);
      }
    } else {
      Alert.alert('Warning', 'Please provide a description first.');
    }
  };

  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return (
          <StyledTextInput
            placeholder="Enter project name"
            value={name}
            onChangeText={setName}
          />
        );
      case 1:
        return (
          <StyledTextInput
            placeholder="Enter project description"
            value={longDescription}
            onChangeText={setLongDescription}
          />
        );
case 2:
  return (
    <>
      <StyledTextInput
       // multiline={true}
        placeholder="Enter or generate an overview. This will be visible on the main page to other users."
        value={description}
        onChangeText={setDescription}
      />
      <StyledButton onPress={handleGenerateLongDescription} disabled={loading}>
        <ButtonText>{loading ? 'Generating...' : 'Generate using ChatGPT'}</ButtonText>
      </StyledButton>
    </>
  );
case 3:
  return (
    <>
      <StyledTextInput
       // multiline={true}
        placeholder="Enter tags (separated by commas) or generate them"
        value={tags.join(', ')}
        onChangeText={(text) => setTags(text.split(',').map(tag => tag.trim()))}
      />
      <StyledButton onPress={handleGenerateTags} disabled={loading2}>
        <ButtonText>{loading2 ? 'Generating...' : 'Generate Tags'}</ButtonText>
      </StyledButton>
    </>
  );
      default:
        return null;
    }
  };
  


  const progress = (step + 1) / totalSteps;
  const progressPercentage = Math.round(progress * 100);
  return (
    <FirstContainer>
      {isSubmitted ? (
        <SuccessContainer>
          <SuccessMain>
          <SuccessText>Your project is now live and attracting interested viewers!</SuccessText>
            <DoneImage
              source={require('../assets/images/done (2).png')} />

            <ButtonsContainer2>
            <StyledButton onPress={() => {
            handleAddAnother();
            }}>
              <ButtonText>Add next</ButtonText>
            </StyledButton>
            <StyledButton onPress={() => router.push('/Account')}>
              <ButtonText>Menu</ButtonText>
            </StyledButton>
            </ButtonsContainer2>
          </SuccessMain>
        </SuccessContainer>
      ) : (
        <MainContainer>
          <UpContainer>
            <MainText>
              <ProgresText>Your project is {progressPercentage}% complete</ProgresText>
            </MainText>
            <ProContainer>
              <StyledProgressBar2 progress={progress} color="black" />
            </ProContainer>
          </UpContainer>
          <DownContainer>
          {renderStepComponent()}
          </DownContainer>
          <ButtonsContainer>
            <StyledButton onPress={prevStep}>
              <ButtonText>Back</ButtonText>
            </StyledButton>
            {step < totalSteps - 1 ? (
              <NextButton onPress={nextStep}>
                <ButtonText>Next</ButtonText>
              </NextButton>
            ) : (
              <NextButton onPress={saveProjectToFirestore}>
                <ButtonText>Create</ButtonText>
              </NextButton>
            )}
          </ButtonsContainer>
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
  width: ${screenWidth - 80}px; /* Adjust this value to decrease the width */
  margin-bottom: 20px;
  height: 15px;
  border-radius:20px;
`;

const ProgresText = styled.Text`
  color: white;
  font-size: 26px;

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

const StyledQuestions = styled.Text`
  color:#c1c1c1;
  padding: 5px;
  width: 90%;
`;

const FirstContainer = styled.View`
  flex:1;
  align-items: center;
  background-color: #1e1e1e;
  justify-content: center;
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
  min-height: 500px;
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
