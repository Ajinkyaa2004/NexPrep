import mongoose from 'mongoose';

// MockInterview Schema
const MockInterviewSchema = new mongoose.Schema({
  jsonMockResp: {
    type: String,
    required: true,
  },
  jobPosition: {
    type: String,
    required: true,
    maxlength: 500,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  jobExperience: {
    type: String,
    required: true,
    maxlength: 100,
  },
  createdBy: {
    type: String,
    required: true,
    maxlength: 320,
  },
  createdAt: {
    type: String,
    maxlength: 50,
  },
  mockId: {
    type: String,
    required: true,
    maxlength: 100,
    unique: true,
  },
  selectedDuration: {
    type: String,
    required: true,
    maxlength: 20,
  },
  selectedDifficulty: {
    type: String,
    required: true,
    maxlength: 50,
  },
}, {
  timestamps: false,
});

// UserAnswer Schema
const UserAnswerSchema = new mongoose.Schema({
  mockIdRef: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  question: {
    type: String,
    required: true,
  },
  correctAns: {
    type: String,
  },
  userAns: {
    type: String,
  },
  feedback: {
    type: String,
  },
  rating: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  createdAt: {
    type: String,
    maxlength: 2000,
  },
  strength: {
    type: String,
  },
}, {
  timestamps: false,
});

// Export models (use existing model if already compiled)
export const MockInterview = mongoose.models.MockInterview || mongoose.model('MockInterview', MockInterviewSchema);
export const UserAnswer = mongoose.models.UserAnswer || mongoose.model('UserAnswer', UserAnswerSchema);
