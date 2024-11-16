import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styled } from "styled-components/native";
import { getRecommendation } from "../../services/RecommenadtionService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listenToNotification } from "../services/notificationService"
import Toast from 'react-native-toast-message';
import Dashbords from '../Dashbords';
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import CardSwiper from '@/components/CardSwiper';


const MainContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
`;

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

export default  function home() {

  const [userId, setUserId] = useState(null);
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
  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          console.log("Fetched userId:", storedUserId);
        } else {
          console.log("No userId found in AsyncStorage.");
        } 
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    fetchUserId();
  }, [])

  useEffect(() => {
    console.log("UserId to listenNotification: ", userId);
    const unsubscribe = listenToNotification(userId);

    return () => {
      unsubscribe();
    };
  }, [userId]);

  console.log("Jestem w homie")
  // const userId =  AsyncStorage.getItem('userId');
  // console.log(userId);
  // const recommendation =  getRecommendation(5);




  return (
    <MainContainer>
      {userData?.userType === 'Businessman' ? <Dashbords /> : <CardSwiper />}
      <Toast />
    </MainContainer>
  )
}
