import { db } from '../../config/FirebaseConfig';
import { collection, query, orderBy, limit, getDocs, addDoc, Timestamp, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { Message } from '../interfaces/Message';
import { cloneElement } from 'react';
import { getDoc } from '@react-native-firebase/firestore';
import message from '../message';

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
    startAfterDoc: QueryDocumentSnapshot | null = null
): Promise<{ messages: Message[], lastVisible: QueryDocumentSnapshot | null }> {
    try {
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        let messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(limitCount));

        if(startAfterDoc) {
            messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'), startAfter(startAfterDoc), limit(limitCount));
        }

        const querySnapshot = await getDocs(messagesQuery);
        const messages = querySnapshot.docs.map(doc => doc.data() as Message);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

        return { messages, lastVisible };
        
    } catch (error) {
        console.error("Error fetching messages:", error);
        return { messages: [], lastVisible: null };
    }
}