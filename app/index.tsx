import React, { useState, useReducer, useRef } from "react";
import { SafeAreaView, ScrollView, Dimensions, Animated } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useNavigation } from "@react-navigation/native";
import { styled } from "styled-components/native";

const { height, width } = Dimensions.get("window"); // Get both height and width of the screen

// Statyczne dane dla kart
const data = [
  {
    id: 1,
    image: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/400",
      "https://via.placeholder.com/500",
    ],

    name: "Leanne Graham",
    description:
      "Full-time Traveller. Occasional Photographer. Part-time Singer/Dancer.",
    matchPercentage: "78%",
  },
  {
    id: 2,
    image: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/400",
      "https://via.placeholder.com/500",
    ],
    name: "John Doe",
    description: "Mountain Climber. Guitar Player. Tech Enthusiast.",
    matchPercentage: "85%",
  },
  {
    id: 3,
    image: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/400",
      "https://via.placeholder.com/500",
    ],
    name: "Jane Smith",
    description: "Freelance Designer. Love yoga and dogs.",
    matchPercentage: "90%",
  },
];

const MainContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const CardContainer = styled(Animated.View)`
  border-radius: 30px;
  background-color: #680f0f;
  align-self: center;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 65%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const CardDetails = styled.View`
  padding: 20px;
`;

const CardTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const CardDescription = styled.Text`
  font-size: 16px;
  color: #555;
`;

const CardExtraDetails = styled.Text`
  font-size: 16px;
  color: #333;
  margin-top: 10px;
`;

//1.useRef
//1.
const cardSwiper = () => {
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const animations = useRef(data.map(() => new Animated.Value(0.75))).current;

  const toggleExpandCard = (cardIndex: number) => {
    const isExpanded = expandedCardId === data[cardIndex].id;

    Animated.timing(animations[cardIndex], {
      toValue: isExpanded ? 0.75 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setExpandedCardId(isExpanded ? null : data[cardIndex].id);
  };

  const getCardStyle = (cardIndex: number) => {
    const animatedHeight = animations[cardIndex].interpolate({
      inputRange: [0.75, 0.85],
      outputRange: [height * 0.75, height], // Height in pixels
    });

    const animatedWidth = animations[cardIndex].interpolate({
      inputRange: [0.75, 1],
      outputRange: [width * 0.9, width], // Width in pixels
    });

    return {
      height: animatedHeight,
      width: animatedWidth,
      // marginHorizontal: animations[cardIndex].interpolate({
      //   inputRange: [0.75, 1],
      //   outputRange: [width * 0.05, 0], // Remove horizontal margin when expanded
      // }),
      // marginVertical: animations[cardIndex].interpolate({
      //   inputRange: [0.75, 1],
      //   outputRange: [height, 0], // Remove vertical margin when expanded
      // }),
    };
  };

  const Card = ({ card, cardIndex }) => {
    const isExpanded = expandedCardId === card.id;
    return (
      <CardContainer style={getCardStyle(cardIndex)}>
        <CardImage source={{ uri: card.image[0] }} />
        <CardDetails>
          <CardTitle>{card.name}</CardTitle>
          <CardDescription>{card.description}</CardDescription>
          {isExpanded && <CardExtraDetails>KURWAAAAA</CardExtraDetails>}
        </CardDetails>
      </CardContainer>
    );
  };

  return (
    <MainContainer>
      <Swiper
        cards={data}
        renderCard={(card, cardIndex) => (
          <Card card={card} cardIndex={cardIndex} />
        )}
        stackSize={3}
        backgroundColor={"#ffffff"}
        verticalSwipe={false}
        showSecondCard={true}
        animateCardOpacity={false}
        onTapCard={(cardIndex) => {
          toggleExpandCard(cardIndex);
          console.log("Tapped card ID:", cardIndex);
        }}
        onSwipedLeft={(cardIndex) => {
          console.log("Left Swipe", cardIndex);
        }}
        onSwipedRight={(cardIndex) => {
          console.log("Right Swipe", cardIndex);
        }}
      />
    </MainContainer>
  );
};

export default cardSwiper;
