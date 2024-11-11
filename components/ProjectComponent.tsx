import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/config/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface ProjectData {
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
}

interface ProjectContextType {
  projects: ProjectData[];
  loading: boolean;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectList: ProjectData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          projectList.push({
            name: data.name,
            description: data.description,
            id: doc.id,
            keyPartners: data.keyPartners,
            keyActivities: data.keyActivities,
            keyResources: data.keyResources,
            valuePropositions: data.valuePropositions,
            customerRelationships: data.customerRelationships,
            channels: data.channels,
            customerSegments: data.customerSegments,
            costStructure: data.costStructure,
            revenueStreams: data.revenueStreams,
            createdAt: data.createdAt.toDate(),
            userId: data.userId,
          });
        });

        setProjects(projectList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, loading }}>
      {children}
    </ProjectContext.Provider>
  );
};
