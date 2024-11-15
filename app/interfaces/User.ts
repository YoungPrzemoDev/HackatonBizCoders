export interface User {
    id: string;
    firstName: string;
    lastName: string;
    login: string;
    password: string;
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
  id: string;
  firstName: string;
  profilePicUrl: string;
}

export interface UserToNotification {
  id: string,
  firstName: string,
  lastName: string,
  profilePicUrl: string,
  email: string,
  // lastSeen: number,
  userType?: "Businessman" | "Scientist",
  about: string,
  tags: string[];
}