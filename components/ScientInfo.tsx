import { View, Text, Image, ScrollView, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

// Define types for the props and data
interface Technology {
  id: string;
  name: string;
  icon: string;
}

interface Scientist {
  id: string;
  name: string;
  secondName: string;
  localization: string;
  imageUrl: string;
  introduction: string;
  technologies: string; // Assuming it's a comma-separated string
}

const technologies: Technology[] = [
  { id: '1', name: 'JavaScript', icon: 'logo-javascript' },
  { id: '2', name: 'React', icon: 'logo-react' },
  { id: '3', name: 'Node.js', icon: 'logo-nodejs' },
];

interface ScientInfoProps {
  scient: Scientist;
}

const ScientInfo = ({ scient }) => {
  // Function to split technologies from a comma-separated string
  const getScientistTechnologies = (scient: Scientist): string[] => {
    return scient.technologies.split(',');
  };

  // Function to get the icon for a specific technology
  const getTechnologiesIcon = (technologyName: string): string => {
    const technology = technologies.find(tech => tech.name === technologyName);
    return technology ? technology.icon : 'logo-angular'; // Default to Angular icon if not found
  };

  return (
    <ScrollView>
      <Image
        source={{ uri: scient.imageUrl }}
        style={styles.image}
        resizeMode="cover" // Use resizeMode instead of objectFit
      />
      <View>
        <Text style={styles.name}>
          {scient.name} {scient.secondName}
        </Text>
        <Text style={styles.localization}>{scient.localization}</Text>

        <View style={styles.separator} />

        <Text style={styles.introduction}>{scient.introduction}</Text>

        <View style={styles.separator} />

        <Text style={styles.technologiesTitle}>My technologies</Text>

        <FlatList
          data={getScientistTechnologies(scient)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.technologyItem}>
              <Ionicons
                name={getTechnologiesIcon(item)} // Pass the correct icon name
                size={24}
                color="black"
                style={styles.icon}
              />
              <Text style={styles.technologyName}>{item}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 400,
  },
  name: {
    marginTop: 20,
    marginLeft: 20,
    fontFamily: 'outfit-bold',
    fontSize: 40,
  },
  localization: {
    marginLeft: 20,
    fontFamily: 'outfit',
    fontSize: 20,
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  introduction: {
    marginLeft: 20,
    marginRight: 10,
    fontFamily: 'outfit',
    fontSize: 18,
  },
  technologiesTitle: {
    marginTop: 5,
    marginLeft: 20,
    fontFamily: 'outfit-bold',
    fontSize: 20,
  },
  technologyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  technologyName: {
    fontFamily: 'outfit',
    fontSize: 18,
  },
});

export default ScientInfo;
