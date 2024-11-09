import { db } from '../../config/FirebaseConfig';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { User } from '../interfaces/User';

export const fetchParticipants = async (participantsIds: string[]): Promise<User[]> => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            where('id', 'in', participantsIds)
        );

        const querySnapshot = await getDocs(q);
        const participants = querySnapshot.docs.map(doc => {
            const data = doc.data() as DocumentData;
            return {
                id: doc.id,
                firstName: data.firstName,
                profilePicUrl: data.profilePicUrl
            } as User
        });

        return participants;
    } catch (error) {
        console.error("Error fetching participants details:", error);
        return [];
    }
};