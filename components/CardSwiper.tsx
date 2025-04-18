import { db } from "@/config/FirebaseConfig";
import { query, Timestamp, where } from "firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  addDoc,
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
  ActivityIndicator,
  Alert,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { styled } from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  addProjectUser,
  fetchProjects,
  ProjectData,
  fetchUserProjects,
} from "../services/FirebaseService";
import { UserInteraction } from "@/app/interfaces/User";
import {
  getRecommendation,
  sendInterraction,
} from "@/services/RecommenadtionService";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { addNotification } from "@/app/services/notificationService";
import { fetchTagsResponse6 } from "@/app/services/gptPromt";
import * as Progress from 'react-native-progress';
const { height, width } = Dimensions.get("window");

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

export const clickabilityGroup = async (projectId: string) => {
  try {
    const projectRef = doc(db, `projects/${projectId}/clickability/userActivity`);

    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      console.error("Project document does not exist!");
      return false;
    }

    const projectData = projectDoc.data();
    const addToGroup = projectData?.addToGroup || [];

    const lastValue = addToGroup.length > 0 ? addToGroup[addToGroup.length - 1] : 0;
    const newValue = lastValue + 1;

    await updateDoc(projectRef, {
      addToGroup: arrayUnion(newValue),
      addToGroupTime: arrayUnion(Timestamp.now())
    });

    return true;
  } catch (error) {
    console.error("Error adding user to group:", error);
    return false;
  }
};

export const clickabilityViewership = async (projectId: string) => {
  try {
    const projectRef = doc(db, `projects/${projectId}/clickability/userActivity`);

    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      console.error("Project document does not exist!");
      return false;
    }

    const projectData = projectDoc.data();
    const viewership = projectData?.viewership || [];

    const lastValue = viewership.length > 0 ? viewership[viewership.length - 1] : 0;
    const newValue = lastValue + 1;

    await updateDoc(projectRef, {
      viewership: arrayUnion(newValue),
      viewershipTime: arrayUnion(Timestamp.now())
    });

    return true;
  } catch (error) {
    console.error("Error adding user to group:", error);
    return false;
  }
};

export const clickabilityFavorities = async (projectId: string) => {
  try {
    const projectRef = doc(db, `projects/${projectId}/clickability/userActivity`);

    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      console.error("Project document does not exist!");
      return false;
    }

    const projectData = projectDoc.data();
    const addFav = projectData?.addFav || [];

    const lastValue = addFav.length > 0 ? addFav[addFav.length - 1] : 0;
    const newValue = lastValue + 1;

    await updateDoc(projectRef, {
      addFav: arrayUnion(newValue),
      addFavTime: arrayUnion(Timestamp.now())
    });

    return true;
  } catch (error) {
    console.error("Error adding user to group:", error);
    return false;
  }
};

const handleJoinFavorites = async (cardId: string) => {
  const currentUserId = await fetchCurrentUserId();

  if (!currentUserId || !cardId) {
    console.error("Missing user ID or card ID");
    return;
  }

  const success2 = await clickabilityFavorities(cardId);
  if (success2) {
    console.log("Card successfully joined the group!");
  } else {
    console.error("Failed to join the Card");
  }

};

export const fetchCurrentUserId = async () => {
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

  // const success = await joinGroup(cardId, currentUserId);
  // if (success) {
  //   console.log("User successfully joined the group!");
  // } else {
  //   console.error("Failed to join the group");
  // }

  await addNotification(currentUserId, cardId);
};





