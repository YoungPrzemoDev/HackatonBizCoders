import { db } from '../../config/FirebaseConfig';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { User } from '../interfaces/User';

const users: User[] = [
    {
        id: "5",
        firstName: "Alice",
        lastName: "Johnson",
        login: "alice.j",
        paswword: "password123",
        email: "alice.johnson@example.com",
        joinDate: new Date("2023-01-15"),
        profilePicUrl: "https://example.com/images/alice.jpg",
        lastSeen: Date.now(),
        userType: "Scientist",
        about: "Passionate about AI and its applications in healthcare.",
        tags: ["AI", "Machine Learning", "Healthcare"],
        groups: ["Research Group", "AI Enthusiasts"]
    },
    {
        id: "6",
        firstName: "Bob",
        lastName: "Smith",
        login: "bob.smith",
        paswword: "securePass456",
        email: "bob.smith@example.com",
        joinDate: new Date("2023-02-10"),
        profilePicUrl: "https://example.com/images/bob.jpg",
        lastSeen: Date.now(),
        userType: "Businessman",
        about: "Entrepreneur with a focus on IoT and smart city technologies.",
        tags: ["IoT", "Business Development", "Smart Cities"],
        groups: ["IoT Innovators", "Business Network"]
    },
    {
        id: "7",
        firstName: "Charlie",
        lastName: "Lee",
        login: "charlie.lee",
        paswword: "pass789",
        email: "charlie.lee@example.com",
        joinDate: new Date("2023-03-20"),
        profilePicUrl: "https://example.com/images/charlie.jpg",
        lastSeen: Date.now(),
        userType: "Scientist",
        about: "Researcher interested in the impact of UML and AI on software development.",
        tags: ["UML", "AI", "Software Engineering"],
        groups: ["Developers Hub", "AI and UML Researchers"]
    }
];

async function addUsersToFirestore() {
    const batch = writeBatch(db);  // Initialize a batch

    users.forEach(user => {
        const userRef = doc(collection(db, 'users'), user.id);  // Set document ID to user.id
        batch.set(userRef, user);  // Add each user to the batch
    });

    // Commit the batch
    await batch.commit();
    console.log("Users successfully added to Firestore");
}

// Call the function to add users
//addUsersToFirestore();