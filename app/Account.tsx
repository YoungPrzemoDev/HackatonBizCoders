import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
  ScrollView,
  GestureResponderEvent,
  Dimensions,
  StatusBar
} from "react-native";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "../config/FirebaseConfig";
import styled from "styled-components/native";
import { router } from "expo-router";
const screenWidth = Dimensions.get('window').width;
interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  id: number;
  login: string;
  password: string;
  userType: string;
  about: string;
}

const Account = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const userId = await AsyncStorage.getItem('userId');

        if (!userId) {
          console.log("No user ID found in AsyncStorage");
          return;
        }

        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        } else {
          console.log("No such user!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  function pickImage(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  return (


    <Container>
               <StatusBar translucent backgroundColor="red" barStyle="light-content" />
      <CenterContainer>
        <ProfileContainer>
          <ProfileImage
            source={require('../assets/images/profil.jpg')} />
          <ProfileName>
            {userData?.firstName ?? "N/A"} {userData?.lastName ?? "N/A"}
          </ProfileName>
          <ProfileType>
            {userData?.userType ?? "N/A"}
          </ProfileType>
          <AboutText>
            {userData?.about ?? "N/A"}
          </AboutText>
        </ProfileContainer>
        <UnderProfile>
          <FirstRow>
            <RowElement>
              <RowInfo>
                <IconImage
                  source={require('../assets/images/icon1.png')} />
              </RowInfo>
              <RowInfo>
                <StatValue>13</StatValue>
                <StatLabel>Project </StatLabel>
              </RowInfo>
            </RowElement>
            <RowElement>
              <RowInfo>
                <IconImage
                  source={require('../assets/images/icon2.png')} />
              </RowInfo>
              <RowInfo>
                <StatValue>9</StatValue>
                <StatLabel>Help </StatLabel>
              </RowInfo>
            </RowElement>
          </FirstRow>
          <FirstRow>
            <RowElement>
              <RowInfo>
                <IconImage
                  source={require('../assets/images/icon3.png')} />
              </RowInfo>
              <RowInfo>
                <StatValue>3</StatValue>
                <StatLabel>Teams </StatLabel>
              </RowInfo>

            </RowElement>
            <RowElement>
              <RowInfo>
                <IconImage
                  source={require('../assets/images/icon5.png')} />
              </RowInfo>
              <RowInfo>
                <StatValue>99</StatValue>
                <StatLabel>Friends </StatLabel>
              </RowInfo>
            </RowElement>
          </FirstRow>
          <CanvasRow onPress={() => router.push('/Model')}>
            <RowInfoC>
              <IconImageC
                source={require('../assets/images/canvas.png')} />
            </RowInfoC>
            <RowInfoC>
              <StatValueC>Create a new project!</StatValueC>
              <StatLabel>With the help of AI </StatLabel>
            </RowInfoC>
          </CanvasRow>
        </UnderProfile>
      </CenterContainer>
    </Container>
  );
};

const Container = styled(ScrollView).attrs({
  contentContainerStyle: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
})`
    background-color:  #1e1e1e;
        padding-bottom:65px;
  `;

const CenterContainer = styled.View`
     width:  ${screenWidth > 768 ? '600px' : '100%'};
     height:100%;
     align-items: center;
     border-radius:20px;
     padding-bottom:65px;

  `;


const ProfileContainer = styled.View`
  align-items: center;
  padding: 20px;
  padding-bottom:0px;
  width:85%;
  margin-top:80px;
  border-radius:20px;
  background-color:#3d3d3d;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  padding-bottom:15px;
  `;


const UnderProfile = styled.View`
    align-items: center;
    padding: 20px;
    width:100%;
    height:200px;
    border-radius:20px;
  `;

const FirstRow = styled.View`
  width:100%;
  height:80px;
  border-radius:20px;
  flexDirection:row;
  justifyContent:space-around;
  margin-top:10px;

`;


const CanvasRow = styled.TouchableOpacity`
  width:95%;
  height:80px;
  border-radius:20px;
  flexDirection:row;
  justifyContent:center;
  margin-top:10px;
  background-color:#3d3d3d;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const RowElement = styled.TouchableOpacity`
flexDirection:row;
background-color:#3d3d3d;
width:45%;
height:100%;
border-radius:20px;
shadow-color: #000;
shadow-offset: 0px 2px;
shadow-opacity: 0.25;
shadow-radius: 3.84px;

`;

const IconImage = styled(Image)`
    width: 40px;
    height: 40px;
    border-radius: 50px;
    margin-left:10px;
  `;

const IconImageC = styled(Image)`
    width: 40px;
    height: 40px;
    margin-left:10px;

  `;

const RowInfo = styled.View`
  margin-left:20px;
  width:50pxs;
  height:100%;
  border-radius:20px;
  justifyContent:center;
  align-items: center;
  `;


const RowInfoC = styled.View`
width:50pxs;
height:100%;
border-radius:20px;
 justifyContent:center;
 align-items: left;
  font-weight: bold;
  margin-left:5px;
`;

const AboutContainer = styled.View`
    align-items: center;
    height:100px;
    width:100%;
    padding:10px;
    border-radius:20px;
     shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;


  `;

const AboutText = styled(Text)`
   margin-top:5px;
   font-size: 14px;
    color: white;
    text-align: center;
    padding-horizontal: 16px;
    line-height: 20px;
  `

const ProfileImage = styled(Image)`
    width: 150px;
    height: 150px;
    border-radius: 70px;
    margin-bottom: 10px;
  `;

const ProfileName = styled(Text)`
    font-size: 28px;
    font-weight: bold;
    color: white;
  `;

const ProfileType = styled(Text)`
    font-size: 16px;
    color: #888;
    margin-top: 5px;
    margin-bottom: 10px;
  `;


const InfoContainer = styled.View`
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 10px;
    width:80%

  `;


const InfoRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
  `;

const InfoLabel = styled(Text)`
    font-size: 16px;
    color: #888;
  `;

const InfoValue = styled(Text)`
    font-size: 16px;
  `;

const RatingContainer = styled.View`
    flex-direction: row;
  `;

const Star = styled(Text)`
    font-size: 16px;
    color: #ffd700;
  `;

const StyledText = styled(Text)`
  align-self: stretch;
  margin-bottom: 10px;
  padding: 5px;
  font-size: 16px;

  border-color: #dfdfe5;
  color: #000;
`;


const AboutMainText = styled(Text)`
 font-size:24px;
  color: #000;
   font-weight: bold;
  color: #333;
  margin-bottom:5px;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
`;


const Stat = styled.View`
  padding:10px;
  align-items: center;
`;

const StatLabel = styled.Text`
  color: #999;
  font-size: 17px;

`;

const StatValue = styled.Text`
  font-size: 28px;
  color: white;
`;

const StatValueC = styled.Text`
color: white;
  font-size: 26px;
`;

export default Account;
