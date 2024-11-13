import { View, Text } from 'react-native'
import React from 'react'
import CardSwiper from '../../components/CardSwiper';
import { styled } from "styled-components/native";
import {fetchProjectsOutsideComponent} from '../../components/CardSwiper'
import { getRecommendation } from "../../services/RecommenadtionService";
const MainContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
`;

export default  function home() {

  console.log("Jestem w homie")
  //const userId =  AsyncStorage.getItem('userId');
  //console.log(userId);
  // const recommendation =  getRecommendation(5);




  return (
    <MainContainer>
      <CardSwiper/>
    </MainContainer>
  )
}
