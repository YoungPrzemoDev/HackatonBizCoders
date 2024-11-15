import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#4B0082',
    borderRadius: 10,
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

function CardDetails({ route, navigation }: any) {
  const { character } = route.params; // Odbieramy dane z poprzedniego ekranu

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{character.name}</Text>
        <Text style={styles.description}>{character.description}</Text>
        {/* Przycisk powrotu */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Wróć do kart</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default CardDetails;