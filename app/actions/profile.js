'use server';

import dbConnect from '../../utils/mongodb';
import { UserProfile } from '../../utils/profileModels';
import { verifyAuthToken } from '../../firebase/admin';
import moment from 'moment';

export async function getProfile(idToken) {
  try {
    const auth = await verifyAuthToken(idToken);
    if (!auth?.email) return null;
    await dbConnect();
    const profile = await UserProfile.findOne({ email: auth.email }).lean();
    return profile ? JSON.parse(JSON.stringify(profile)) : null;
  } catch (error) {
    console.error('getProfile error:', error);
    return null;
  }
}

export async function saveProfile(data, idToken) {
  try {
    const auth = await verifyAuthToken(idToken);
    if (!auth?.email) return { success: false, error: 'Not authenticated.' };
    if (!data?.targetRole?.trim()) return { success: false, error: 'Target role is required.' };

    await dbConnect();
    const update = {
      email: auth.email,
      name: (data.name || auth.name || '').toString().slice(0, 120),
      targetRole: data.targetRole.toString().slice(0, 120),
      experienceLevel: (data.experienceLevel || '').toString().slice(0, 40),
      focusAreas: (data.focusAreas || '').toString().slice(0, 400),
      targetCompany: (data.targetCompany || '').toString().slice(0, 160),
      goal: (data.goal || '').toString().slice(0, 60),
    };
    const existing = await UserProfile.findOne({ email: auth.email }).lean();
    if (!existing) update.onboardedAt = moment().format('DD-MM-YYYY');

    await UserProfile.findOneAndUpdate({ email: auth.email }, { $set: update }, { upsert: true, new: true });
    return { success: true };
  } catch (error) {
    console.error('saveProfile error:', error);
    return { success: false, error: error.message };
  }
}
