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
  Dimensions
} from "react-native";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "../config/FirebaseConfig";
import styled from "styled-components/native";
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
  const [userData, setUserData] = useState<UserData | null>(null); // Use UserData interface or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the userId from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');

        if (!userId) {
          console.log("No user ID found in AsyncStorage");
          return;
        }

        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData); // Use type assertion here
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
    // <View style={styles.container}>
    //   <Text style={styles.text}>ID: {userData?.id ?? "N/A"}</Text>
    //   <Text style={styles.text}>First Name: {userData?.firstName ?? "N/A"}</Text>
    //   <Text style={styles.text}>Last Name: {userData?.lastName ?? "N/A"}</Text>
    //   <Text style={styles.text}>Email: {userData?.email ?? "N/A"}</Text>
    //   <Text style={styles.text}>Login: {userData?.login ?? "N/A"}</Text>
    //   <Text style={styles.text}>Password: {userData?.password ?? "N/A"}</Text>
    //   <Text style={styles.text}>User Type: {userData?.userType ?? "N/A"}</Text>
    // </View>

    <Container>
      <CenterContainer>
        <ProfileContainer>
          <ProfileImage
                source={require('../assets/images/suj.jpg')} />
          <ProfileName>
            <StyledText>
              {userData?.firstName ?? "N/A"} {userData?.lastName ?? "N/A"}
            </StyledText>
          </ProfileName>
          <ProfileType>
            {userData?.userType ?? "N/A"}
          </ProfileType>

          <AboutContainer>
          <AboutMainText> About me</AboutMainText>
          <AboutText>
            {userData?.about ?? "N/A"}
          </AboutText>
        </AboutContainer>
          {/* <StatsContainer>
            <Stat>
              <StatLabel>Project</StatLabel>
              <StatValue>13</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Following</StatLabel>
              <StatValue>123</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Chats</StatLabel>
              <StatValue>43</StatValue>
            </Stat>
          </StatsContainer> */}
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
        </UnderProfile>
        {/* <AboutContainer>
          <AboutText>
            {userData?.about ?? "N/A"}
          </AboutText>
        </AboutContainer> */}
  
        {/* <InfoContainer>
          <InfoRow>
            <InfoLabel>Age</InfoLabel>
            <InfoValue>20-30 Years Old</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Gender</InfoLabel>
            <InfoValue>Male</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Joined</InfoLabel>
            <InfoValue>March 04, 2023</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Location</InfoLabel>
            <InfoValue>Alger, Canada</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Reviews</InfoLabel>
            <RatingContainer>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index}>{index < 3 ? '★' : '☆'}</Star>
              ))}
            </RatingContainer>
          </InfoRow>
        </InfoContainer> */}
      </CenterContainer>
    </Container>
  );
};

const Container = styled(ScrollView).attrs({
  contentContainerStyle: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
})`
    background-color: #ced0d2;
  `;

const CenterContainer = styled.View`
   
     width:  ${screenWidth > 768 ? '600px' : '100%'};
     background-color: #eeeff0;
     height:100%;
     align-items: center;
     padding-top:20px;
     border-radius:20px;
     border:1px;
  `;


const ProfileContainer = styled.View`
    align-items: center;
    padding: 20px;
    width:85%;
    margin-top:80px;
    border-radius:20px;
    background-color:#ffffff;
     shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
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

const RowElement = styled.TouchableOpacity`
flexDirection:row;
background-color:#ffffff;
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

  const RowInfo = styled.View`
  margin-left:20px;
  width:50pxs;
  height:100%;
  border-radius:20px;
   justifyContent:center;
   align-items: center;
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
   font-size: 14px;
    color: black;
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
    font-size: 24px;
    font-weight: bold;
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
 font-size:26px;
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
`;

export default Account;
