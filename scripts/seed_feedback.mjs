// This script has been updated to use MongoDB instead of Drizzle/Neon
import mongoose from 'mongoose';
import dbConnect from '../utils/mongodb.js';
import { MockInterview, UserAnswer } from '../utils/models.js';

async function seedFeedback() {
    const userEmail = "valorant.jpx@gmail.com";
    console.log(`Finding latest interview for ${userEmail}...`);

    try {
        await dbConnect();
        
        // 1. Get latest interview
        const latestInterview = await MockInterview.findOne({ createdBy: userEmail })
            .sort({ _id: -1 });

        if (!latestInterview) {
            console.error("No interview found for this user!");
            await mongoose.connection.close();
            return;
        }

        const mockId = latestInterview.mockId;
        console.log("Found latest Mock ID:", mockId);

        // 2. Insert Feedback/Answers
        console.log("Inserting feedback...");
        await UserAnswer.insertMany([
            {
                mockIdRef: mockId,
                question: "How do you handle an aggressive push on Bind B Site?",
                correctAns: "Use utility to slow them down, communicate with teammates, and play for retake if necessary.",
                userAns: "I would smoke off multiple angles and use a molly to stop the rush. Then I'd call for a rotate.",
                feedback: "Excellent tactical response. Using utility to delay is key. Communication is also highlighted correctly.",
                rating: "9",
                userEmail: userEmail,
                createdAt: "11-12-2025",
                strength: "Great utility usage awareness."
            },
            {
                mockIdRef: mockId,
                question: "Explain the economy management after winning the pistol round.",
                correctAns: "Buy heavy shielding and SMGs/Ghost/Sheriff to ensure round 2 win (anti-eco). build bank.",
                userAns: "We should force buy spectres and shields to guarantee the second round win.",
                feedback: "Correct. Forcing after winning pistol is standard meta to secure the anti-eco round.",
                rating: "10",
                userEmail: userEmail,
                createdAt: "11-12-2025",
                strength: "Perfect understanding of game economy."
            },
            {
                mockIdRef: mockId,
                question: "What is the role of a Sentinel?",
                correctAns: "Lock down sites, watch flanks, and provide information.",
                userAns: "Sentinels are supposed to watch the flank and use setups to stop rushes.",
                feedback: "Accurate. Watching flank and site hold are the primary duties.",
                rating: "8",
                userEmail: userEmail,
                createdAt: "11-12-2025",
                strength: "Good role definition."
            }
        ]);

        console.log("Feedback data seeded successfully!");
        console.log("Please refresh the feedback page.");
        
        await mongoose.connection.close();
        console.log("Database connection closed.");

    } catch (err) {
        console.error("Error seeding feedback:", err);
        await mongoose.connection.close();
    }
}

seedFeedback();
