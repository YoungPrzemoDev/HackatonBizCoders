import { View, Text, ScrollView, Image, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { db } from '../../config/FirebaseConfig'
import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { Chat, ChatWithId, ChatWithParticipants } from '../interfaces/Chat';
import { fetchParticipants } from '../services/userServices';
import { useRouter } from 'expo-router';

const mockedUserId = "1";

const ChatScreen: React.FC = () => {
  const [userChats, setUserChats] = useState<ChatWithParticipants[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const navigateToChatDetail = (chatId: string, chatName: string) => {
    router.push({
      pathname: '../ChatDetails',
      params: {chatId, chatName},
    });
  }

  const fetchUserChats = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', mockedUserId),
        where('active', '==', 1)
      );

      const querySnapshot = await getDocs(q);

      const chats = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const chatData = doc.data() as Chat;
          const participantsDetails = await fetchParticipants(chatData.participants);

          return {
            id: doc.id,
            ...chatData,
            participantsDetails
          };
        })          
      );

      setUserChats(chats);

    } catch(error) {
      console.error("Error fetching user chats:", error);
    } finally {
      if (refresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserChats();
  }, []);

  const onRefresh = useCallback(() => {
    fetchUserChats(true);
  }, []);

  const styles = StyleSheet.create({
    container: {
      minHeight: '100%',
      width: '100%',
      paddingVertical: 20,
      paddingHorizontal: 10,
      backgroundColor: '#374151', // Zinc-800 equivalent
    },
    title: {
      marginTop: 80,
      fontSize: 24,
      fontWeight: 'bold',
      color: '#E5E7EB', // Slate-200 equivalent
      textAlign: 'center',
    },
    chatListContainer: {
      marginTop: 20,
      paddingVertical: 16,
      paddingHorizontal: 10,
      borderRadius: 8,
      gap: 16, // Alternative for `space-y-4`
    },
    chatItem: {
      backgroundColor: '#3F3F46', // Zinc-700 equivalent
      padding: 12,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
    },
    chatName: {
      fontSize: 20,
      fontWeight: '600',
      color: '#E5E7EB', // Slate-200 equivalent
    },
    participantsContainer: {
      flexDirection: 'row',
      marginTop: 4,
      alignItems: 'flex-start',
    },
    participantImagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    participantImage: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 4,
    },
    participantNamesContainer: {
      marginLeft: 8,
      flexDirection: 'row',
    },
    participantNameWrapper: {
      marginRight: 4,
    },
    participantName: {
      fontSize: 12,
      color: '#9CA3AF', // Slate-400 equivalent
    },
  });


  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Konwersacje projektowe</Text>
      <View style={styles.chatListContainer}>
        {userChats.map(chat => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => navigateToChatDetail(chat.id, chat.name)}
          >
            <Text style={styles.chatName}>{chat.name}</Text>
            <View style={styles.participantsContainer}>
              <View style={styles.participantImagesContainer}>
                {chat.participantsDetails?.map(participant => (
                  <Image
                    key={participant.id}
                    source={{ uri: participant.profilePicUrl }}
                    style={styles.participantImage}
                  />
                ))}
              </View>
              <View style={styles.participantNamesContainer}>
                {chat.participantsDetails?.map((participant, index) => (
                  <View key={participant.id} style={styles.participantNameWrapper}>
                    <Text style={styles.participantName}>
                      {participant.firstName}
                      {index < chat.participantsDetails.length - 1 ? ',' : ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ChatScreen;