import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { router } from 'expo-router';
const screenheight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Select = () => {
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

  const fadeAnimLeft = useRef(new Animated.Value(1)).current;  
  const fadeAnimRight = useRef(new Animated.Value(0.2)).current; 

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnimLeft, {
            toValue: 0.3, 
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimRight, {
            toValue: 1, 
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnimLeft, {
            toValue: 1, 
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimRight, {
            toValue: 0.2, 
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    blink.start(); 

    const handleResize = () => {
      const window = Dimensions.get('window');
      setWindowDimensions(window);
    };

    const subscription = Dimensions.addEventListener('change', handleResize);

    return () => {
      subscription?.remove();
      blink.stop(); 
    };
  }, [fadeAnimLeft, fadeAnimRight]);

  return (
    <Container>
      <MainContainer>
        <TopContainer>
          <Title>Choose your account type</Title>
        </TopContainer>
        <DownContainer>
          <LeftContainer>
          <TouchableOpacity onPress={() => router.push('/RegisterScientist')}>
            <AnimatedLeftImage
              source={require('../assets/images/na.jpg')}
              resizeMode="contain"
              style={{ opacity: fadeAnimLeft }}
            />
            </TouchableOpacity>
              <Label>Scientist</Label>
          </LeftContainer>
          <RightContainer>
          <TouchableOpacity onPress={() => router.push('/RegisterBusinessman')}>
            <AnimatedRightImage
              source={require('../assets/images/biz2.png')}
              resizeMode="contain"
              style={{ opacity: fadeAnimRight }}
            />
             </TouchableOpacity>
            <Label>Businessman</Label>
          </RightContainer>
        </DownContainer>
      </MainContainer>
    </Container>
  );
};


const Container = styled.View`
  flex: 1;
  background-color: red;
  align-items: center;
  justify-content: center;
   background-color: #e5e4e2;;
`;
const Title = styled.Text`
  font-size: ${screenWidth > 1024 ? '34px' : screenWidth > 768 ? '30px' : '30px'};
  font-weight: bold;
   color: #00488b;
  margin-bottom: 20px;
  text-align: center;
  
`;

const MainContainer = styled.View`
  width: ${screenWidth > 1024 ? '600px' : screenWidth > 768 ? '300px' : '100%'};
  height: 100%;
  background-color: #e5e4e2;
`;

const TopContainer = styled.View`
background-color: #e5e4e2;
margin-top: ${screenheight > 1024 ? '300px' : screenheight > 768 ? '300px' : '150px'};
`;


const DownContainer = styled.View`
  width: ${screenWidth > 1024 ? '600px' : screenWidth > 768 ? '300px' : '100%'};
  height: 100%;
  background-color: black;
  flex-direction: row;
`;

const LeftContainer = styled.View`
  background-color: #e5e4e2;
  width: 50%;
  height: 100%;
  align-items: center;
`;

const RightContainer = styled.View`
  background-color: #e5e4e2;
  width: 50%;
  height: 100%;
  align-items: center;
`;

const AnimatedLeftImage = styled(Animated.Image)`
  width: 150px;
  height: 200px;

`;

const AnimatedRightImage = styled(Animated.Image)`
  width: 300px;
  height: 200px;
`;

const Label = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-top: 5px; /* Odstęp od obrazów */
  text-align: center;
  margin-left:-5px;
  
`;

export default Select;
