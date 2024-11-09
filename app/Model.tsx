import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/FirebaseConfig';
import { collection, query, orderBy, limit, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';

const BusinessCanvasScreen = () => {
  const [canvas, setCanvas] = useState({
    name: '',
    description: '',
    keyPartners: '',
    keyActivities: '',
    keyResources: '',
    valuePropositions: '',
    customerRelationships: '',
    channels: '',
    customerSegments: '',
    costStructure: '',
    revenueStreams: '',
  });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          console.log('Retrieved userId:', storedUserId);
        } else {
          console.log('No userId found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching userId from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleInputChange = (section: string, value: string) => {
    setCanvas({ ...canvas, [section]: value });
  };

  const saveProjectWithHighestId = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    try {
      const projectRef = collection(db, 'projects');
      const projectQuery = query(projectRef, orderBy('id', 'desc'), limit(1));
      const projectSnap = await getDocs(projectQuery);

      let newId = 1; // Default to 1 if no projects exist

      if (!projectSnap.empty) {
        const highestProject = projectSnap.docs[0].data();
        newId = highestProject.id + 1; // Increment the highest id by 1
      }

      await setDoc(doc(projectRef, newId.toString()), {
        id: newId,
        ...canvas,
        userId: userId,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Project saved successfully!');
      console.log('Project saved with ID:', newId);
    } catch (error) {
      console.error('Error saving project:', error);
      Alert.alert('Error', 'Failed to save the project.');
    }
  };

  const sections = [
    { label: 'Name', key: 'name' },
    { label: 'Description', key: 'description' },
    { label: 'Key Partners', key: 'keyPartners' },
    { label: 'Key Activities', key: 'keyActivities' },
    { label: 'Key Resources', key: 'keyResources' },
    { label: 'Value Propositions', key: 'valuePropositions' },
    { label: 'Customer Relationships', key: 'customerRelationships' },
    { label: 'Channels', key: 'channels' },
    { label: 'Customer Segments', key: 'customerSegments' },
    { label: 'Cost Structure', key: 'costStructure' },
    { label: 'Revenue Streams', key: 'revenueStreams' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Business Model Canvas</Text>
      {sections.map((section) => (
        <View key={section.key} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{section.label}</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder={`Enter details for ${section.label}`}
            value={canvas[section.key as keyof typeof canvas]} // Dodaje wsparcie dla nowych pól
            onChangeText={(value) => handleInputChange(section.key, value)}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={saveProjectWithHighestId}>
        <Text style={styles.saveButtonText}>Save Project</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    minHeight: 60,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessCanvasScreen;
