import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableWithoutFeedback,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { styled } from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchGPTResponsepodbiel } from "@/app/services/gptPromt";

const Card = ({ card, onPress }) => {
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

const CardSwiper = () => {
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [Scientists, setScientists] = useState([
    {
      id: "1",
      name: "Joe Doe",
      description: "Researcher in environmental science, focusing on renewable energy sources.",
      longDescription: "Joe Doe is an environmental scientist with a passion for renewable energy research. Her work focuses on developing sustainable energy solutions to reduce carbon emissions. She has published multiple papers on wind and solar energy integration into urban environments.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      generatedPrompt: null,
    },
    {
      id: "2",
      name: "John Smith",
      description: "Data scientist specializing in machine learning applications in healthcare.",
      longDescription: "John Smith is a data scientist with a focus on applying machine learning techniques to healthcare data. His research aims to improve patient outcomes through predictive analytics and personalized medicine. He has collaborated with hospitals to develop models for early detection of chronic diseases.",
      image:
        "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      generatedPrompt: null,
    },
    {
      id: "3",
      name: "Emily Davis",
      description: "Biologist researching plant-based solutions for carbon capture.",
      longDescription: "Emily Davis is a biologist whose research focuses on plant-based carbon capture technologies. She is exploring how genetically modified plants can absorb more CO2 from the atmosphere, contributing to climate change mitigation efforts. Emily has been part of numerous international environmental initiatives.",
      image:
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      generatedPrompt: null,
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Static array of projects
  const projects = [
    {
      id: "1",
      name: "Renewable Energy Integration",
      description: "A project focused on integrating renewable energy sources, such as wind and solar, into existing urban power grids to reduce reliance on fossil fuels.",
    },
    {
      id: "2",
      name: "AI in Healthcare",
      description: "A research project aimed at developing machine learning models to predict patient health outcomes and support personalized treatment plans.",
    },
    {
      id: "3",
      name: "Carbon Capture with Plants",
      description: "An initiative to develop genetically modified plants that can enhance carbon absorption, contributing to climate change mitigation efforts.",
    },
  ];

  async function handleGenerateLongDescription1(descriptions,descriptiop) {
    if (descriptions) {
      try {
        const results = await Promise.all(
        await  fetchGPTResponsepodbiel(descriptions,descriptiop) // Pass each prompt to the fetch function
        );
        return results; // Array of results for each project
      } catch (error) {
        console.error("Error generating long descriptions:", error);
      }
    } else {
      Alert.alert("Warning", "Please provide prompts first.");
    }
  }


  useEffect(() => {
    // Generate prompts for all scientists right after component mounts
    const generatePromptsForAllScientists = async () => {
      try {
        const updatedScientists = await Promise.all(
          Scientists.map(async (scientist) => {
            const selectedProject = projects[0]; // You could use logic to select a different project if desired

            // Replace this with your actual prompt generation API call
            const generatedPrompt = await handleGenerateLongDescription1(scientist.longDescription,selectedProject.description)

            return { ...scientist, generatedPrompt };
          })
        );

        setScientists(updatedScientists);
      } catch (error) {
        console.error("Error generating prompts for scientists:", error);
      }
    };

    generatePromptsForAllScientists();
  }, []);

  const toggleExpandCard = (ScientistId) => {
    setExpandedCardId(expandedCardId === ScientistId ? null : ScientistId);
  };

  return (
    <MainContainer>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : Scientists.length > 0 ? (
        expandedCardId ? (
          // Expanded card view
          <ExpandedCard>
            <NameText>
              {
                Scientists.find((Scientist) => Scientist.id === expandedCardId)
                  .name
              }
            </NameText>
            <StyledScrollView>
              <InfoContainer>
                <TitleText>Description</TitleText>
                <SectionText>
                  {
                    Scientists.find(
                      (Scientist) => Scientist.id === expandedCardId
                    ).description
                  }
                </SectionText>
              </InfoContainer>
              <InfoContainer>
                <TitleText>Long Description</TitleText>
                <SectionText>
                  {
                    Scientists.find(
                      (Scientist) => Scientist.id === expandedCardId
                    ).longDescription
                  }
                </SectionText>
              </InfoContainer>
              <InfoContainer>
                <TitleText>Generated Prompt</TitleText>
                <SectionText>
                  {Scientists.find(
                    (Scientist) => Scientist.id === expandedCardId
                  ).generatedPrompt || "Generating prompt..."}
                </SectionText>
              </InfoContainer>
            </StyledScrollView>
            <StyledButton onPress={() => setExpandedCardId(null)}>
              <StyledButtonText>Back to Cards</StyledButtonText>
            </StyledButton>
          </ExpandedCard>
        ) : (
          <Swiper
            cards={Scientists}
            renderCard={(Scientist) => (
              <Card
                key={Scientist.id}
                card={Scientist}
                onPress={() => toggleExpandCard(Scientist.id)}
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

// Styled components (unchanged)
const MainContainer = styled.View`
  flex: 1;
  background-color: #44403c;
  justify-content: center;
`;

const ExpandedCard = styled.View`
  flex: 1;
  background-color: #27272a;
  align-items: center;
  justify-content: center;
  padding: 20px;
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
  background-color: #3f3f46;
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
  color: #d4d4d8;
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

const CardDescription = styled.Text`
  font-size: 22px;
  text-align: center;
  color: #d6d3d1;
`;

const CardImage = styled.Image`
  height: 220px;
  width: 100%;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
`;

// Mock function to simulate prompt response generation
async function generatePromptResponse(prompt) {
  // This should be replaced with your real API call
  return `Generated insight based on: ${prompt}`;
}
