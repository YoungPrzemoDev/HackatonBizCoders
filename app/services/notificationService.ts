import { db } from "@/config/FirebaseConfig";
import { UserToNotification } from "../interfaces/User";
import { fetchNotificationUserById } from "./userServices";
import { ProjectToNotification } from "../interfaces/Project";
import { fetchNotificationProjectById } from "./projectService";
import { Notification } from "../interfaces/Notification";
import { addDoc, collection, onSnapshot, Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export const addNotification = async (userId: string, projectId: string): Promise<void> => {
    try {
        const notificationUser: UserToNotification = await fetchNotificationUserById(userId);
        const notificationProject: ProjectToNotification = await fetchNotificationProjectById(projectId);

        if (!notificationUser || !notificationProject) {
            console.error("User or project not found");
        } else {
            console.log("User and project found");
            const notification: Notification = {
                project: notificationProject,
                sender: notificationUser,
                sentAt: Timestamp.now(),
                read: false
            }

            const notificationRef = collection(db, 'notifications');
            addDoc(notificationRef, notification);
            console.log("Notification add to db");
        }
    } catch (error) {
        console.error("Error adding notification to db: ", error);
    }
}

const navigateToNotification = (projectId: string, userId: string) => {
    router.push({
        pathname: '../Notification',
        params: { projectId, userId },
    })
}

export const listenToNotification = (
    currentUserId: string,
) => {
    const notificationRef = collection(db, "notifications");

    const unsubscribe = onSnapshot(notificationRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const notification = change.doc.data() as Notification;

                if (notification.project.ownerId.toString() === currentUserId) {
                    Toast.show({
                        type: "info",
                        text1: "New Request!",
                        text2: `You have new request to join the Project ${notification.project.name}`,
                        onPress: () => navigateToNotification(notification.project.id, notification.sender.id)
                    });

                }
            }
        });
    });

    return unsubscribe;
}
