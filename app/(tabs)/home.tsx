import { View, Text } from 'react-native'
import CardSwiper from '../../components/CardSwiper';
import { styled } from "styled-components/native";
import { getRecommendation } from "../../services/RecommenadtionService";
import React, { useState, useEffect } from "react";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "../../config/FirebaseConfig";
import { router } from "expo-router";
import Account from '../Account';
import Dashbords from '../Dashbords';

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

const home = () => {

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


    return(
        <MainContainer>
            {userData?.userType === 'Businessman' ? <Dashbords /> : <CardSwiper />}
        </MainContainer>
    )
};

const MainContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
`;


export default home;