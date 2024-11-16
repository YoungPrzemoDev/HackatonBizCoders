import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  ScrollView, View, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform 
} from 'react-native';
import Button from 'react-native-button';
import { addMessageToChat } from './services/messageService';
import { fetchNotificationProjectById } from './services/projectService';
import { fetchNotificationUserById } from './services/userServices';
import { findChatByProjectId, createChat } from './services/chatService';

import { Timestamp } from 'firebase/firestore';

const Notification = () => {
  const { projectId, userId } = useLocalSearchParams();
  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAccept = async () => {
    if (!project || !user) return;

    const systemMessages = [
      {
        text: `${user.firstName} joined the chat`,
        sentAt: Timestamp.now(),
        sentBy: user.id,
        type: "text",
        system: true,
      },
      {
        text: 'Owner joined chat',
        sentAt: Timestamp.now(),
        sentBy: project.ownerId,
        type: "text",
        system: true,
      },
    ];

    try {
      let chatId = await findChatByProjectId(projectId as string);

      if (!chatId) {
        console.log('Chat not found, creating a new chat...');
        const chatData = {
          name: project.name,
          createdBy: project.ownerId,
          participants: [user.id, project.ownerId],
          projectId: project.id,
        };
        chatId = await createChat(chatData);
      }

      for (const message of systemMessages) {
        await addMessageToChat(chatId, message);
      }

      router.push({ pathname: '../ChatDetails', params: { chatId, projectName: project.name } });
    } catch (error) {
      console.error('Error handling accept:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (projectId) {
          const projectData = await fetchNotificationProjectById(projectId as string);
          setProject(projectData);
        }
        if (userId) {
          const userData = await fetchNotificationUserById(userId as string);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching notification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, userId]);

  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#374151',
    },
    scrollView: {
      padding: 16,
      backgroundColor: '#374151',
    },
    container: {
      marginVertical: 8,
      backgroundColor: '#3F3F46',
      padding: 12,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    containerProject: {
      marginVertical: 8,
      backgroundColor: '#3F3F46',
      padding: 12,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    image: {
      alignSelf: 'center',
      borderRadius: 16,
      marginVertical: 8,
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#F9FAFB',
      textAlign: 'center',
      marginBottom: 8,
    },
    textMembers: {
      fontSize: 20,
      color: '#F9FAFB',
      textAlign: 'left',
      marginBottom: 8,
    },
    textAbout: {
      fontSize: 14,
      color: '#94a3b8',
      textAlign: 'left',
      marginBottom: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 16,
      justifyContent: 'space-between',
    },
    button: {
      borderRadius: 12,
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderWidth: 2,
    },
    acceptButton: {
      backgroundColor: '#DCFCE7',
      borderColor: '#16A34A',
    },
    declineButton: {
      backgroundColor: '#FEE2E2',
      borderColor: '#DC2626',
    },
    buttonText: {
      fontSize: 16,
      textAlign: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e2e8f0" />
        <Text>Loading notification data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      {/* User Information */}
      {user && (
        <View style={styles.container}>
          <Image source={{ uri: user.profilePicUrl }} style={[styles.image, { width: 164, height: 164 }]} />
          <Text style={styles.text}>
            {user.firstName} {user.lastName} {user.userType && `(${user.userType})`}
          </Text>
          <Text style={[styles.textAbout, { fontSize: 14 }]}>{user.about}</Text>
        </View>
      )}

      {/* Project Information */}
      {project && (
        <View style={styles.containerProject}>
          <Image source={{ uri: project.imageUrl }} style={[styles.image, { width: 64, height: 64 }]} />
          <View>
            <Text style={styles.text}>{project.name}</Text>
            <Text style={[styles.textMembers, { fontSize: 14 }]}>Members in project: {project.members?.length || 0}</Text>
          </View>
          
        </View>
      )}

      {/* Request Actions */}
      <View style={[styles.container, { borderColor: '#FBBF24', borderWidth: 2 }]}>
        <Text style={styles.text}>{user?.firstName} wants to join your project "{project?.name}".</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Text style={[styles.buttonText, { color: '#16A34A' }]}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: '#DC2626' }]}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Notification;
