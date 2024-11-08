import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const BusinessCanvasScreen = () => {
  const [canvas, setCanvas] = useState({
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

  const handleInputChange = (section: string, value: string) => {
    setCanvas({ ...canvas, [section]: value });
  };

  const sections = [
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
         //f   value={canvas[section.key]}
            onChangeText={(value) => handleInputChange(section.key, value)}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={() => console.log('Canvas Saved:', canvas)}>
        <Text style={styles.saveButtonText}>Save Canvas</Text>
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
