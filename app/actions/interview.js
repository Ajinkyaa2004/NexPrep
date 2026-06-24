'use server';

import dbConnect from '../../utils/mongodb';
import { MockInterview, UserAnswer } from '../../utils/models';
import { verifyAuthToken } from '../../firebase/admin';

// Resolves the caller's verified email from a Firebase ID token.
// Returns null when the token is missing/invalid — callers must treat that as
// "unauthenticated" and refuse to read or write user data.
async function verifiedEmail(idToken) {
  const auth = await verifyAuthToken(idToken);
  return auth?.email || null;
}

export async function createInterview(data, idToken) {
  try {
    const email = await verifiedEmail(idToken);
    if (!email) return { success: false, error: 'Not authenticated. Please sign in again.' };

    await dbConnect();
    // Identity comes from the verified token, never the client payload.
    const newInterview = await MockInterview.create({ ...data, createdBy: email });
    return { success: true, mockId: newInterview.mockId };
  } catch (error) {
    console.error('Error creating interview:', error);
    return { success: false, error: error.message };
  }
}

export async function getInterviewList(idToken) {
  try {
    const email = await verifiedEmail(idToken);
    if (!email) return [];
    await dbConnect();
    const interviews = await MockInterview.find({ createdBy: email }).sort({ _id: -1 }).lean();
    return JSON.parse(JSON.stringify(interviews));
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return [];
  }
}

export async function getInterviewById(mockId, idToken) {
  try {
    const email = await verifiedEmail(idToken);
    if (!email) return null;
    await dbConnect();
    const interview = await MockInterview.findOne({ mockId }).lean();
    // Ownership check: only the creator may open the interview.
    if (!interview || interview.createdBy !== email) return null;
    return JSON.parse(JSON.stringify(interview));
  } catch (error) {
    console.error('Error fetching interview:', error);
    return null;
  }
}

export async function createUserAnswer(data, idToken) {
  try {
    const email = await verifiedEmail(idToken);
    if (!email) return { success: false, error: 'Not authenticated. Please sign in again.' };

    await dbConnect();
    // The answer must belong to an interview the caller owns.
    const interview = await MockInterview.findOne({ mockId: data.mockIdRef }).lean();
    if (!interview || interview.createdBy !== email) {
      return { success: false, error: 'Interview not found or access denied.' };
    }

    const answer = await UserAnswer.create({ ...data, userEmail: email });
    return { success: true, data: JSON.parse(JSON.stringify(answer)) };
  } catch (error) {
    console.error('Error creating user answer:', error);
    return { success: false, error: error.message };
  }
}

export async function getFeedbackList(mockIdRef, idToken) {
  try {
    const email = await verifiedEmail(idToken);
    if (!email) return [];
    await dbConnect();
    // Only return feedback for an interview the caller owns.
    const interview = await MockInterview.findOne({ mockId: mockIdRef }).lean();
    if (!interview || interview.createdBy !== email) return [];

    const feedbackList = await UserAnswer.find({ mockIdRef }).sort({ _id: 1 }).lean();
    return JSON.parse(JSON.stringify(feedbackList));
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
}

export async function deleteUserData(idToken) {
  try {
    const email = await verifiedEmail(idToken);
    if (!email) return { success: false, error: 'Not authenticated.' };
    await dbConnect();
    const interviews = await MockInterview.deleteMany({ createdBy: email });
    const answers = await UserAnswer.deleteMany({ userEmail: email });
    return {
      success: true,
      deleted: { interviews: interviews.deletedCount, answers: answers.deletedCount },
    };
  } catch (error) {
    console.error('Error deleting user data:', error);
    return { success: false, error: error.message };
  }
}

export async function getDashboardStats(idToken) {
  try {
    const email = await verifiedEmail(idToken);
    if (!email) return { interviews: [], answers: [] };
    await dbConnect();
    const interviews = await MockInterview.find({ createdBy: email }).lean();
    const answers = await UserAnswer.find({ userEmail: email }).lean();
    return {
      interviews: JSON.parse(JSON.stringify(interviews)),
      answers: JSON.parse(JSON.stringify(answers)),
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { interviews: [], answers: [] };
  }
}
