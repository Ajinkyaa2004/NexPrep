// Updated to use MongoDB instead of Drizzle/Neon
import mongoose from 'mongoose';
import dbConnect from '../utils/mongodb.js';
import { MockInterview } from '../utils/models.js';

async function seed() {
    const mockId = "valorant-interview-" + Math.floor(Math.random() * 10000);
    const userEmails = ["testuser2@example.com", "valorant.jpx@gmail.com"];
    // Added valorant@gmail.com just in case the user meant that literal email

    console.log("Seeding data for Mock ID:", mockId);

    try {
        await dbConnect();
        
        for (const userEmail of userEmails) {
            // Mock Interview
            await MockInterview.create({
                mockId: mockId + "-" + userEmail.split('@')[0], // Ensure unique ID per user
                jsonMockResp: JSON.stringify({
                    interview: {
                        tactical: [
                            { question: "How do you handle an aggressive push on Bind B Site?", answer: "Use utility to slow them down..." }
                        ]
                    }
                }),
                jobPosition: "Valorant Analyst",
                jobDescription: "Game sense, Map knowledge, Utility usage",
                jobExperience: "5",
                createdBy: userEmail,
                createdAt: "11-12-2025",
                selectedDuration: "30 min",
                selectedDifficulty: "Advanced"
            });
        }


        console.log("Seeding complete!");
        await mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (err) {
        console.error("Error seeding:", err);
        await mongoose.connection.close();
    }
}

seed();
