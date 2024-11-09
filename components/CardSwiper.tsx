import { db } from "@/config/FirebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { styled } from "styled-components/native";

const { height, width } = Dimensions.get("window");




// Statyczne dane dla kart
const data = [
  {
    id: 1,
    image: [
      'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
      'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
      'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
    ],
    name: "Leanne Graham",
    description:
      "Full-time Traveller. Occasional Photographer. Part-time Singer/Dancer.",
    matchPercentage: "78%",
  },
  {
    id: 2,
    image: [
      'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
      'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
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
  width:95%;
  height:95%;
`;

//dol karty
const CardContainer = styled(Animated.View)`
  border-radius: 50px;
      background-color:#ffffff;
     shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  align-self: center;
  margin-top: -50px;
  borderColor: #ffffff;
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
interface ProjectData {
  name:string;
  description:string;
  id: string;
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valuePropositions: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
  createdAt: Date;
  userId: string;
}

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

const Card = ({ card, cardIndex, onPress, animations,projectId }) => {

  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Pobierz referencję do kolekcji 'projects'
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectList: ProjectData[] = [];

        querySnapshot.forEach((doc) => {
          // Zmapuj dane z Firestore na obiekt typu ProjectData
          const data = doc.data();
          projectList.push({
            name: data.name,
            description: data.description,
            id: doc.id, // ID dokumentu
            keyPartners: data.keyPartners,
            keyActivities: data.keyActivities,
            keyResources: data.keyResources,
            valuePropositions: data.valuePropositions,
            customerRelationships: data.customerRelationships,
            channels: data.channels,
            customerSegments: data.customerSegments,
            costStructure: data.costStructure,
            revenueStreams: data.revenueStreams,
            createdAt: data.createdAt.toDate(), // Zakładam, że `createdAt` jest typem Timestamp z Firestore
            userId: data.userId,
          });
        });

        setProjects(projectList); // Ustawienie stanu z załadowanymi danymi
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
      setLoading(true);
    };

    fetchProjects(); // Wywołanie funkcji pobierania przy pierwszym renderze
  }, []);

 
  const specificProject = projects[projectId];
  console.log("pierwsze projectid:", projectId);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <CardContainer style={getCardStyle(cardIndex, animations)}>
        <CardImage source={{ uri: card.image[0] }} resizeMode={'stretch'} />
        <CardDetails>
          <CardTitle>{specificProject?.name}</CardTitle>
          <CardDescription>{specificProject?.description}</CardDescription>
        </CardDetails>
      </CardContainer>
    </TouchableWithoutFeedback>
  );
};

const CardSwiper = () => {

  const [projectId, setProjectId] = useState<number>(1); // Initial project ID
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

  const toggleExpandCard = (cardIndex:number) => {
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

    setProjectId((prevId) => {
      const newId = prevId + 1;
      console.log("drugie project id:", newId);
      return newId;
    });
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
  data={visibleCards}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableWithoutFeedback onPress={() => expandImage(item)}>
      <View
        style={{
          width: width,
          height: 350,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}
  
      >
        <MainContainer2>
        <Text>{}</Text>
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
                projectId={projectId}
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
            onSwipedRight={(cardIndex) => {
              handleCardSwipe(cardIndex);
              console.log("Right Swipe", cardIndex);
            }}
          />
        )
      ) : (
        <StyledText>Brak więcej kart do wyświetlenia.</StyledText>
      )}
    </MainContainer>
  );
};

export default CardSwiper;
function setVisibleCards(projectData: { id: string; }[]) {
  throw new Error("Function not implemented.");
}

