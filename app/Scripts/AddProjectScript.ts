import { db } from '../../config/FirebaseConfig';
import { collection, setDoc, doc, serverTimestamp } from 'firebase/firestore';

// Static project data
const projects = [
  {
    id: 1,
    name: 'Telehealth Platform',
        description: 'A dynamic telemedicine platform aimed at bridging the gap in healthcare access by facilitating remote medical consultations and follow-up care, with a focus on underserved areas.',
        keyPartners: 'Certified medical professionals, insurance providers for billing integration, telecommunications companies for reliable connectivity, health organizations for resource sharing, and legal advisors for HIPAA compliance.',
        keyActivities: 'Developing user-friendly interfaces for patients and doctors, integrating AI for preliminary diagnostics, creating secure channels for consultations, marketing to broaden reach in rural and urban centers, and continuous platform updates.',
        keyResources: 'Cloud-based IT infrastructure, a pool of licensed healthcare providers, data encryption technology for patient privacy, partnerships with medical software developers for integration.',
        valuePropositions: 'Convenient healthcare access, reduced wait times, integration with wearable health devices, secure and private communication, and multilingual support for diverse communities.',
        customerRelationships: 'Onboarding help for first-time users, periodic health tips through emails, in-app notifications for appointment reminders, and post-consultation surveys for service improvement.',
        channels: 'Mobile apps available on major platforms, partnerships with health centers, websites with accessible healthcare resources, and telehealth seminars.',
        customerSegments: 'Patients in remote areas, senior citizens with mobility issues, corporate clients for employee health benefits, and students requiring mental health support.',
        costStructure: 'Technology development and server costs, salaries for healthcare providers, marketing expenses, compliance with health data regulations, and app maintenance.',
        revenueStreams: 'Pay-per-consultation fees, corporate service packages, premium features for instant access to specialists, and partnerships with clinics for SaaS solutions.',
    image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
    userId: '5',
    createdAt: serverTimestamp(),
  },
  {
    id: 2,
    name: 'Artisan E-commerce Platform',
        description: 'A niche digital marketplace tailored to local artisans, showcasing hand-crafted, culturally significant items, and promoting artisan stories to connect buyers with creators.',
        keyPartners: 'Regional artisan cooperatives, sustainable packaging suppliers, influencer marketers specializing in handmade products, payment gateways with low transaction fees, logistics companies focused on fragile item handling.',
        keyActivities: 'Developing user-friendly platform interfaces, curating high-quality product listings, conducting workshops to help artisans enhance digital skills, managing logistics partnerships, and executing targeted marketing campaigns.',
        keyResources: 'Experienced development teams, reliable server infrastructure, creative product curation teams, strong relationships with artisan associations, comprehensive customer service frameworks.',
        valuePropositions: 'Access to one-of-a-kind handcrafted items, supporting local and indigenous communities, quality assurance, transparent artisan profiles, and exclusive behind-the-scenes content.',
        customerRelationships: 'Interactive live chat, personalized recommendations, loyalty points for frequent buyers, collaboration with artisans for limited editions, and community engagement events.',
        channels: 'Mobile app, partnerships with artisan fairs, a web-based e-commerce platform, collaborations with lifestyle influencers, and dedicated artisan newsletters.',
        customerSegments: 'Art collectors, cultural enthusiasts, environmentally conscious shoppers, tourists looking for authentic memorabilia, and buyers seeking unique gifts.',
        costStructure: 'Development and hosting costs, customer acquisition campaigns, content creation for educational programs, fees for logistic partnerships, and compliance with export laws.',
        revenueStreams: 'Sales commission from each transaction, artisan membership fees for premium exposure, targeted advertising, and exclusive partnerships for workshops and special collections.',
        image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',    userId: '4',
    createdAt: serverTimestamp(),
  },
  {
    id: 3,
    name: 'Green Energy Initiative',
        description: 'A comprehensive project integrating renewable energy technologies into homes and commercial properties, with an emphasis on sustainability and community engagement to foster a cleaner future.',
        keyPartners: 'Solar panel manufacturers with cutting-edge technology, environmental NGOs for awareness campaigns, local governments for subsidies, eco-friendly construction companies, financial partners for green financing options.',
        keyActivities: 'Research and enhancement of solar technology, designing customer-specific installation plans, organizing educational webinars, providing support for green certifications, setting up efficient supply chains for solar products.',
        keyResources: 'R&D facilities with top solar engineers, installation teams, educational material for sustainability workshops, partnerships with logistics companies for distribution of solar panels.',
        valuePropositions: 'Reduced long-term energy costs, eco-conscious living, tax incentives for sustainable projects, access to renewable energy expertise, and contribution to environmental conservation efforts.',
        customerRelationships: 'Dedicated energy consultants for personalized advice, community workshops, loyalty programs offering discounts for referrals, and comprehensive post-installation support.',
        channels: 'A user-friendly website, partnerships with real estate developers, renewable energy expos, direct sales teams, and strategic social media campaigns.',
        customerSegments: 'Environmentally aware homeowners, commercial real estate developers, schools adopting green programs, and small to mid-sized enterprises seeking sustainability certifications.',
        costStructure: 'High R&D costs for developing solar solutions, marketing expenses for public education, training staff for installation and support, and long-term partnerships with manufacturers.',
        revenueStreams: 'Direct sales of solar panels and installation services, long-term maintenance contracts, leasing of solar panel systems, and government incentives for green projects.',
        image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',    userId: '3',
    createdAt: serverTimestamp(),
  },
  {
    id: 4,
    name: 'Smart Agriculture Solutions',
    description: 'An innovative platform leveraging IoT to provide real-time monitoring and data-driven insights to farmers for optimized resource management and increased yield.',
    keyPartners: 'Agricultural universities for research collaborations, IoT hardware manufacturers, local cooperatives for pilot programs, government agricultural departments for grants, and data analysis firms.',
    keyActivities: 'Developing and deploying sensor technologies, training workshops for farmers, creating a robust data processing infrastructure, and conducting pilot studies to validate solutions.',
    keyResources: 'Expert agronomists, IoT equipment, partnerships with agricultural stakeholders, data scientists, and secure cloud storage for analytics.',
    valuePropositions: 'Reduced resource waste, predictive insights for crop management, increased yields through data optimization, and customized solutions for different farming scales.',
    customerRelationships: '24/7 tech support, training webinars, field support agents, and user forums for shared experiences and tips.',
    channels: 'Direct sales to cooperatives, agricultural expos, partnerships with farm equipment suppliers, and digital advertising in farming communities.',
    customerSegments: 'Small and medium farmers, agri-businesses, research institutes looking for scalable tech solutions, and sustainability-focused agricultural programs.',
    costStructure: 'R&D for sensor development, training staff, marketing outreach, hardware production, and field data management.',
    revenueStreams: 'Sales of hardware kits, subscription models for data analytics, training session fees, and collaborative projects with governments.',
    image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
    userId: '2',
    createdAt: serverTimestamp(),
  },
  {
    id: 5,
    name: 'AI-Powered Language Learning',
    description: 'A personalized AI-driven language learning platform that adapts to user preferences and proficiencies, designed for effective and engaging learning.',
    keyPartners: 'AI and machine learning companies, language experts for content development, educational institutions for pilot testing, marketing partners with global reach.',
    keyActivities: 'Developing and refining AI models, content creation and gamification of lessons, integration of voice recognition for speaking practice, user feedback collection for updates.',
    keyResources: 'AI-trained developers, content writers specializing in language education, cloud-based data processing capabilities, and speech analysis software.',
    valuePropositions: 'Flexible learning schedules, instant feedback on pronunciation, personalized lesson plans, engaging learning games, and real-world conversational practice.',
    customerRelationships: 'Online community for learners, personalized progress tracking, dedicated customer support, regular updates with new language challenges.',
    channels: 'App stores, collaborations with schools, language workshops, and social media marketing.',
    customerSegments: 'Students, professionals seeking language fluency, language hobbyists, schools incorporating technology into curricula, and corporations offering employee training.',
    costStructure: 'Platform hosting fees, app development, content licensing, marketing campaigns, and R&D for continued AI improvement.',
    revenueStreams: 'Monthly subscriptions, pay-as-you-go lessons, corporate licenses, and partnerships with schools for integrated solutions.',
    image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
    userId: '1',
    createdAt: serverTimestamp(),
  },
  {
    id: 6,
    name: 'Autonomous Delivery Drones',
    description: 'A scalable drone-based delivery solution focusing on last-mile delivery in urban areas to reduce traffic congestion and delivery times. Drones are equipped with sensors and AI algorithms to navigate city landscapes safely.',
    keyPartners: 'Drone manufacturers, municipal transportation authorities, AI technology providers, logistics companies, and cloud service providers for data management.',
    keyActivities: 'Developing efficient drone flight algorithms, regulatory compliance for drone operations, designing secure package locking systems, and maintaining a reliable fleet of drones.',
    keyResources: 'Fleet of autonomous drones, AI navigation software, partnerships with logistics firms, urban mapping data, and cloud storage for data logs.',
    valuePropositions: 'Fast and contactless delivery, eco-friendly solution reducing carbon emissions, integration with existing e-commerce platforms, and real-time tracking for customers.',
    customerRelationships: '24/7 customer support, regular feedback collection, loyalty programs for frequent users, and informative push notifications on delivery progress.',
    channels: 'Partnerships with e-commerce platforms, dedicated mobile apps, drone expo demonstrations, and targeted advertising in urban areas.',
    customerSegments: 'E-commerce companies, pharmaceutical chains needing fast delivery, grocery stores for perishable item delivery, and technology enthusiasts.',
    costStructure: 'Drone maintenance, AI and software development, compliance with aviation laws, staff training, and promotional expenses.',
    revenueStreams: 'Per-delivery fees, partnerships with large retail chains, premium subscriptions for faster delivery, and government subsidies for eco-friendly solutions.',
    image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
    userId: '5',
    createdAt: serverTimestamp(),
  },
  {
    id: 7,
    name: 'Blockchain-Based Voting Platform',
    description: 'A secure and transparent voting platform leveraging blockchain technology to ensure tamper-proof and verifiable elections, improving trust in democratic processes.',
    keyPartners: 'Blockchain development firms, cybersecurity experts, government bodies, non-profit organizations advocating for transparent elections.',
    keyActivities: 'Developing blockchain-based voting algorithms, user authentication integration, data encryption for vote security, and organizing pilot tests in various regions.',
    keyResources: 'Blockchain development team, cybersecurity tools, partnerships with electoral commissions, secure cloud infrastructure.',
    valuePropositions: 'Unhackable voting system, transparency through public blockchain records, quick vote tallying, and confidence in election results.',
    customerRelationships: 'User onboarding and education campaigns, customer support hotline, partnerships with civic groups, and voter assistance programs.',
    channels: 'Government contracts, conferences on democratic processes, public awareness campaigns, and collaborations with universities.',
    customerSegments: 'Government election commissions, non-profit organizations, corporate boards for internal voting, and democratic initiatives worldwide.',
    costStructure: 'Blockchain network maintenance, software updates, public outreach, cybersecurity measures, and data center costs.',
    revenueStreams: 'Government contracts for election solutions, non-profit partnerships, consulting services for election security, and technology licensing.',
    image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
    userId: '4',
    createdAt: serverTimestamp(),
  },
  {
    id: 8,
    name: 'AI-Enhanced Medical Diagnosis',
    description: 'A sophisticated platform using AI to assist healthcare professionals with early diagnosis of diseases, leveraging big data and machine learning models trained on vast medical datasets.',
    keyPartners: 'Hospitals and clinics, medical device manufacturers, AI research labs, pharmaceutical companies for clinical data partnerships.',
    keyActivities: 'Data collection and analysis, AI algorithm training, collaborating with medical professionals for feedback, and regulatory compliance.',
    keyResources: 'Medical database, AI engineers, partnerships with hospitals, cloud-based analytics tools, and legal expertise for data privacy.',
    valuePropositions: 'Faster and more accurate diagnoses, reduced workload for healthcare professionals, early disease detection for better outcomes, and integration with existing hospital systems.',
    customerRelationships: 'In-app support for medical staff, continuous learning AI updates, webinars for healthcare training, and partnerships with medical institutions for feedback.',
    channels: 'Direct partnerships with healthcare providers, medical conferences, industry trade shows, and digital marketing to health-focused audiences.',
    customerSegments: 'Hospitals, private clinics, medical research institutions, and pharmaceutical companies.',
    costStructure: 'High costs for data storage and processing, R&D for AI models, marketing expenses, clinical trial partnerships, and compliance with healthcare regulations.',
    revenueStreams: 'Subscription fees for hospitals, licensing to clinics, revenue-sharing partnerships with healthcare providers, and sponsored research.',
    image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
    userId: '3',
    createdAt: serverTimestamp(),
  },
  {
    id: 9,
    name: 'Smart Home Energy Management System',
    description: 'A system designed to optimize energy use in homes through smart sensors and an AI-based energy manager, helping households save on utility bills and reduce carbon footprints.',
    keyPartners: 'Smart home device manufacturers, energy providers, sustainability consultants, software developers, and utility companies.',
    keyActivities: 'Developing AI algorithms for energy optimization, integrating with smart home devices, conducting pilot projects, and marketing the system to tech-savvy homeowners.',
    keyResources: 'AI-based software, smart sensors, strategic partnerships with utility companies, and cloud services for data processing.',
    valuePropositions: 'Lower energy bills, reduced carbon footprint, real-time energy usage insights, and compatibility with existing smart home ecosystems.',
    customerRelationships: 'User-friendly apps with tutorials, customer service teams, community outreach programs for sustainability, and informative workshops.',
    channels: 'E-commerce platforms, smart home expos, partnerships with energy providers, and targeted digital campaigns.',
    customerSegments: 'Homeowners, landlords, eco-conscious consumers, and property management companies.',
    costStructure: 'Hardware and software development, partnerships for installation, marketing campaigns, user training, and ongoing AI updates.',
    revenueStreams: 'One-time purchase fees, subscription for premium energy-saving features, partnerships with energy companies for data sharing, and training services.',
    image: 'https://c8.alamy.com/comp/2ATD2PG/science-medical-use-technology-medicine-lab-in-hospital-scientist-doing-some-research-vaccine-anti-virus-sampletechnology-medical-of-chemist-scient-2ATD2PG.jpg',
    userId: '2',
    createdAt: serverTimestamp(),
  },

];

async function addProjectsToFirestore() {
  try {
    const projectRef = collection(db, 'projects');

    for (const project of projects) {
      await setDoc(doc(projectRef, project.id.toString()), project);
      console.log(`Project with ID ${project.id} added successfully`);
    }

    console.log('All projects have been added to Firestore.');
  } catch (error) {
    console.error('Error adding projects to Firestore:', error);
  }
}
//addProjectsToFirestore();