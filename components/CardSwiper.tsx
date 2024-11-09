import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  FlatList,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Button,
  Text,
  View,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { styled } from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";
const { height, width } = Dimensions.get("window");

// Statyczne dane dla kart
const data = [
  {
    id: 1,
    image: [
      "https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg",
      "https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg",
      "https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg",
    ],
    name: "Leanne Graham",
    description:
      "Full-time Traveller. Occasional Photographer. Part-time Singer/Dancer.",
    matchPercentage: "78%",
  },
  {
    id: 2,
    image: [
      "https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg",
      "https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg",
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
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/300",
    ],
    name: "Jane Smith",
    description: "Freelance Designer. Love yoga and dogs.",
    matchPercentage: "90%",
  },
];

const StyledText = styled.Text`
  color: red;
  text-align: center;
  font-size: large;
  font-weight: bold;
  margin-top: 200px;
  margin-bottom: 60px;
`;
//gdy karta znika
const MainContainer = styled.View`
  flex: 1;
  background-color: white;
  justify-content: center;
`;

const MainContainer2 = styled.View`
  background-color: white;
  justify-content: center;
  width: 95%;
  height: 95%;
`;

//dol karty
const CardContainer = styled(Animated.View)`
  border-radius: 50px;
  background-color: #ffffff;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  align-self: center;
  margin-top: -50px;
  bordercolor: #ffffff;
`;

const CardImage = styled(Animated.Image)`
  height: 450px;
  width: 100%;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
`;

const CardDetails = styled.View`
  padding: 20px;
`;

const CardTitle = styled.Text`
  font-size: 44px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
`;

const CardDescription = styled.Text`
  font-size: 24px;
  text-align: center;
  color: #6b7280;
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
  color: #fff; /* Biały tekst */
  font-weight: bold;
  font-size: 16px;
`;

const OverlayContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
`;

const ButtonContainer = styled.View`
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-left: 20px;
  padding-top: 10px;
`;

const RoundButtonContainer = styled.TouchableOpacity`
  background-color: #3498db;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border-width: 2px;
  border-style: solid;
  border-color: #265676;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
`;

const AnimatedText = styled(Animated.Text)`
  color: #87accb;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-left: 10px;
  position: absolute;
  top: 20px;
  margin-left: 10px;
