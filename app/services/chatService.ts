import { db } from '../../config/FirebaseConfig'
import { collection, doc, addDoc, getDoc, updateDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { Chat } from '../interfaces/Chat'
import { addMessageToChat } from './messageService';

export async function createChat(chatData: Omit<Chat, 'active' | 'createdAt'>): Promise<string | null> {
    try {
        const chatRef = collection(db, 'chats');
        const chatWithDefaults = {
            ...chatData,
            createdAt: Timestamp.now(),
            active: 1,
        };
        const docRef = await addDoc(chatRef, chatWithDefaults);
        return docRef.id;

    } catch (error) {
        console.error("Error creating chat: ", error);
        return null;
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

export async function findChatByProjectId(projectId: string): Promise<string | null> {
    try {
        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where('projectId', '==', projectId));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const chatDoc = querySnapshot.docs[0];
            console.log(`Chat found: ${chatDoc.id}`);
            return chatDoc.id;
        } else {
            console.log(`No chat found for projectId: ${projectId}`);
            return null;
        }
    } catch (error) {
        console.error("Error finding chat by projectId: ", error);
        return null;
    }
}

