import { Text, View, StyleSheet, Platform, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { addMessageToChat, getMessages } from "../services/messageService";
import { Bubble, BubbleProps, Composer, ComposerProps, GiftedChat, IMessage, InputToolbar, InputToolbarProps, Send, SendProps } from 'react-native-gifted-chat';
import { collection, DocumentData, onSnapshot, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { Message } from "../interfaces/Message";
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { fetchCurrentUserId } from "@/components/CardSwiper";
import { BasicUser } from "../interfaces/User";
import { fetchGiftedUser } from "../services/userServices";
import { db } from "@/config/FirebaseConfig";

const mockedUserId = "1";
const mockedUserName = "Dorian";
const userProfilePic = "";

const ChatDetails: React.FC = () => {
  const { chatId, chatName } = useLocalSearchParams();
  const [user, setUser] = useState<BasicUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loadingEarlier, setLoadingEarlier] = useState(false);

  useEffect(() => {
    const loadInitialMessages = async () => {
      const { messages: initialMessages, lastVisible: newLastVisible } = await getMessages(chatId as string);
      setMessages(GiftedChat.append([], initialMessages));
      console.log(initialMessages)
      setLastVisible(newLastVisible);
    };

    const loadUser = async () => {
      try {
        const userId = await fetchCurrentUserId();
        const userData: BasicUser = await fetchGiftedUser(userId);
        setUser(userData);
      } catch(error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const subscribeToChatMessages = () => {
      if (!chatId) return;
  
      const messagesRef = collection(db, "chats", chatId as string, "messages");
  
      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newMessage = change.doc.data() as Message;

            const giftedMessage: IMessage = {
              _id: change.doc.id,
              text: newMessage.text,
              createdAt: newMessage.sentAt.toDate(),
              user: {
                  _id: newMessage.sentBy,
                  name: user?.firstName || 'Uknown User',
                  avatar: user?.profilePicUrl || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
              },
          };
  
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, [giftedMessage])
            );
          }
        });
      });
  
      return unsubscribe;
    };

    loadUser();
    loadInitialMessages();
    const unsubscribe = subscribeToChatMessages();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [chatId]);

  const loadEarlierMessages = async () => {
    if (lastVisible) {
      setLoadingEarlier(true);
      const { messages: olderMessages, lastVisible: newLastVisible } = await getMessages(chatId as string, 20, lastVisible);
      setMessages(previousMessages => GiftedChat.prepend(previousMessages, olderMessages));
      setLastVisible(newLastVisible);
      setLoadingEarlier(false);
    }
  };

  const onSend = useCallback(async (newMessage: IMessage[] = []) => {
    const giftedMessage = newMessage[0];
  
    const message: Message = {
      text: giftedMessage.text,
      sentAt: Timestamp.fromDate(
        giftedMessage.createdAt instanceof Date
          ? giftedMessage.createdAt
          : new Date(giftedMessage.createdAt)
      ),
      sentBy: giftedMessage.user._id as string,
      type: "text",
      system: false,
    };
  
    await addMessageToChat(chatId as string, message);
  }, [chatId]);

const styles = StyleSheet.create({
  container: {
      flex: 1,
      paddingBottom: 10,
      paddingTop: 16,
      backgroundColor: '#27272a', // Zinc-800 equivalent
      paddingHorizontal: 8,
  },
  inputToolbarContainer: {
      marginHorizontal: 24,
      borderRadius: 9999,
      marginTop: 16,
      backgroundColor: '#3F3F46', // Zinc-700 equivalent
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      borderTopWidth: 0,
      borderColor: '#1E293B', // Zinc-800 equivalent
  },
  inputToolbarPrimary: {
      paddingHorizontal: 8,
  },
  composerTextInput: {
      fontSize: 16,
      color: '#E5E7EB', // Slate-200 equivalent
  },
  sendButtonContainer: {
      backgroundColor: '#3B82F6', // Blue-500 equivalent
      borderRadius: 9999,
      padding: 8,
      marginBottom: 12,
      marginRight: -16,
  },
  bubbleRight: {
      backgroundColor: '#22C55E', // Green-500 equivalent
  },
  bubbleLeft: {
      backgroundColor: '#1E293B', // Slate-700 equivalent
  },
  bubbleTextRight: {
      color: '#F1F5F9', // Slate-100 equivalent
  },
  bubbleTextLeft: {
      color: '#E5E7EB', // Slate-200 equivalent
  },
});

const renderInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbarContainer}
      primaryStyle={styles.inputToolbarPrimary}
    />
  );
};

const renderComposer = (props) => (
  <Composer
      {...props}
      textInputStyle={styles.composerTextInput}
      placeholder="Napisz wiadomosc..."
  />
);

const renderSend = (props) => (
  <Send {...props}>
      <View style={styles.sendButtonContainer}>
          <Ionicons name="send" size={18} color="white" />
      </View>
  </Send>
);

const renderBubble = (props) => (
  <Bubble
      {...props}
      wrapperStyle={{
          right: styles.bubbleRight,
          left: styles.bubbleLeft,
      }}
      textStyle={{
          right: styles.bubbleTextRight,
          left: styles.bubbleTextLeft,
      }}
  />
);


return (
  <View style={styles.container}>
      {user ? ( // Check if user is loaded
        <GiftedChat
            messages={messages}
            onSend={(newMessages) => onSend(newMessages)}
            user={{
                _id: user.id,
                name: user.firstName,
                avatar: user.profilePicUrl,
            }}
            loadEarlier={true}
            onLoadEarlier={loadEarlierMessages}
            isLoadingEarlier={loadingEarlier}
            renderInputToolbar={renderInputToolbar}
            renderComposer={renderComposer}
            renderSend={renderSend}
            renderBubble={renderBubble}
        />
      ) : (
        // Show a loading indicator until the user is set
        <ActivityIndicator size="large" color="#3B82F6" />
      )}
  </View>
);
  
};

export default ChatDetails;
