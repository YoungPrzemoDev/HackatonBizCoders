export interface User {
    id: string;
    firstName: string;
    lastName: string;
    login: string;
    paswword: string;
    email: string;
    joinDate: Date;
    profilePicUrl?: string;
    lastSeen: number;
    userType?: "Businessman" | "Scientist";
    about: string;
    tags: string[]; //np AI, UML, IOT
    groups: string[];
  }

export interface BasicUser {
  firstName: string;
  profilePicUrl: string;
}