const Card = ({ card, cardIndex, onPress, animations }) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <CardContainer>
        <CardImage source={{ uri: card.image }} resizeMode={"stretch"} />
        <CardDetails>
          <CardTitle>{card.name}</CardTitle>
          <CardDescription>{card.description}</CardDescription>
        </CardDetails>
      </CardContainer>
    </TouchableWithoutFeedback>
  );
};
let counter = 0;
let callCount = 0;
const CardSwiper = () => {
  const [projectId, setProjectId] = useState<number>(1); // Initial project ID
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  //console.log("Dane przed przypisaniem:", data);
  const [visibleCards, setVisibleCards] = useState<ProjectData[]>([]);
  const [data, setData] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const imageScale = useRef(new Animated.Value(1)).current;
  const [userID, setUserID] = useState<string>(null);
  const [characters, setCharacters] = useState<any[]>([]); // Tablica na projekty z bazy
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // Stan dla modala
  const INITIAL_CARD_COUNT = 4;

  const [animations, setAnimations] = useState([]);

  console.log("Jestem w swiper");

  async function handleGenerateLongDescription1(prompts) {
    if (prompts && prompts.length) {
      try {
        const results = await Promise.all(
          prompts.map(prompt => fetchTagsResponse6(prompt)) // Pass each prompt to the fetch function
        );
        return results; // Array of results for each project
      } catch (error) {
        console.error("Error generating long descriptions:", error);
      }
    } else {
      Alert.alert("Warning", "Please provide prompts first.");
    }
  }

  async function updateProjectsWithInsights(db, projectsWithInsights) {
    try {
      for (const project of projectsWithInsights) {
        // Reference to the specific project document
        const projectDocRef = doc(db, "projects", project.id);
  
        // Update the document with the new `insight` field
        await updateDoc(projectDocRef, {
          insight: project.insight
        });
        return true;
        console.log(`Updated project ${project.id} with insight: ${project.insight}`);
      }
  
      console.log("All projects updated successfully!");
    } catch (error) {
      console.error("Error updating projects with insights:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        setUserID(userId);
        console.log(userId);
        const projectsRef = collection(db, "projects"); // Reference to the 'projects' collection
        const querySnapshot = await getDocs(projectsRef); // Get all documents from the collection

        const projects = querySnapshot.docs.map(doc => doc.data()); // Map over docs and get the data
        
        console.log(projects);

        const userRef = collection(db, "users"); // Reference to the 'projects' collection
        const q = query(userRef, where('id', '==', userId)); 
        const querySnapshot2 = await getDocs(q);
        const projectList = [];
        querySnapshot2.forEach((doc) => {
          projectList.push({
            about: doc.data().about,
            name: Array.isArray(doc.data().description) ? doc.data().description.join(", ") : doc.data().description
          });
        });

        const promptData = `About me: ${projectList[0].about}. Key points: ${projectList[0].name}.`;

        // Prepare a new prompt that incorporates project details
        const projectPrompts = projects.map(project => {
          const projectDetails = `Project name: ${project.name || project.description}. Long description: ${project.longDescription || "N/A"}`;
          return `${promptData} How can I help with this project, tell me this in one sentence? ${projectDetails}`;
        });

        console.log("Prepared Prompts for Projects:", projectPrompts);

        const results = await handleGenerateLongDescription1(projectPrompts);
        console.log("Results for Projects:", results);

        // Optionally associate results with projects
        const projectsWithInsights = projects.map((project, index) => ({
          ...project,
          insight: results[index] || "No insight generated"
        }));

        console.log("Projects with Insights:", projectsWithInsights);
        const x0 = await updateProjectsWithInsights(db, projectsWithInsights);
        console.log(x0);
        
        // const recommendation = await getRecommendation(userId);
        // console.log(recommendation);
        // console.log("jdksfhdkjhgfkdjhsgjkdhgkjSshgkdjh");
        const fetchedData: ProjectData[] = await fetchProjects();
        console.log(
          "Before sorting:",
          fetchedData.map((item) => item.id)
        );

        // const sortedData = await Promise.all(
        //   fetchedData.map(async (item) => {
        //     // Dla każdego elementu `fetchedData` pobieramy asynchronicznie jego indeks z `recommendation`
        //     const index = await recommendation.indexOf(item.id);
        //     return { ...item, index }; // Dodajemy indeks jako nową właściwość obiektu
        //   })
        // );

        // sortedData.sort((a, b) => a.index - b.index);
        // const finalSortedData = sortedData.map(({ index, ...item }) => item);
        // console.log(
        //   "xddd sorting:",
        //   finalSortedData.map((item) => item.id)
        // );
        setVisibleCards(fetchedData);
        setData(fetchedData);
        
        

        setIsLoading(false);
        console.log(fetchedData[0].id);

        //console.log(sortedData);
      } catch (error) {
        console.error("Error fetching projects on mount:", error);
      }
    };
    fetchData();
    setIsLoading(false);
  }, []);

  const swiped = async (direction: string, projectID: string) => {
    setLastDirection(direction);
    const userId = await AsyncStorage.getItem("userId");
    if (direction == "right") {
      //dodaenie wywietlonego projektu do firebase
      await addProjectUser(projectID, userId);
      console.log("Teraz Otwarty projekt ", projectID);
      setModalVisible(true);

      const project: ProjectData = data.find(
        (project) => project.id === projectID
      );
      const newInteraction: UserInteraction = {
        projectID: project.id,
        userId: userID,
      };
      console.log("Pisze co wysyłam", newInteraction);
      sendInterraction(newInteraction);
      console.log("wyszukany projekt", project.name);
      //usuwam projekt wyslany
      counter++;

      console.log("counter", counter);
      if (counter === INITIAL_CARD_COUNT) {
        //!!tutaj trzeba wlaczyc loading screen

        setIsLoading(true);
        const recommendation1 = await getRecommendation(userId);
        const fetchedData1: ProjectData[] = await fetchProjects();
        console.log(
          "Before sorting:",
          fetchedData1.map((item) => item.id)
        );

        const sortedData1 = await Promise.all(
          fetchedData1.map(async (item) => {
            // Dla każdego elementu `fetchedData` pobieramy asynchronicznie jego indeks z `recommendation`
            const index = await recommendation1.indexOf(item.id);
            return { ...item, index }; // Dodajemy indeks jako nową właściwość obiektu
          })
        );

        sortedData1.sort((a, b) => a.index - b.index);
        const finalSortedData1 = sortedData1.map(({ index, ...item }) => item);
        console.log(
          "xddd:",
          finalSortedData1.map((item) => item.id)
        );

        console.log("xddd", finalSortedData1);
        setData([]);
        //pobranie tablicy wyswietlonych projektow oraz wyswietlenie tych innych
        const array = await fetchUserProjects(userID);
        console.log("array ::::", array);
        const filteredData = finalSortedData1.filter(
          (project) => !array.includes(project.id)
        );
        setData((prevData) => [...prevData, ...filteredData]);
        setResetKey((prevKey) => prevKey + 1);
        setIsLoading(false);
        counter = 0;
        //!!tu wylaczyc loading screen
      }
    } else if (direction == "left") {
      counter++;
      //dodaenie wywietlonego projektu do firebase
      await addProjectUser(projectID, userId);
    }
  };

  // useEffect(() => {
  //   if (data.length > 0) {
  //     setAnimations(
  //       data.map(() => ({
  //         scale: new Animated.Value(0.75),
  //         borderRadius: new Animated.Value(30),
  //       }))
  //     );
  //   }
  // }, [data]);

  // const resetAllAnimations = () => {
  //   animations.forEach((anim) => {
  //     Animated.parallel([
  //       Animated.timing(anim.scale, {
  //         toValue: 0.75,
  //         duration: 300,
  //         useNativeDriver: false,
  //       }),
  //       Animated.timing(anim.borderRadius, {
  //         toValue: 30,
  //         duration: 300,
  //         useNativeDriver: false,
  //       }),
  //     ]).start();
  //   });
  // };

  const expandImage = (imageUri) => {
    setExpandedImage(imageUri);
    Animated.timing(imageScale, {
      toValue: 1.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // const resetImage = () => {
  //   Animated.timing(imageScale, {
  //     toValue: 1,
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start(() => {
  //     setExpandedImage(null);
  //   });
  // };

  const toggleExpandCard = (cardIndex: number) => {
    console.log("INdex przekazywany z karty!!!", cardIndex);
    if (cardIndex < 0 || cardIndex >= visibleCards.length) return;
    console.log("222INdex przekazywany z karty!!!", cardIndex);
    const card = data[cardIndex];
    console.log(card);
    const selectedCardId = card.id;
    const isExpanded = expandedCardId === selectedCardId;

    Animated.parallel([
      // Animated.timing(animations[cardIndex].scale, {
      //   toValue: isExpanded ? 0.75 : 1,
      //   duration: 300,
      //   useNativeDriver: false,
      // }),
      // Animated.timing(animations[cardIndex].borderRadius, {
      //   toValue: isExpanded ? 30 : 0,
      //   duration: 300,
      //   useNativeDriver: false,
      // }),
    ]).start(() => {
      setExpandedCardId(isExpanded ? null : callCount);
      console.log("Liczba wywołań toggleExpandCard:", callCount);
    });
  };

  const handleCardSwipe = async (direction: string, cardIndex: number) => {
    
    if (cardIndex < 0 || cardIndex >= visibleCards.length) return;
    const cardId = visibleCards[cardIndex].id;
    const success2 = await clickabilityViewership(cardId);
    await swiped(direction, cardId);
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

    return (
      <>
        {expandedImage ? (
          <TouchableWithoutFeedback>
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
                  // transform: [{ scale: imageScale }],
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
                  <TitleText>Description </TitleText>
                  <SectionText> {selectedCard.description} </SectionText>
                </InfoContainer>
               
                <InfoContainer>
                  <TitleText>Long Description </TitleText>
                  <SectionText> {selectedCard.longDescription} </SectionText>
                </InfoContainer>

                <InfoContainer>
                  <TitleText>Your work in the project </TitleText>
                  <SectionText> {selectedCard.insight} </SectionText>
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

    handleCardSwipe("right", cardIndex);
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
    <MainContainer key={resetKey}>
      {visibleCards.length > 0 ? (
        expandedCardId !== null ? (
          <ImageList
            cardIndex={expandedCardId} //tu sie podaje numer projektu id a nie index i zmienia sie indeks
            onBackPress={() => {
              // resetAllAnimations();
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
              backgroundColor={"#27272a"}
              verticalSwipe={false}
              horizontalSwipe={expandedCardId === null}
              onTapCard={(cardIndex) => toggleExpandCard(cardIndex)}
              onSwipedLeft={(cardIndex) => {
                handleCardSwipe("left", cardIndex);
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
                        handleJoinFavorites(currentCardID);
                        closeOverlay();
                      }}
                    >
                      <Icon name="heart-outline" size={30} color="#fff" />
                    </RoundButtonContainer>
                  </Animated.View>
                </ButtonContainer>
              </OverlayContainer>
            )}
          </>
        )
      ) : (
        <ActivityIndicator size="large" color="#3B82F6" />
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
  font-size: 20;
  font-weight: bold;
  margin-top: 200px;
  margin-bottom: 60px;
`;
//gdy karta znika
const MainContainer = styled.View`
  flex: 1;
  background-color: #44403c ;
  justify-content: center;
`;

const MainContainer2 = styled.View`
  flex: 1;
 background-color: #27272a ;
  align-items: center;
  justify-content: center;
`;

const TopContainer = styled.View`
  background-color: #27272a;
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
  background-color: #27272a;
`;

const InfoContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 90%;
  padding: 20px;
  background-color: red;
  background-color:#3f3f46;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  border-radius: 20px;
  margin-top: 5px;
`;

const NameText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 60px;
  color: white;
`;

const DescriptionText = styled.Text`
  font-size: 15spx;
  text-align: center;
  margin-bottom: 5px;
`;

const TitleText = styled.Text`
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  margin-bottom: 5px;
  color: white;
`;

const SectionText = styled.Text`
  font-size: 15px;
  text-align: center;
  margin-bottom: 5px;
  color:#d4d4d8;
`;
//dol karty
const CardContainer = styled(Animated.View)`
  border-radius: 50px;
  background-color: #3f3f46 ;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  align-self: center;
  bordercolor: #red;
  width:90%;
  min-height:80%;

`;

const CardImage = styled(Animated.Image)`
  height: 220px;
  width: 100%;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;

`;

const CardDetails = styled.View`
  padding: 20px;
`;

const CardTitle = styled.Text`
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
  color:white;
`;

const CardDescription = styled.Text`
  font-size: 22px;
  text-align: center;
  color: #d6d3d1;
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
