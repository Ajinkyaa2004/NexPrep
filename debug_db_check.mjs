// Updated to use MongoDB instead of Drizzle/Neon
import mongoose from 'mongoose';
import dbConnect from './utils/mongodb.js';
import { UserAnswer } from './utils/models.js';

async function checkData() {
    console.log("Checking UserAnswer collection...");
    try {
        await dbConnect();
        
        const result = await UserAnswer.find()
            .sort({ _id: -1 })
            .limit(10)
            .lean();
            
        console.log(`Found ${result.length} records.`);
        if (result.length > 0) {
            console.log("Last 10 records (descending):");
            console.log(JSON.stringify(result.map(r => ({
                id: r._id,
                mockIdRef: r.mockIdRef,
                createdAt: r.createdAt,
                feedback_preview: r.feedback?.substring(0, 50)
            })), null, 2));
        } else {
            console.log("Collection is empty.");
        }
        
        await mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error querying DB:", error);
        await mongoose.connection.close();
    }
}

checkData();
