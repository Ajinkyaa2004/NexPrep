// Updated to use MongoDB instead of Drizzle/Neon
import mongoose from 'mongoose';
import dbConnect from '../utils/mongodb.js';
import { MockInterview, UserAnswer } from '../utils/models.js';

async function seedDemoData() {
    const targetEmails = ["demo@gmail.com", "test@gmail.com", "user@example.com"];

    console.log("Starting seed for demo feedback dashboard...");

    try {
        await dbConnect();

        for (const email of targetEmails) {
            console.log(`Seeding for ${email}...`);

        // 1. Create a Mock Interview
        const timestamp = Date.now();
        const mockId = `demo-react-${timestamp}`;

        const interviewData = {
            mockId: mockId,
            jsonMockResp: JSON.stringify([
                {
                    question: "What are the key features of React?",
                    answer: "Virtual DOM, Components, Unidirectional Data Flow, JSX"
                },
                {
                    question: "Explain the difference between State and Props.",
                    answer: "State is internal and mutable, Props are external and immutable."
                },
                {
                    question: "What is the useEffect hook used for?",
                    answer: "Side effects like data fetching, subscriptions, timer."
                }
            ]),
            jobPosition: "Senior React Developer",
            jobDescription: "Technical leadership, React architecture, Performance optimization",
            jobExperience: "5",
            createdBy: email,
            createdAt: new Date().toLocaleDateString('en-GB'), // e.g. 20/12/2025
            selectedDuration: "30",
            selectedDifficulty: "Hard"
        };

        await MockInterview.create(interviewData);
        console.log(`  Created MockInterview: ${mockId}`);

        // 2. Create User Answers (Feedback)
        const feedbackData = [
            {
                mockIdRef: mockId,
                question: "What are the key features of React?",
                correctAns: "Key features include Virtual DOM, Component-based architecture, Unidirectional data flow, and JSX.",
                userAns: "React uses a virtual DOM to improve performance. It is component-based which allows reusability. It also uses one-way data binding.",
                feedback: "Good answer! You covered the main points. You could also mention JSX and the ecosystem.",
                rating: "4",
                strength: "Strong understanding of core concepts",
                userEmail: email,
                createdAt: new Date().toLocaleDateString('en-GB')
            },
            {
                mockIdRef: mockId,
                question: "Explain the difference between State and Props.",
                correctAns: "Props are arguments passed into React components. State is managed within the component. Props are immutable, State is mutable.",
                userAns: "Props are like function arguments, passed from parent to child. State is local to the component and can change.",
                feedback: "Excellent explanation. Concise and accurate.",
                rating: "5",
                strength: "Clear distinction made",
                userEmail: email,
                createdAt: new Date().toLocaleDateString('en-GB')
            },
            {
                mockIdRef: mockId,
                question: "What is the useEffect hook used for?",
                correctAns: "useEffect is used for performing side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.",
                userAns: "It's for side effects. Like when you need to load data when the page loads.",
                feedback: "Correct, but a bit brief. You should mention the dependency array and cleanup function for a complete answer.",
                rating: "3",
                strength: "Basic understanding present",
                userEmail: email,
                createdAt: new Date().toLocaleDateString('en-GB')
            }
        ];

        await UserAnswer.insertMany(feedbackData);
        console.log(`  Created ${feedbackData.length} UserAnswer records.`);
    }

    console.log("Seed completed successfully!");
    await mongoose.connection.close();
    console.log("Database connection closed.");
    } catch (err) {
        console.error("Error during seeding:", err);
        await mongoose.connection.close();
    }
}

seedDemoData();