`;

const getCardStyle = (cardIndex, animations) => {
  const animatedScale = animations[cardIndex].scale;

  const animatedHeight = animatedScale.interpolate({
    inputRange: [0.75, 1],
    outputRange: [height * 0.9, height],
  });
  const animatedWidth = animatedScale.interpolate({
    inputRange: [0.75, 1],
    outputRange: [width * 1.1, width],
  });
  const animatedRadius = animatedScale.interpolate({
    inputRange: [0.75, 1],
    outputRange: [30, 1],
  });

  return {
    width: animatedWidth,
    height: animatedHeight,
    transform: [{ scale: animatedScale }],
    borderRadius: animatedRadius,
  };
};

const Card = ({ card, cardIndex, onPress, animations }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <CardContainer style={getCardStyle(cardIndex, animations)}>
        <CardImage source={{ uri: card.image[0] }} resizeMode={"stretch"} />
        <CardDetails>
          <CardTitle>{card.name}</CardTitle>
          <CardDescription>{card.description}</CardDescription>
        </CardDetails>
      </CardContainer>
    </TouchableWithoutFeedback>
  );
};

const CardSwiper = () => {
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState(data);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const imageScale = useRef(new Animated.Value(1)).current;

  const animations = useRef(
    data.map(() => ({
      scale: new Animated.Value(0.75),
      borderRadius: new Animated.Value(30),
    }))
  ).current;

  const resetAllAnimations = () => {
    animations.forEach((anim) => {
      Animated.parallel([
        Animated.timing(anim.scale, {
          toValue: 0.75,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(anim.borderRadius, {
          toValue: 30,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    });
  };

  const expandImage = (imageUri) => {
    setExpandedImage(imageUri);
    Animated.timing(imageScale, {
      toValue: 1.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const resetImage = () => {
    Animated.timing(imageScale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setExpandedImage(null);
    });
  };

  const toggleExpandCard = (cardIndex: number) => {
    if (cardIndex < 0 || cardIndex >= visibleCards.length) return;
    const card = visibleCards[cardIndex];
    const selectedCardId = card.id;
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
      setExpandedCardId(isExpanded ? null : selectedCardId);
    });
  };

  const handleCardSwipe = (cardIndex: number) => {
    if (cardIndex < 0 || cardIndex >= visibleCards.length) return;
    const cardId = visibleCards[cardIndex].id;
    setVisibleCards((currentCards) =>
      currentCards.filter((card) => card.id !== cardId)
    );
  };

  const ImageList = ({ cardIndex, onBackPress }) => {
    const selectedCard = data[cardIndex];
    return (
      <>
        {expandedImage ? (
          <TouchableWithoutFeedback onPress={resetImage}>
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              }}
            >
              <Animated.Image
                source={{ uri: expandedImage }}
                style={{
                  maxWidth: width,
                  maxHeight: height,
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                  transform: [{ scale: imageScale }],
                }}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        ) : (
          <>
            <FlatList
              data={selectedCard.image}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => expandImage(item)}>
                  <View
                    style={{
                      width: width,
                      height: 350,
                      backgroundColor: "black",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MainContainer2>
                      <Text>dasdas</Text>
                    </MainContainer2>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
            <StyledButton onPress={onBackPress}>
              <StyledButtonText>Wróć do kart</StyledButtonText>
            </StyledButton>
          </>
        )}
      </>
    );
  };

  const [showOverlay, setShowOverlay] = useState(false);

  const handleRightSwipe = (cardIndex: number) => {
    handleCardSwipe(cardIndex);
    setShowOverlay(true);
    animateButtons();
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    resetAnimationsForButtonAndText();
  };

  const [textAnimations, setTextAnimations] = useState([
    new Animated.Value(-100), // Start off-screen to the left
    new Animated.Value(-100),
  ]);

  const [buttonAnimations, setButtonAnimations] = useState([
    new Animated.Value(width),
    new Animated.Value(width),
  ]);

  const resetAnimationsForButtonAndText = () => {
    // Reset buttons to off-screen (right side)
    buttonAnimations.forEach((anim) => anim.setValue(width));

    // Reset text opacity and position
    textAnimations.forEach((anim) => anim.setValue(0));
  };

  const animateButtons = () => {
    buttonAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 20,
        duration: 500,
        delay: index * 200,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(textAnimations[index], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  return (
    <MainContainer>
      {visibleCards.length > 0 ? (
        expandedCardId !== null ? (
          <ImageList
            cardIndex={expandedCardId - 1}
            onBackPress={() => {
              resetAllAnimations();
              setExpandedCardId(null);
            }}
          />
        ) : (
          <>
            <Swiper
              key={visibleCards.length}
              cards={visibleCards}
              renderCard={(card, cardIndex) => (
                <Card
                  key={card.id}
                  card={card}
                  cardIndex={cardIndex}
                  animations={animations}
                  onPress={() => toggleExpandCard(cardIndex)}
                />
              )}
              stackSize={3}
              backgroundColor={"#eeeff0"}
              verticalSwipe={false}
              horizontalSwipe={expandedCardId === null}
              onTapCard={(cardIndex) => toggleExpandCard(cardIndex)}
              onSwipedLeft={(cardIndex) => {
                handleCardSwipe(cardIndex);
                console.log("Left Swipe", cardIndex);
              }}
              onSwipedRight={(cardIndex) => handleRightSwipe(cardIndex)}
            />
            {showOverlay && (
              <OverlayContainer>
                <ButtonContainer>
                  {/* Button 1: Join the group */}
                  <Animated.View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      transform: [{ translateX: buttonAnimations[0] }],
                      marginBottom: 20,
                    }}
                  >
                    <RoundButtonContainer
                      onPress={() => {
                        console.log("Join the group");
                        closeOverlay();
                      }}
                    >
                      <Icon name="people-outline" size={30} color="#fff" />
                    </RoundButtonContainer>
                    <AnimatedText
                      style={{
                        transform: [
                          {
                            translateX: textAnimations[0].interpolate({
                              inputRange: [0, 1],
                              outputRange: [-width, 0], // Slide in from the right
                            }),
                          },
                        ],
                      }}
                    >
                      Join the group
                    </AnimatedText>
                  </Animated.View>

                  {/* Button 2: Add to favorites */}
                  <Animated.View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      transform: [{ translateX: buttonAnimations[1] }],
                      marginTop: 20,
                    }}
                  >
                    <RoundButtonContainer
                      onPress={() => {
                        console.log("Add to favorites");
                        closeOverlay();
                      }}
                    >
                      <Icon name="heart-outline" size={30} color="#fff" />
                    </RoundButtonContainer>
                    <AnimatedText
                      style={{
                        transform: [
                          {
                            translateX: textAnimations[1].interpolate({
                              inputRange: [0, 1],
                              outputRange: [-width, 0], // Slide in from the right
                            }),
                          },
                        ],
                      }}
                    >
                      Add to favorites
                    </AnimatedText>
                  </Animated.View>
                </ButtonContainer>
              </OverlayContainer>
            )}
          </>
        )
      ) : (
        <StyledText>Brak więcej kart do wyświetlenia.</StyledText>
      )}
    </MainContainer>
  );
};

export default CardSwiper;
