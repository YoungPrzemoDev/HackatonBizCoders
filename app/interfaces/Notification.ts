import { Timestamp } from "firebase/firestore";
import { UserToNotification } from "./User";
import { ProjectToNotification } from "./Project";

export interface Notification {
    project: ProjectToNotification,
    sender: UserToNotification,
    sentAt: Timestamp,
    read: boolean
}