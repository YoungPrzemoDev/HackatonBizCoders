import { Timestamp } from "firebase/firestore";

export interface Message {
    text: string;
    sentAt: Timestamp;
    sentBy: string;
    type: string;
    system: boolean;
  }