import React, { useState, useRef } from "react";
import { SafeAreaView, TouchableWithoutFeedback, Text, ActivityIndicator } from "react-native";
import Swiper from "react-native-deck-swiper";
import { styled } from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";

const Card = ({ card, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <CardContainer>
        <CardDetails>
          <CardTitle>{card.name}</CardTitle>
        </CardDetails>
      </CardContainer>
    </TouchableWithoutFeedback>
  );
};

const CardSwiper = () => {
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [cards, setCards] = useState([
    { id: "1", name: "Card 1"},
    { id: "2", name: "Card 2"},
    { id: "3", name: "Card 3"},
  ]);

  const toggleExpandCard = (cardId) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

  return (
    <MainContainer>
      {cards.length > 0 ? (
        expandedCardId ? (
          <ExpandedCard>
            <Text style={{ color: "white" }}>Expanded Card: {expandedCardId}</Text>
            <StyledButton onPress={() => setExpandedCardId(null)}>
              <StyledButtonText>Back to Cards</StyledButtonText>
            </StyledButton>
          </ExpandedCard>
        ) : (
          <Swiper
            cards={cards}
            renderCard={(card) => (
              <Card
                key={card.id}
                card={card}
                onPress={() => toggleExpandCard(card.id)}
              />
            )}
            stackSize={3}
            backgroundColor={"#27272a"}
            verticalSwipe={false}
          />
        )
      ) : (
        <ActivityIndicator size="large" color="#007bff" />
      )}
    </MainContainer>
  );
};

export default CardSwiper;

const MainContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #44403c;
  justify-content: center;
`;

const CardContainer = styled.View`
  border-radius: 20px;
  background-color: #3f3f46;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  align-self: center;
  width: 90%;
  min-height: 80%;
`;


const CardDetails = styled.View`
  padding: 20px;
`;

const CardTitle = styled.Text`
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
  color: white;
`;

const ExpandedCard = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #111111;
  padding: 10px 20px;
  border-radius: 25px;
  align-self: center;
  position: absolute;
  bottom: 20px;
`;

const StyledButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;
