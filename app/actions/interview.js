'use server';

import dbConnect from '../../utils/mongodb';
import { MockInterview, UserAnswer } from '../../utils/models';

export async function createInterview(data) {
  try {
    await dbConnect();
    const newInterview = await MockInterview.create(data);
    return { success: true, mockId: newInterview.mockId };
  } catch (error) {
    console.error('Error creating interview:', error);
    return { success: false, error: error.message };
  }
}

export async function getInterviewList(email) {
  try {
    await dbConnect();
    const interviews = await MockInterview.find({
      $or: [
        { createdBy: email },
        { createdBy: "demo@gmail.com" }
      ]
    }).sort({ _id: -1 }).lean();
    
    return JSON.parse(JSON.stringify(interviews));
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return [];
  }
}

export async function getInterviewById(mockId) {
  try {
    await dbConnect();
    const interview = await MockInterview.findOne({ mockId }).lean();
    return JSON.parse(JSON.stringify(interview));
  } catch (error) {
    console.error('Error fetching interview:', error);
    return null;
  }
}

export async function createUserAnswer(data) {
  try {
    await dbConnect();
    const answer = await UserAnswer.create(data);
    return { success: true, data: JSON.parse(JSON.stringify(answer)) };
  } catch (error) {
    console.error('Error creating user answer:', error);
    return { success: false, error: error.message };
  }
}

export async function getFeedbackList(mockIdRef) {
  try {
    await dbConnect();
    const feedbackList = await UserAnswer.find({ mockIdRef })
      .sort({ _id: 1 })
      .lean();
    
    return JSON.parse(JSON.stringify(feedbackList));
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
}

export async function getDashboardStats(email) {
  try {
    await dbConnect();
    
    const interviews = await MockInterview.find({
      $or: [
        { createdBy: email },
        { createdBy: "demo@gmail.com" }
      ]
    }).lean();

    const answers = await UserAnswer.find({
      $or: [
        { userEmail: email },
        { userEmail: "demo@gmail.com" },
        { userEmail: "test@gmail.com" }
      ]
    }).lean();

    return {
      interviews: JSON.parse(JSON.stringify(interviews)),
      answers: JSON.parse(JSON.stringify(answers))
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { interviews: [], answers: [] };
  }
}
