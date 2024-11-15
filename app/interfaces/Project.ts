import { Timestamp } from "firebase/firestore";

export interface Project {
    id: string;
    createdAt: Timestamp;
    description: string;
    longDescription: string;
    image: string;
    name: string;
    tags: [];
    members: [];
    userId: string;
}

export interface ProjectToNotification {
    id: string,
    imageUrl: string,
    ownerId: string,
    name: string,
    members: [];
}