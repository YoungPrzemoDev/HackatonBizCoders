import { db } from "@/config/FirebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Button,
  Text,
  View,
  ScrollView,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { styled } from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchProjects, ProjectData } from "../services/FirebaseService";
import { getRecommendation } from "../services/RecommenadtionService";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const { height, width } = Dimensions.get("window");

//let data: ProjectData[] = [];
let dataLoaded = false;

export const joinGroup = async (projectId: string, userId: string) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      members: arrayUnion(userId),
    });
    console.log(`User ${userId} added to project ${projectId}`);
    return true;
  } catch (error) {
    console.error("Error adding user to group:", error);
    return false;
  }
};

const fetchCurrentUserId = async () => {
  const auth = getAuth();
  const currentUserId = await AsyncStorage.getItem("userId");
  console.log("Fetched currentUserId:", currentUserId);
  return currentUserId || auth.currentUser?.uid || null;
};

const handleJoinGroup = async (cardId: string) => {
  const currentUserId = await fetchCurrentUserId();
  console.log("currentUserId:", currentUserId);
  console.log("cardId:", cardId);

  if (!currentUserId || !cardId) {
    console.error("Missing user ID or card ID");
    return;
  }

  const success = await joinGroup(cardId, currentUserId);
  if (success) {
    console.log("User successfully joined the group!");
  } else {
    console.error("Failed to join the group");
  }
};

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

