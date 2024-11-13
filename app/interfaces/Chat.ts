import { Timestamp } from "firebase/firestore";
import { User } from "./User";

export interface Chat {
    name: string;
    createdAt: Timestamp; // Timestamp
    createdBy: string; // User ID of the creator
    participants: string[]; // Array of user IDs
    active: number;
  }

export interface ChatWithId extends Chat {
    id: string;
  }

export interface ChatWithParticipants extends ChatWithId {
  participantsDetails: User[];
}