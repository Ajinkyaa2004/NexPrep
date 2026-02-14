// This file is kept for backward compatibility
// The project now uses MongoDB - see mongodb.js and models.js
import dbConnect from './mongodb.js';
import { MockInterview, UserAnswer } from './models.js';

// Re-export MongoDB connection and models
export { dbConnect as default, MockInterview, UserAnswer };

// Legacy export for compatibility
export const db = {
  async connect() {
    return await dbConnect();
  },
  MockInterview,
  UserAnswer
};