const Card = ({ card, cardIndex, onPress, animations, projectId }) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <CardContainer style={getCardStyle(cardIndex, animations)}>
        <CardImage source={{ uri: card.image }} resizeMode={"stretch"} />
        <CardDetails>
          <CardTitle>{card.name}</CardTitle>
          <CardDescription>{card.description}</CardDescription>
        </CardDetails>
      </CardContainer>
    </TouchableWithoutFeedback>
  );
};
let callCount = 0;
const CardSwiper = () => {
  const [projectId, setProjectId] = useState<number>(1); // Initial project ID
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  //console.log("Dane przed przypisaniem:", data);
  const [visibleCards, setVisibleCards] = useState<ProjectData[]>([]);
  const [data, setData] = useState<ProjectData[]>([]);

  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const imageScale = useRef(new Animated.Value(1)).current;

  const [animations, setAnimations] = useState([]);

  console.log("Jestem w swiper");

  useEffect(() => {
    // Fetch projects when the component mounts
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        console.log(userId);
        const recommendation = await getRecommendation(userId);
        console.log(recommendation);
        console.log("jdksfhdkjhgfkdjhsgjkdhgkjSshgkdjh");
        const fetchedData: ProjectData[] = await fetchProjects();
        //useState(data); // Set fetched data as visible cards
        //console.log(fetchedData)
        //sortowanie
        console.log(
          "Before sorting:",
          fetchedData.map((item) => item.id)
        );

        const sortedData = await Promise.all(
          fetchedData.map(async (item) => {
            // Dla każdego elementu `fetchedData` pobieramy asynchronicznie jego indeks z `recommendation`
            const index = await recommendation.indexOf(item.id);
            return { ...item, index }; // Dodajemy indeks jako nową właściwość obiektu
          })
        );

        // Teraz, gdy mamy indeksy, sortujemy elementy synchronicznie
        sortedData.sort((a, b) => a.index - b.index);
        const finalSortedData = sortedData.map(({ index, ...item }) => item);

        for (let index = 0; index < finalSortedData.length; index++) {
          const element = finalSortedData[index];
          console.log("ID:", element.id);
          console.log("Tittle", element.name);
          console.log("Key partners:", element.keyPartners);
          console.log("------------------------------------------");
        }
        console.log(
          "After sorting:",
          finalSortedData.map((item) => item.id)
        );

        ////////
        setData(finalSortedData);
        setVisibleCards(finalSortedData);
        //console.log(sortedData);
      } catch (error) {
        console.error("Error fetching projects on mount:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setAnimations(
        data.map(() => ({
          scale: new Animated.Value(0.75),
          borderRadius: new Animated.Value(30),
        }))
      );
    }
  }, [data]);

  // const animations = useRef(
  //   data.map(() => ({
  //     scale: new Animated.Value(0.75),
  //     borderRadius: new Animated.Value(30),
  //   }))
  // ).current;

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
    console.log("INdex przekazywany z karty!!!", cardIndex);
    if (cardIndex < 0 || cardIndex >= visibleCards.length) return;
    console.log("222INdex przekazywany z karty!!!", cardIndex);
    const card = data[cardIndex];
    console.log(card);
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
      setExpandedCardId(isExpanded ? null : callCount);
      console.log("Liczba wywołań toggleExpandCard:", callCount);
    });
  };

  const handleCardSwipe = (cardIndex: number) => {
    if (cardIndex < 0 || cardIndex >= visibleCards.length) return;
    const cardId = visibleCards[cardIndex].id;
    setVisibleCards((currentCards) =>
      currentCards.filter((card) => card.id !== cardId)
    );

    callCount += 1;
  };

  const ImageList = ({
    cardIndex,
    onBackPress,
  }: {
    cardIndex: number;
    onBackPress: () => void;
  }) => {
    console.log("INdexxxxxxxx w imagelist:", cardIndex);
    const selectedCard = data[cardIndex];
    // console.log("ID:",selectedCard.id);
    // console.log("Tittle",selectedCard.name);
    // console.log("Key partners:",selectedCard.keyPartners);
    // console.log("------------------------------------------")

    // console.log("ImageList",cardIndex);
    // console.log("IDX",selectedCard.id);

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
            <MainContainer2>
              <TopContainer>
                <NameText>{selectedCard.name}</NameText>
              </TopContainer>
              <StyledScrollView>
                <InfoContainer>
                  <TitleText>Key partners </TitleText>
                  <SectionText> {selectedCard.keyPartners} </SectionText>
                </InfoContainer>
                <InfoContainer>
                  <TitleText>Key activities </TitleText>
                  <SectionText> {selectedCard.keyActivities} </SectionText>
                </InfoContainer>
                <InfoContainer>
                  <TitleText>Key resources </TitleText>
                  <SectionText> {selectedCard.keyResources} </SectionText>
                </InfoContainer>
                <InfoContainer>
                  <TitleText>Value proposition </TitleText>
                  <SectionText> {selectedCard.valuePropositions} </SectionText>
                </InfoContainer>
                <InfoContainer>
                  <TitleText>Customer relationships </TitleText>
                  <SectionText>
                    {" "}
                    {selectedCard.customerRelationships}{" "}
                  </SectionText>
                </InfoContainer>
                <InfoContainer>
                  <TitleText>Chanels </TitleText>
                  <SectionText> {selectedCard.channels} </SectionText>
                </InfoContainer>
                <InfoContainer>
                  <TitleText>Customer segments </TitleText>
                  <SectionText> {selectedCard.customerSegments} </SectionText>
                </InfoContainer>
                <InfoContainer>
                  <TitleText>Cost structure </TitleText>
                  <SectionText> {selectedCard.costStructure} </SectionText>
                </InfoContainer>
                <InfoContainer>
                  <TitleText>Revenue Streams </TitleText>
                  <SectionText> {selectedCard.revenueStreams} </SectionText>
                </InfoContainer>
              </StyledScrollView>
            </MainContainer2>

            <StyledButton onPress={onBackPress}>
              <StyledButtonText>Wróć do kart</StyledButtonText>
            </StyledButton>
          </>
        )}
      </>
    );
  };

  const [currentCardID, setCurrentCardID] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const handleRightSwipe = (cardIndex: number) => {
    if (cardIndex < 0 || cardIndex >= visibleCards.length) return;

    const projectId = visibleCards[cardIndex].id;
    setCurrentCardID(projectId);

    handleCardSwipe(cardIndex);
    setShowOverlay(true);
    animateButtons();
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    resetAnimationsForButtonAndText();
  };

  const [textAnimations, setTextAnimations] = useState([
    new Animated.Value(-width),
    new Animated.Value(-width),
  ]);

  const [buttonAnimations, setButtonAnimations] = useState([
    new Animated.Value(width),
    new Animated.Value(width),
  ]);

  const resetAnimationsForButtonAndText = () => {
    // Reset buttons to off-screen (right side)
    buttonAnimations.forEach((anim) => anim.setValue(width));

    // Reset text opacity and position
    textAnimations.forEach((anim) => anim.setValue(-width));
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
          duration: 200,
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
            cardIndex={expandedCardId} //tu sie podaje numer projektu id a nie index i zmienia sie indeks
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
                        console.log(currentCardID);
                        handleJoinGroup(currentCardID);
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
                              outputRange: [-width, 0],
                            }),
                          },
                        ],
                      }}
                    >
                      Join the group
                    </AnimatedText>
                  </Animated.View>

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
                        console.log(currentCardID);
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
                              outputRange: [-width, 0],
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
function setVisibleCards(projectData: { id: string }[]) {
  throw new Error("Function not implemented.");
}

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
  flex: 1;
  background-color: #eeeff0;
  align-items: center;
  justify-content: center;
`;

const TopContainer = styled.View`
  background-color: #eeeff0;
  align-items: center;
  justify-content: center;
`;
const StyledScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
    paddingTop: 35,
  },
}))`
  flex: 1;
  background-color: #eeeff0;
`;

const InfoContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 90%;
  padding: 20px;
  background-color: red;
  background-color: #ffffff;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  border-radius: 20px;
  margin-top: 15px;
`;

const NameText = styled.Text`
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  margin-top: 60px;
  color: black;
`;

const DescriptionText = styled.Text`
  font-size: 28spx;
  text-align: center;
  margin-bottom: 5px;
`;

const TitleText = styled.Text`
  font-weight: bold;
  font-size: 26px;
  text-align: center;
  margin-bottom: 5px;
  color: black;
`;

const SectionText = styled.Text`
  font-size: 15px;
  text-align: center;
  margin-bottom: 5px;
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
