import { useState, useEffect } from "react";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Text, TouchableOpacity, ImageBackground } from "react-native";
import styled from "styled-components/native";

const screenheight = Dimensions.get('window').height;

const Home = () => {
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {
    const handleResize = () => {
      const window = Dimensions.get("window");
      setWindowDimensions(window); 
    };

    const subscription = Dimensions.addEventListener("change", handleResize);

    return () => {
      subscription?.remove(); 
    };
  }, []);

  const { height, width } = windowDimensions; 

  return (
    <Container>
      <StyledImageBackground source={require('../assets/images/tlo.jpg')} style={{ width, height }}>
        <MainContent>
          <Binder>Binder</Binder>
          <Title>Invest in the Future. Create with Passion.</Title>
          <Subtitle>
            Give your innovations the chance to succeed. Whether you’re a scientist, entrepreneur, or investor – together, we create the future.
          </Subtitle>
          <ButtonsContainer>
            <PrimaryButton onPress={() => router.push('/Stories')}>
              <PrimaryButtonText>Get started</PrimaryButtonText>
            </PrimaryButton>
            <LearnMoreButton onPress={() => router.push('/Login')}>
              <LearnMoreText>Login→</LearnMoreText>
            </LearnMoreButton>
          </ButtonsContainer>
        </MainContent>
      </StyledImageBackground>
    </Container>
  );
};


const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const StyledImageBackground = styled.ImageBackground`
  flex: 1;
  resize-mode: cover;
  justify-content: center;
`;

const MainContent = styled.View`
  flex: 1;
  padding: 32px;
  align-items: center;
  margin-top: ${screenheight > 1024 ? '100px' : screenheight > 768 ? '100px' : '10px'};
`;

const Binder = styled.Text`
  font-size: 46px;
  color: #00a0ff;
  text-align: center;
  margin-top: 16px;
  padding-horizontal: 32px;
  font-weight: bold;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-top: 10px;
`;

const Subtitle = styled.Text`
  font-size: 22px;
  color: white;
  text-align: center;
  margin-top: 16px;
  padding-horizontal: 32px;
  line-height: 40px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  margin-top: 16px;
`;

const PrimaryButton = styled.TouchableOpacity`
  background-color: #00a0ff;
  padding-vertical: 12px;
  padding-horizontal: 24px;
  border-radius: 8px;
  margin-right: 16px;
`;

const PrimaryButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const LearnMoreButton = styled.TouchableOpacity``;

const LearnMoreText = styled.Text`
  font-size: 16px;
  color: #4F46E5;
`;

export default Home;
