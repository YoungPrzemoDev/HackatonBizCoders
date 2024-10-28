import { View, Text } from 'react-native'
import React from 'react'
import CardSwiper from '../../components/CardSwiper';
import { styled } from "styled-components/native";

const MainContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
`;

export default function home() {
  return (
    <MainContainer>
      <CardSwiper/>
    </MainContainer>
  )
}
