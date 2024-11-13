import { Timestamp } from "firebase/firestore";

export interface Message {
    text: string;
    sentAt: Timestamp;
    sentBy: string;
    type: "text" | "image" | "video" | "file";
  }