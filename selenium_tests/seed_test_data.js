// Seeds a deterministic interview + feedback record for the Selenium suite.
// Run: MONGODB_URI=mongodb://127.0.0.1:27017/nexprep node selenium_tests/seed_test_data.js
import mongoose from 'mongoose';
import dbConnect from '../utils/mongodb.js';
import { MockInterview, UserAnswer } from '../utils/models.js';

const MOCK_ID = 'selenium-test-interview';
// Must match the account the Selenium suite signs in as, so ownership checks pass.
const OWNER = process.env.SEED_EMAIL || 'selenium.tester@example.com';

async function run() {
  await dbConnect();

  await MockInterview.deleteMany({ mockId: MOCK_ID });
  await UserAnswer.deleteMany({ mockIdRef: MOCK_ID });

  await MockInterview.create({
    mockId: MOCK_ID,
    jsonMockResp: JSON.stringify({
      interview: {
        ice_breaker: [{ question: 'Tell me about yourself.', answer: 'A concise professional summary.' }],
        tech_core: [{ question: 'What is a closure in JavaScript?', answer: 'A function bundled with its lexical scope.' }],
        situational: [{ question: 'Describe a conflict you resolved in a team.', answer: 'Use the STAR method.' }],
      },
    }),
    jobPosition: 'Selenium Test Role',
    jobDescription: 'Automated test interview for the Selenium suite.',
    jobExperience: '2',
    createdBy: OWNER,
    createdAt: '22-06-2026',
    selectedDuration: '15 min',
    selectedDifficulty: 'Intermediate',
  });

  await UserAnswer.create({
    mockIdRef: MOCK_ID,
    question: 'Tell me about yourself.',
    correctAns: 'A concise professional summary.',
    userAns: 'I am a developer with two years of experience building web apps.',
    feedback:
      '**Overall Impression**: Clear and concise answer. **Correctness vs Expected Answer**: Aligns well with expectations. **Missing Key Concepts**: Could add a specific achievement. **Final Recommendation**: Moderate',
    strength: 'Good clarity and structure.',
    rating: '7',
    userEmail: OWNER,
    createdAt: '22-06-2026',
  });

  console.log('SEED_OK ' + MOCK_ID);
  await mongoose.connection.close();
}

run().catch((e) => {
  console.error('SEED_FAIL', e.message);
  process.exit(1);
});
