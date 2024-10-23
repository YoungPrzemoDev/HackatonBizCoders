import React, { useState, useReducer, useRef } from "react";
import { SafeAreaView, FlatList, Dimensions, Animated } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useNavigation } from "@react-navigation/native";
import { styled } from "styled-components/native";

const { height, width } = Dimensions.get("window");

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
  background-color: #f7f7f7;
  align-self: center;
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

const CardExtraDetails = styled.Text`
  font-size: 16px;
  color: #333;
  margin-top: 10px;
`;

//1.useRef
//1.
const cardSwiper = () => {
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false); // Track animation completion
  const animations = useRef(
    data.map(() => ({
      scale: new Animated.Value(0.75),
      borderRadius: new Animated.Value(30),
    }))
  ).current;

  const toggleExpandCard = (cardIndex: number) => {
    const selectedCardId = data[cardIndex].id;
    const isExpanded = expandedCardId === selectedCardId;

    console.log("Currently expandedCardId:", expandedCardId);
    console.log("Selected Card ID:", selectedCardId);
    console.log("Is Expanded:", isExpanded);

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
      // Dopiero po zakończeniu animacji zmieniamy stan
      if (isExpanded) {
        setExpandedCardId(null);
      } else {
        setExpandedCardId(selectedCardId);
      }
    });
  };

  const getCardStyle = (cardIndex: number) => {
    const numberOfImages = data[cardIndex].image.length;
    const imageHeight = 350;
    const totalHeight = numberOfImages * imageHeight;

    const animatedHeight = animations[cardIndex].scale.interpolate({
      inputRange: [0.75, 1],
      outputRange: [height * 0.75, totalHeight], // sprawdz dodatkowe +200
    });

    const animatedWidth = animations[cardIndex].scale.interpolate({
      inputRange: [0.75, 1],
      outputRange: [width * 0.88, width],
    });

    return {
      height: animatedHeight,
      width: animatedWidth,
      borderRadius: animations[cardIndex].borderRadius,
      marginVertical: animations[cardIndex].scale.interpolate({
        inputRange: [0.75, 1],
        outputRange: [60, 0],
      }),
    };
  };

  const Card = ({ card, cardIndex }) => {
    const isExpanded = expandedCardId === card.id;

    console.log(`Card ${card.id} is ${isExpanded ? "expanded" : "collapsed"}`);
    console.log("Current expandedCardId:", expandedCardId);

    return (
      <CardContainer style={getCardStyle(cardIndex)}>
        {isExpanded ? (
          <>
            <FlatList
              data={card.image}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <CardImage
                  source={{ uri: item }}
                  style={{
                    borderTopLeftRadius: animations[cardIndex].borderRadius,
                    borderTopRightRadius: animations[cardIndex].borderRadius,
                  }}
                />
              )}
              ListHeaderComponent={
                <CardDetails>
                  <CardTitle>{card.name}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardDetails>
              }
            />
          </>
        ) : (
          <CardImage
            source={{ uri: card.image[0] }}
            style={{
              borderTopLeftRadius: animations[cardIndex].borderRadius,
              borderTopRightRadius: animations[cardIndex].borderRadius,
            }}
          />
        )}
        <CardDetails>
          <CardTitle>{card.name}</CardTitle>
          <CardDescription>{card.description}</CardDescription>
        </CardDetails>
      </CardContainer>
    );
  };

  return (
    <MainContainer>
      <Swiper
        cards={data}
        renderCard={(card, cardIndex) => (
          <Card key={card.id} card={card} cardIndex={cardIndex} />
        )}
        stackSize={3}
        backgroundColor={"#ffffff"}
        verticalSwipe={false}
        showSecondCard={true}
        animateCardOpacity={false}
        cardVerticalMargin={0}
        horizontalSwipe={expandedCardId === null} // Disable swipe when expanded
        onTapCard={(cardIndex) => {
          toggleExpandCard(cardIndex);
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
