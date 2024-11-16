import { Text, View, StyleSheet, Platform } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { addMessageToChat, getMessages } from "./services/messageService";
import { Bubble, BubbleProps, Composer, ComposerProps, GiftedChat, IMessage, InputToolbar, InputToolbarProps, Send, SendProps } from 'react-native-gifted-chat';
import { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { Message } from "./interfaces/Message";
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { fetchCurrentUserId } from "@/components/CardSwiper";
import { BasicUser } from "./interfaces/User";
import { fetchGiftedUser } from "./services/userServices";

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

    //loadUser();
    loadInitialMessages();
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

    // biore tylko pierwsza wiadomosc (text) mozna pozniej zrobic, ze mozna wyslac na raz fote i wiadomosc
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
      system: false
    };

    await addMessageToChat(chatId as string, message);

    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
  }, [chatId]);

//   const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
//     return (
//       <InputToolbar
//         {...props}
//         containerStyle={tw`mx-6 rounded-full mt-4 bg-zinc-700 shadow-lg border-zinc-800 border-t-0 text-slate-200`}
//         primaryStyle={tw`px-2`}
//       />
//     )
//   }

//   const renderComposer = (props: ComposerProps) => (
//     <Composer
//             {...props}
//             textInputStyle={tw`text-base text-slate-200`} // Tailwind styles for text input
//             placeholder="Napisz wiadomosc..." // Custom placeholder text
//     />
//   )

//   const renderSend = (props: SendProps<IMessage>) => (
//     <Send {...props}>
//         <View style={tw`bg-blue-500 rounded-full p-2 mb-3 -mr-4`}>
//             <Ionicons name="send" size={18} color="white" />
//         </View>
//     </Send>
// );

// const renderBubble = (props: BubbleProps<IMessage>) => (
//   <Bubble
//       {...props}
//       wrapperStyle={{
//           right: [
//               tw`bg-green-500`,
//           ],
//           left: [
//               tw`bg-slate-700`,
//           ],
//       }}
//       textStyle={{
//           right: tw`text-slate-100`, // Text color for sent messages
//           left: tw`text-slate-200`, // Text color for received messages
//       }}
//   />
// );

const styles = StyleSheet.create({
  container: {
      flex: 1,
      paddingBottom: 10,
      paddingTop: 16,
      backgroundColor: '#374151', // Zinc-800 equivalent
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
      <GiftedChat
          messages={messages}
          onSend={(newMessages) => onSend(newMessages)}
          user={{
              _id: mockedUserId,
              name: mockedUserName,
              avatar: userProfilePic,
          }}
          loadEarlier={true}
          onLoadEarlier={loadEarlierMessages}
          isLoadingEarlier={loadingEarlier}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderBubble={renderBubble}
      />
  </View>
);
  
};

export default ChatDetails;
