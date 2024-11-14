import { db } from "@/config/FirebaseConfig";
import { collection, getDocs, serverTimestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ProjectData {
  id: string;
  userId: string;
  name: string;
  description: string;
  longDescription: string;
  tags: string[];
  createdAt: Date;
  image: string;
}

export const fetchProjects = async (): Promise<ProjectData[]> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectList: ProjectData[] = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      projectList.push({
        id: doc.id, // or use docData.newId if available
        userId: docData.userId || userId, // Use fetched or local user ID
        name: docData.name || '',
        description: docData.description || '',
        longDescription: docData.longDescription || '', // New field, add fallback if missing
        tags: docData.tags || [], // New field, default to empty array if missing
        createdAt: docData.createdAt ? docData.createdAt.toDate() : serverTimestamp(), // Handle missing timestamp
        image: docData.image || 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg', // Default image
      });
    });
    return projectList;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};