import { View, Text, ScrollView, Image, RefreshControl, TouchableOpacity } from 'react-native'
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


  return (
    <ScrollView 
      className='min-h-screen w-screen py-5 px-2 bg-zinc-800'
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }
    >
      <Text className='mt-20 text-2xl font-bold text-slate-200 mx-auto'>Konwersacje projektowe</Text>
      <View className='mt-5 py-4 px-2 rounded-l space-y-4'>
        {userChats.map(chat => (
          <TouchableOpacity key={chat.id} className='bg-zinc-700 p-3 rounded-2xl shadow' onPress={() => navigateToChatDetail(chat.id, chat.name)}>
            <Text className='text-xl font-semibold text-slate-200'>{chat.name}</Text>
            <View className='flex-row mt-1 items-start'>
              <View className='flex-row flex-wrap items-center'>
                  {chat.participantsDetails?.map(participant => (
                    <Image
                      key={participant.id}
                      source={{ uri: participant.profilePicUrl }}
                      className='w-5 h-5 rounded-full'
                    />
                    
                  ))}
              </View>
              <View className='ml-2 flex-row'>
                  {chat.participantsDetails?.map((participant, index) => (
                    <View className='mr-1'>
                      <Text key={participant.id} className='text-sm text-slate-400'>
                        {participant.firstName}{index < chat.participantsDetails.length - 1 ? ',' : ""}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>    
    </ScrollView>
  )
};

export default ChatScreen;