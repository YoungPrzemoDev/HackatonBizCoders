import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, Image, View, Text, StyleSheet, Button, Dimensions, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const Stories = () => {
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(Dimensions.get('window'));
    };


    const subscription = Dimensions.addEventListener('change', handleResize);

    return () => {
      subscription?.remove(); 
    };

  }, []);

  const { height, width } = windowDimensions; 

  const onDone = () => {
    router.push('/Select');
  };

  const onSkip = () => {
    router.push('/Select');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={{ height: height, width: width }}>
    <View style={[styles.slide, { backgroundColor: item.backgroundColor, height }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={item.image} style={[styles.image, { width: width * 0.7, height: height * 0.4 }]} />
      <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      showSkipButton={true}
      onSkip={onSkip}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  text: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  image: {
    marginVertical: 20,
    borderRadius: 5,
    resizeMode: 'contain',
  },
});

const slides = [
  {
    key: '1',
    title: 'Welcome to the Binder',
    text: 'Our platform brings together innovators, entrepreneurs, and investors to turn bold ideas into reality. Here’s how it works.',
    image: require('../assets/images/team-management.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: '2',
    title: 'Submit Ideas',
    text: 'Scientists and innovators present their cutting-edge projects.',
    image: require('../assets/images/teacher.png'),
    backgroundColor: '#febe29',
  },
  {
    key: '3',
    title: 'Collaborate',
    text: 'Entrepreneurs and investors explore these ideas and join forces.',
    image: require('../assets/images/business.png'),
    backgroundColor: '#ff5e3a',
  },
  {
    key: '4',
    title: 'Fund & Grow',
    text: 'With the right support, ideas become reality.',
    image: require('../assets/images/increase.png'),
    backgroundColor: '#b4df59',
  },
];

export default Stories;
