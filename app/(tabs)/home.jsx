import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import CardSwiper, { fetchCurrentUserId } from '../../components/CardSwiper';
import { styled } from "styled-components/native";
import {fetchProjectsOutsideComponent} from '../../components/CardSwiper'
import { getRecommendation } from "../../services/RecommenadtionService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listenToNotification } from "../services/notificationService"
import Toast from 'react-native-toast-message';

const MainContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
`;

export default  function home() {

  const [userId, setUserId] = useState(null);

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
      <CardSwiper/>
      <Toast />
    </MainContainer>
  )
}
