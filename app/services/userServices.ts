import { db } from '../../config/FirebaseConfig';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { BasicUser, User } from '../interfaces/User';

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

export const fetchGiftedUser = async (userId: string): Promise<BasicUser | null> => {
    try {
        const userRef = collection(db, 'users');
        const q = query(
            userRef,
            where('id', '==', userId)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data();

            const user: BasicUser = {
                firstName: data.firstName,
                profilePicUrl: data.profilePicUrl
            };

            return user;
        } else {
            console.warn(`User with ID ${userId} not found`);
            return null;
        }

    } catch (error) {
        console.error("Error fetching user: ", error);
        return null;
    }
}