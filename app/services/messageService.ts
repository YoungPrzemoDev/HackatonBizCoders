import { db } from '../../config/FirebaseConfig';
import { collection, query, orderBy, limit, getDocs, addDoc, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { Message } from '../interfaces/Message';
import { fetchGiftedUser } from './userServices';
import { IMessage } from 'react-native-gifted-chat';

export async function addMessageToChat(chatId: string, message: Message): Promise<void> {
    try {
        const messageRef = collection(db, `chats/${chatId}/messages`);
        await addDoc(messageRef, message);
        console.log(`Message added to chat ${chatId}`);
    } catch(error) {
        console.error("Error adding message to chat:", error);
    }
}

export async function getMessages(
    chatId: string,
    limitCount: number = 20,
    startAfterDoc: QueryDocumentSnapshot | null = null,
    system: boolean = false
): Promise<{ messages: IMessage[], lastVisible: QueryDocumentSnapshot | null }> {
    try {
        console.log("chatId z getMessages ", chatId, typeof(chatId))
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        let messagesQuery = query(messagesRef, orderBy('sentAt', 'desc'), limit(limitCount));

        if(startAfterDoc) {
            messagesQuery = query(messagesRef, orderBy('sentAt', 'desc'), startAfter(startAfterDoc), limit(limitCount));
        }

        const querySnapshot = await getDocs(messagesQuery);
        console.log("querySnapshot docs: ", querySnapshot.docs);
        const messages = await Promise.all(
            querySnapshot.docs.map(async (message) => {
                const messageData = message.data() as Message;
                const user = await fetchGiftedUser(messageData.sentBy);

                // Konwert do typu wiadomosci GiftChat
                const giftedMessage: IMessage = {
                    _id: message.id,
                    text: messageData.text,
                    createdAt: messageData.sentAt.toDate(),
                    user: {
                        _id: messageData.sentBy,
                        name: user?.firstName || 'Uknown User',
                        avatar: user?.profilePicUrl || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                    },
                    ...(system && { system: true })
                };

                return giftedMessage;
            })
        );

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
        console.log(messages)
        return { messages, lastVisible };

    } catch (error) {
        console.error("Error fetching messages:", error);
        return { messages: [], lastVisible: null };
    }
}