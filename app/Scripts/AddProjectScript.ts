import { db } from '../../config/FirebaseConfig';
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';

// Static project data
const exampleProjects = [
  {
    id: 1,
    userId: 1,
    name: 'AI Research Project',
    description: 'Unlocking the potential of AI for image recognition and advancing real-world applications, creating groundbreaking impacts in multiple industries.',
    longDescription: 'This project involves a comprehensive investigation into the use of artificial intelligence, particularly for enhancing image recognition capabilities, with the goal of transforming critical industries like healthcare, automotive, and security. By developing and refining advanced algorithms capable of high-precision detection and classification, we aim to significantly elevate current practices within these sectors. The initiative includes leveraging cutting-edge deep learning techniques, convolutional neural networks (CNNs), and state-of-the-art machine learning frameworks to create robust AI models that can effectively solve real-world problems. This work will address the major challenges of data privacy, model interpretability, scalability, and the real-time deployment of AI. Furthermore, the project aims to explore and develop ethical guidelines for the safe and fair use of AI technologies. We plan to collaborate with partners across multiple industries to ensure successful integration of AI into existing workflows, boosting efficiency, reliability, and overall productivity.',
    tags: ['AI', 'Research', 'Image Recognition'],
    createdAt: serverTimestamp(),
    image: 'https://example.com/sample-image-ai.jpg'
  },
  {
    id: 2,
    userId: 2,
    name: 'Green Energy Initiative',
    description: 'Revolutionizing energy with innovative and sustainable renewable solutions for a cleaner, better future.',
    longDescription: 'The Green Energy Initiative is focused on spearheading research and advancement in sustainable energy sources as a strategic move to combat the severe threats posed by climate change. This project encompasses the development and deployment of renewable energy technologies, including solar, wind, and hydroelectric power, with a clear emphasis on dramatically reducing global carbon emissions and fostering an environmentally conscious world. An essential aspect of the project involves improving the efficiency of energy storage systems, such as advanced battery technologies and smart grid infrastructure, to ensure that renewable energy is generated, stored, and distributed efficiently and seamlessly. Furthermore, the project will explore urban and rural frameworks for the adoption of renewable technologies, emphasizing the use of smart, interconnected solutions that make energy consumption more sustainable. A significant component includes extensive public outreach and education campaigns designed to promote the widespread adoption of green energy solutions, thus encouraging local communities, private industries, and governments to collaborate in building a sustainable energy ecosystem. This initiative aims to shape a future where clean and renewable energy is both affordable and accessible to everyone, empowering the next generation to adopt a cleaner and healthier lifestyle.',
    tags: ['Green Energy', 'Sustainability', 'Renewable'],
    createdAt: serverTimestamp(),
    image: 'https://example.com/sample-image-green.jpg'
  },
  {
    id:3,
    userId: 3,
    name: 'Medical Research App',
    description: 'A powerful platform aimed at transforming medical data analysis, fostering collaboration among researchers worldwide.',
    longDescription: 'This project involves developing a highly advanced and innovative application specifically tailored to meet the needs of medical researchers by providing them with a platform for efficient data management, in-depth analytics, and enhanced collaboration. The application features a robust set of tools designed to facilitate the organization and analysis of large medical datasets, helping researchers derive meaningful insights from complex data. Key features include interactive and intuitive data visualization capabilities, real-time analytics dashboards, and customizable statistical models suitable for clinical trials, epidemiological studies, and other healthcare research. The app will incorporate secure cloud-based storage to protect sensitive patient information, adhering to the highest standards of data privacy and security. Additionally, the integration of machine learning capabilities will assist researchers in identifying patterns, predicting patient outcomes, and formulating new hypotheses based on existing data. Built-in communication tools will enable researchers to easily share findings and collaborate with peers globally, making breakthroughs in medical research faster and more efficient. By utilizing AI-driven suggestions, the platform will play a crucial role in advancing personalized medicine, enhancing patient care, and making a significant contribution to the healthcare field as a whole.',
    tags: ['Medicine', 'Research', 'App Development'],
    createdAt: serverTimestamp(),
    image: 'https://example.com/sample-image-medical.jpg'
  },
  {
    id:4,
    userId:4,
    name: 'Smart Agriculture System',
    description: 'Transforming modern agriculture through AI-driven insights and smart, data-driven technologies for a sustainable future.',
    longDescription: 'The Smart Agriculture System project is designed to revolutionize traditional farming practices by integrating cutting-edge technology and data-driven insights to optimize productivity and sustainability. Utilizing IoT (Internet of Things) devices to monitor soil quality, weather patterns, and crop health, the system provides farmers with critical real-time data that helps them make informed decisions. Machine learning algorithms are used to analyze data and predict outcomes such as pest infestations, water requirements, and optimal harvesting times, allowing farmers to take proactive measures to mitigate risks. The system is designed to maximize crop yield, minimize resource usage, and promote sustainable farming practices by optimizing water consumption and reducing dependency on chemical fertilizers. Moreover, the Smart Agriculture System aims to create a resilient and adaptive farming framework capable of meeting the growing global food demands while addressing the challenges posed by climate change. By integrating renewable energy sources to power farm operations and adopting environment-friendly techniques, this project also emphasizes sustainability, ensuring that agricultural practices are not only productive but also ecologically responsible. Through partnerships with agricultural research institutions and technology providers, the project aims to create an innovative ecosystem that will empower farmers worldwide to adopt more efficient and sustainable methods of cultivation.',
    tags: ['Agriculture', 'IoT', 'AI'],
    createdAt: serverTimestamp(),
    image: 'https://example.com/sample-image-agriculture.jpg'
  },
  {
    id:5,
    userId:5,
    name: 'Blockchain for Supply Chain',
    description: 'Utilizing blockchain to achieve full transparency, security, and traceability in supply chain logistics.',
    longDescription: 'The Blockchain for Supply Chain project is a transformative initiative aimed at overhauling the traditional supply chain system by introducing blockchain technology to ensure unparalleled transparency, security, and traceability throughout the logistics process. By employing a decentralized, immutable ledger, every transaction and movement of goods within the supply chain is recorded and verified, creating a transparent audit trail that can be accessed by all stakeholders. This project addresses critical challenges such as counterfeiting, fraud, inefficiencies, and a lack of trust, which are common issues in conventional supply chain systems. The integration of blockchain into supply chains will significantly reduce administrative costs by eliminating intermediaries and leveraging smart contracts to automate essential operations like payments, compliance checks, and shipping updates. These smart contracts will help streamline processes, ensuring that predefined conditions are met before actions are executed, reducing the risk of human error and enhancing efficiency. The project will also explore the integration of IoT devices to feed real-time data into the blockchain network, ensuring up-to-the-minute accuracy in the tracking of goods. By fostering collaborations with logistics companies, suppliers, and technology providers, this initiative aims to facilitate the adoption of blockchain within the supply chain sector, enhancing consumer trust, reducing risks, and ensuring compliance with regulatory standards. Ultimately, the Blockchain for Supply Chain project envisions a future where all transactions are transparent, secure, and accessible to every participant, thereby elevating the integrity of global trade.',
    tags: ['Blockchain', 'Supply Chain', 'Security'],
    createdAt: serverTimestamp(),
    image: 'https://example.com/sample-image-blockchain.jpg'
  }
];

async function addProjectsToFirestore() {
  try {
    const projectRef = collection(db, 'projects');

    for (const project of exampleProjects) {
      await setDoc(doc(projectRef, project.id.toString()), project);
      console.log(`Project with ID ${project.id} added successfully`);
    }

    console.log('All projects have been added to Firestore.');
  } catch (error) {
    console.error('Error adding projects to Firestore:', error);
  }
}

//addProjectsToFirestore();