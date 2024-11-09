import { db } from '../../config/FirebaseConfig'
import { collection, doc, addDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { Chat } from '../interfaces/Chat'
import { addMessageToChat } from './messageService';

export async function createChat(chatData: Omit<Chat, 'active' | 'createdAt'>): Promise<void> {
    try {
        const chatRef = collection(db, 'chats');
        const chatWithDefaults = {
            ...chatData,
            createdAt: Timestamp.now(),
            active: 0,
        };
        await addDoc(chatRef, chatWithDefaults);
    } catch (error) {
        console.error("Error creating chat: ", error);
    }
}

export async function activateChat(chatId: string): Promise<void> {
    try {
        const chatRef = doc(db, 'chats', chatId);
        const chatSnapshot = await getDoc(chatRef);

        if (chatSnapshot.exists()) {
            const chatData = chatSnapshot.data();
            if (chatData.active === 0) {
                await updateDoc(chatRef, { active: 1 });
                console.log(`Chat with Id ${chatId} has been activated`);
            } else {
                console.log(`chat with ID ${chatId} is already active`);
            }
        } else {
            console.log(`Chat with ID doesn't exists`);
        }

    } catch (error) {
        console.error("Error activating chat:", error);
    }
}