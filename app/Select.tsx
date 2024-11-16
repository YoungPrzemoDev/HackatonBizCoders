import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenheight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Select = () => {
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

  const fadeAnimLeft = useRef(new Animated.Value(1)).current;  
  const fadeAnimRight = useRef(new Animated.Value(0.2)).current; 
  const fadeAnimRight2 = useRef(new Animated.Value(0.3)).current;
  
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        // Sekwencja 1
        Animated.parallel([
          Animated.timing(fadeAnimLeft, {
            toValue: 0.8, 
            duration: 1300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimRight, {
            toValue: 1, 
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimRight2, {
            toValue: 0.5, 
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        // Sekwencja 2
        Animated.parallel([
          Animated.timing(fadeAnimLeft, {
            toValue: 0.6, // Mniejszy skok wartości
            duration: 1300, // Dopasowanie czasu do płynności
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimRight, {
            toValue: 0.3, // Zmniejszenie skoku
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimRight2, {
            toValue: 1, 
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        // Sekwencja 3
        Animated.parallel([
          Animated.timing(fadeAnimLeft, {
            toValue: 0.7, // Płynne przejście
            duration: 1100,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimRight, {
            toValue: 0.4, 
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimRight2, {
            toValue: 0.2, 
            duration: 1000,
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


  const handleInvestorClick = async () => {
    try {
      await AsyncStorage.setItem('userRole', 'investor');
      router.push('/RegisterBusinessman');
    } catch (error) {
      console.error('Error saving user role:', error);
    }
  };

  // Funkcja obsługi kliknięcia dla biznesmena
  const handleBusinessmanClick = async () => {
    try {
      await AsyncStorage.setItem('userRole', 'businessman');
      router.push('/RegisterBusinessman');
    } catch (error) {
      console.error('Error saving user role:', error);
    }
  };
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
             // style={{ opacity: fadeAnimLeft }}
            />
            </TouchableOpacity>
              <Label>Scientist</Label>
          </LeftContainer>
          <RightContainer>
          <TouchableOpacity onPress={handleInvestorClick}>
            <AnimatedRightImage2
              source={require('../assets/images/invest2.png')}
              resizeMode="contain"
           //   style={{ opacity: fadeAnimRight2 }}
            />
             </TouchableOpacity>
            <Label>Investor</Label>
          </RightContainer>
          <RightContainer2>
          <TouchableOpacity onPress={handleBusinessmanClick}>
            <AnimatedRightImage
              source={require('../assets/images/biz2.png')}
              resizeMode="contain"
              //style={{ opacity: fadeAnimLeft }}
            />
             </TouchableOpacity>
            <Label>Businessman</Label>
          </RightContainer2>

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
  width:100%;
   justify-content: center;
  flex-direction: row;
`;
  //background-color: red;
const LeftContainer = styled.View`
  margin-left:20px;
  width: 33.3r%;
  height: 100%;
  align-items: center;
`;
//background-color: blue;
const RightContainer = styled.View`
  
  width: 33.3%;
  height: 100%;
  align-items: center;
`;

//background-color: pink;
const RightContainer2 = styled.View`
  
  width: 33.3%;
  height: 100%;
  align-items: center;
`;

const AnimatedLeftImage = styled(Animated.Image)`
  width: 100px;
  height: 200px;

`;

const AnimatedRightImage = styled(Animated.Image)`
  width: 220px;
  height: 200px;
`;

const AnimatedRightImage2 = styled(Animated.Image)`
  width: 400px;
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
