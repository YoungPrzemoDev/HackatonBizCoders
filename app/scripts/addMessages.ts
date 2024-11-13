import { Timestamp } from "firebase/firestore";
import { addMessageToChat } from '../services/messageService'; // Adjust the import path as needed
import { Message } from '../interfaces/Message';

const chatId = "MVDLyDcIWNMN33koP89z";
const participants = ["1", "4", "5", "6"];
const initialTimestamp = Timestamp.fromDate(new Date("2024-11-09T14:17:16Z")); // Starting timestamp

// Generate 15 messages
const messages: Message[] = Array.from({ length: 15 }, (_, i) => ({
    text: `Message ${i + 1} for Research Team chat.`,
    sentAt: Timestamp.fromMillis(initialTimestamp.toMillis() + i * 60 * 1000), // Increment by 1 minute
    sentBy: participants[Math.floor(Math.random() * participants.length)],
    type: "text"
}));

async function addMessagesToChat() {
    for (const message of messages) {
        await addMessageToChat(chatId, message);
    }
    console.log("15 messages added to the chat.");
}

// Run the function to add messages
//addMessagesToChat();