import { db } from "@/config/FirebaseConfig";
import { collection, getDocs,doc,updateDoc,arrayUnion } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ProjectData {
  name: string;  // np. "Green Energy Initiative"
  description: string;  // np. "Revolutionizing energy..."
  id: number;  // np. 2
  createdAt: Date;  // Zmienna typu Date, przekształcamy timestamp na Date
  userId: number;  // np. 2
  image: string;  // np. "https://example.com/sample-image-green.jpg"
  longDescription: string;  // Długi opis projektu
  tags: string[];  // Tablica tagów (np. ["Green Energy", "Sustainability", "Renewable"])
}


 export const fetchProjects = async (): Promise<ProjectData[]> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectList: ProjectData[] = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      
      projectList.push({
        name: docData.name,  // np. "Green Energy Initiative"
        description: docData.description,  // np. "Revolutionizing energy..."
        id: docData.id,  // np. 2
        createdAt: docData.createdAt ? docData.createdAt.toDate() : new Date(),  // Przekształcenie timestamp na Date
        userId: docData.userId || 0,  // Ustawienie domyślnej wartości 0, jeśli brak
        image: docData.image || '',  // Ustawienie domyślnej pustej wartości, jeśli brak
        longDescription: docData.longDescription || '',  // Długi opis
        tags: docData.tags || [],  // Tablica tagów, domyślnie pusta tablica, jeśli brak
      });
    });
    return projectList;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const addProjectUser = async (projectId: string, userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      projects: arrayUnion(projectId),
    });
    console.log(`Added project  to user ${userId}`);
    return true;
  } catch (error) {
    console.error("Error adding project to user:", error);
    return false;
  }
};