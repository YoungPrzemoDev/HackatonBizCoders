import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  FlatList,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { styled } from "styled-components/native";

const { height, width } = Dimensions.get("window");

// Statyczne dane dla kart
const data = [
  {
    id: 1,
    image: [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
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
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
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
  background-color: #f7f7f7;
  align-self: center;
  margin-bottom: 10px;
`;

const CardImage = styled(Animated.Image)`
  width: 100%;
  height: 350px;
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

const Card = ({ card, cardIndex, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <CardContainer style={getCardStyle(cardIndex)}>
        <CardImage source={{ uri: card.image[0] }} />
        <CardDetails>
          <CardTitle>{card.name}</CardTitle>
          <CardDescription>{card.description}</CardDescription>
        </CardDetails>
      </CardContainer>
    </TouchableWithoutFeedback>
  );
};

const getCardStyle = (cardIndex) => {
  const animatedScale = new Animated.Value(1);
  const animatedWidth = animatedScale.interpolate({
    inputRange: [0.75, 1],
    outputRange: [width * 0.88, width],
  });

  return {
    width: animatedWidth,
    transform: [{ scale: animatedScale }],
  };
};

const ImageList = ({ cardIndex, onBackPress }) => {
  const selectedCard = data[cardIndex];
  return (
    <>
      <FlatList
        data={selectedCard.image}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <CardImage
            source={{ uri: item }}
            style={{
              width: width,
              height: 350,
            }}
          />
        )}
      />
      <Button title="Wróć do kart" onPress={onBackPress} />
    </>
  );
};

const cardSwiper = () => {
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null); // Do śledzenia rozszerzonej karty
  const [animationComplete, setAnimationComplete] = useState(false); // Śledzenie zakończenia animacji
  const animations = useRef(
    data.map(() => ({
      scale: new Animated.Value(0.75),
      borderRadius: new Animated.Value(30),
    }))
  ).current;

  const toggleExpandCard = (cardIndex: number) => {
    const selectedCardId = data[cardIndex].id;
    const isExpanded = expandedCardId === selectedCardId;

    Animated.parallel([
      Animated.timing(animations[cardIndex].scale, {
        toValue: isExpanded ? 0.75 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animations[cardIndex].borderRadius, {
        toValue: isExpanded ? 30 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (isExpanded) {
        setExpandedCardId(null);
      } else {
        setExpandedCardId(selectedCardId);
      }
    });
  };

  return (
    <MainContainer>
      {expandedCardId !== null ? (
        <ImageList
          cardIndex={expandedCardId - 1}
          onBackPress={() => setExpandedCardId(null)}
        />
      ) : (
        <Swiper
          cards={data}
          renderCard={(card, cardIndex) => (
            <Card
              key={card.id}
              card={card}
              cardIndex={cardIndex}
              onPress={() => toggleExpandCard(cardIndex)}
            />
          )}
          stackSize={3}
          backgroundColor={"#ffffff"}
          verticalSwipe={false}
          horizontalSwipe={expandedCardId === null}
          onTapCard={(cardIndex) => toggleExpandCard(cardIndex)}
        />
      )}
    </MainContainer>
  );
};

export default cardSwiper;
