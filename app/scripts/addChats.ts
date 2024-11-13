import { db } from '../../config/FirebaseConfig';
import { collection, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { Chat } from '../interfaces/Chat';

const chats: Chat[] = [
    {
        name: "Project Alpha",
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: "1",
        participants: ["1", "2", "3"],
        active: 1
    },
    {
        name: "Research Team",
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: "2",
        participants: ["1", "4", "5", "6"],
        active: 1
    },
    {
        name: "Development Group",
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: "3",
        participants: ["1", "3", "5", "7"],
        active: 1
    },
    {
        name: "Marketing Hub",
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: "4",
        participants: ["3", "4", "6", "7"],
        active: 1
    },
    {
        name: "Inactive Discussion",
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: "5",
        participants: ["1", "5", "7"],
        active: 0
    }
];

async function addChatsToFirestore() {
    const batch = writeBatch(db);

    chats.forEach(chat => {
        const chatRef = doc(collection(db, 'chats'));
        batch.set(chatRef, chat);
    });

    await batch.commit();
    console.log("Chats successfully added to Firestore");
}

// Call the function to add chats
//addChatsToFirestore();