import React, { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useNavigation } from "@react-navigation/native";
import { styled } from "styled-components/native";

// Statyczne dane dla kart
const data = [
  {
    id: 1,
    image: "https://via.placeholder.com/300",
    name: "Leanne Graham",
    description:
      "Full-time Traveller. Occasional Photographer. Part-time Singer/Dancer.",
    matchPercentage: "78%",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/300",
    name: "John Doe",
    description: "Mountain Climber. Guitar Player. Tech Enthusiast.",
    matchPercentage: "85%",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300",
    name: "Jane Smith",
    description: "Freelance Designer. Love yoga and dogs.",
    matchPercentage: "90%",
  },
];

const MainContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const CardContainer = styled.TouchableOpacity`
  flex: 0.75;
  border-radius: 20px;
  background-color: #ffffff;
  width: 90%;
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

const cardSwiper = () => {
  const navigation = useNavigation();
  const [expandedCardId, setExpandedCardId] = useState(null);

  const Card = ({ card }) => {
    const isExpanded = expandedCardId === card.id;

    return (
      <CardContainer
        onPress={() => setExpandedCardId(isExpanded ? null : card.id)}
      >
        <CardImage source={{ uri: card.image }} />
        {isExpanded ? (
          <ScrollView>
            <CardDetails>
              <CardTitle>{card.name}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
              <CardExtraDetails>{card.details}</CardExtraDetails>
            </CardDetails>
          </ScrollView>
        ) : (
          <CardDetails>
            <CardTitle>{card.name}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardDetails>
        )}
      </CardContainer>
    );
  };

  return (
    <MainContainer>
      <Swiper
        cards={data}
        renderCard={(card) => <Card key={card.id} card={card} />}
        stackSize={3}
        backgroundColor={"#f0f0f0"}
        verticalSwipe={false}
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
