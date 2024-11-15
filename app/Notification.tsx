import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react'
import { fetchNotificationProjectById } from './services/projectService';
import { ProjectToNotification } from './interfaces/Project';
import { fetchNotificationUserById } from './services/userServices';
import { UserToNotification } from './interfaces/User';
import { ScrollView, View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Button from 'react-native-button'
import { createChat, findChatByProjectId } from './services/chatService';
import { Message } from './interfaces/Message';
import { Timestamp } from 'firebase/firestore';
import { addMessageToChat } from './services/messageService';

const Notification: React.FC = () => {
    const { projectId, userId } = useLocalSearchParams();
    const [project, setProject] = useState<ProjectToNotification | null>(null);
    const [user, setUser] = useState<UserToNotification | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const handleAccept = async () => {

      const message_1: Message = {
        text: `${user.firstName} joined the chat`,
        sentAt: Timestamp.now(),
        sentBy: user.id,
        type: "text",
        system: true
      };

      const message_2: Message = {
        text: "Owner joined chat",
        sentAt: Timestamp.now(),
        sentBy: project.ownerId,
        type: "text",
        system: true
      }

      try {
        const chatId = await findChatByProjectId(projectId as string);

        if (!chatId) {
          console.log(`Chat not found creating...`);
          const chatData = {
            name: project.name,
            createdBy: project.ownerId,
            participants: [user.id, project.ownerId],
            projectId: project.id
          };

          const chatId = await createChat(chatData);

          try {
            await addMessageToChat(chatId, message_1);
            await addMessageToChat(chatId, message_2);

          } catch (error) {
            console.error(`Error adding messages to chat ${chatId}:`, error);
          }
        } else {
          console.log(`Chat ${chatId} found, adding messages`); {
            try {
              await addMessageToChat(chatId, message_1);
              await addMessageToChat(chatId, message_2);
            } catch (error) {
              console.error(`Error adding messages to chat ${chatId}`, error);
            }
          }
        }

        const projectName = project.name

        router.push({
          pathname: '../ChatDetails',
          params: { chatId, projectName }
        });

      } catch (error) {
        console.error("Error ")
      }
    }

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const projectData = await fetchNotificationProjectById(projectId as string)

                if (projectData) {
                    setProject(projectData);
                    console.log("Notification after successfully fetched project");
                } else {
                    console.warn(`Project with ID ${projectId} not found.`);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await fetchNotificationUserById(userId as string);

                if (userData) {
                    setUser(userData);
                    console.log("Notification after successfully fetched User");
                } else {
                    console.warn(`User with ID ${userId} not found.`);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId])

    useEffect (() => {
        if (project !== null && user !== null) {
            setLoading(false);
        }
    }, [project, user]);

      if (loading) {
        return (
          <View className=' flex-1 justify-center items-center bg-zinc-800'>
            <ActivityIndicator size="large" color="#e2e8f0" />
            <Text>Loading notification data...</Text>
          </View>
        );
      }

    return (
        <ScrollView className='p-4 bg-zinc-800'>
          {/* User Information */}
          <View className='flex-col my-2 bg-zinc-700 p-3 rounded-2xl shadow-md'>
            <Image source={{ uri: user.profilePicUrl }} className='w-28 h-28 rounded-2xl my-2 mx-auto' />
            <Text className='text-2xl font-bold text-slate-50 mx-auto mb-2'>
              {user.firstName} {user.lastName} 
              {user.userType && <Text className='text-lg italic text-slate-50'> ({user.userType})</Text>}
            </Text>
            <View className='flex-1 justify-center'>
              <Text className='text-sm text-slate-300 mb-2'>{user.about}</Text>
              <View className='flex-row flex-wrap mb-2'>
                {user.tags.map((tag, index) => (
                  <View key={index} className='bg-green-100 text-green-600 py-1 px-2 m-2 rounded-md text-sm'>
                    <Text>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className='my-2 bg-zinc-700 p-3 rounded-2xl shadow-md flex-row'>
            <Image source={{ uri: project.imageUrl }} className='w-16 h-16 mr-4 rounded-lg' />
            <View>
              <Text className='text-lg font-bold text-slate-100'>{project.name}</Text>
              <Text className='text-base text-slate-400'>Members in project: {project.members.length}</Text>
            </View>
          </View>

          <View className='p-4 bg-zinc-700 rounded-2xl border-yellow-100 border-2 my-2 flex-col items-center'>
            <Text className='text-lg font-bold text-slate-300 text-center'>
              {user.firstName} {user.lastName} wants to join your project "{project.name}".
            </Text>
            <View className='flex-row mt-4'>
              <Button
                style={{ fontSize: 20, color: '#16a34a' }}
                containerStyle={{ paddingVertical: 6, paddingHorizontal: 16, backgroundColor: '#dcfce7', borderColor: '#16a34a', borderWidth: 2, borderRadius: 12, marginRight: 12 }}
                onPress={handleAccept()}
              >
                Accept
              </Button>
              <Button
                style={{ fontSize: 20, color: '#dc2626' }}
                containerStyle={{ paddingVertical: 6, paddingHorizontal: 16, backgroundColor: '#fee2e2', borderColor: '#dc2626', borderWidth: 2, borderRadius: 12, marginLeft: 12 }}
                onPress={() => {
                  router.back();
                }}
              >
                Decline
              </Button>
            </View>
          </View>
        </ScrollView>
      );
}

export default Notification;