import { db } from "@/config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ProjectData {
  name: string;
  description: string;
  id: string;
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valuePropositions: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
  createdAt: Date;
  userId: string;
  image: string;
  matchPercentage: string;
}

export const fetchProjects = async (): Promise<ProjectData[]> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectList: ProjectData[] = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      projectList.push({
        name: docData.name,
        description: docData.description,
        id: doc.id,
        keyPartners: docData.keyPartners,
        keyActivities: docData.keyActivities,
        keyResources: docData.keyResources,
        valuePropositions: docData.valuePropositions,
        customerRelationships: docData.customerRelationships,
        channels: docData.channels,
        customerSegments: docData.customerSegments,
        costStructure: docData.costStructure,
        revenueStreams: docData.revenueStreams,
        createdAt: docData.createdAt.toDate(),
        userId: docData.userId,
        image: docData.image , // Handle the new field
        matchPercentage: docData.matchPercentage || '',
      });
    });
    return projectList;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};