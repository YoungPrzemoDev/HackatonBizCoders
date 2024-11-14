import { collection, doc, getDoc, query, where } from "firebase/firestore"
import { ProjectToNotification } from "../interfaces/Project"
import { db } from "@/config/FirebaseConfig"


export const fetchNotificationProjectById = async (projectId: string): Promise<ProjectToNotification | null> => {
    try {
        const docRef = doc(db, "projects", projectId.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const projectData = docSnap.data();

            const project: ProjectToNotification = {
                id: projectData.id,
                imageUrl: projectData.image,
                ownerId: projectData.userId,
                name: projectData.name
            }

            return project;
        } else {
            console.warn(`Project with ID ${projectId} not found`);
            return null;
        }
    } catch(error) {
        console.error("Error fetching project: ", error);
        return null;
    }
}