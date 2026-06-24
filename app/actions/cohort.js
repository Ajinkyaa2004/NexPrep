'use server';

import dbConnect from '../../utils/mongodb';
import { Cohort, CohortMember } from '../../utils/cohortModels';
import { MockInterview, UserAnswer } from '../../utils/models';
import { verifyAuthToken } from '../../firebase/admin';
import moment from 'moment';

async function verifiedUser(idToken) {
  const auth = await verifyAuthToken(idToken);
  return auth?.email ? { email: auth.email, name: auth.name } : null;
}

function generateCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let c = '';
  for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

export async function createCohort({ name, description }, idToken) {
  try {
    const user = await verifiedUser(idToken);
    if (!user) return { success: false, error: 'Not authenticated.' };
    if (!name || !name.trim()) return { success: false, error: 'Cohort name is required.' };

    await dbConnect();
    // Generate a unique invite code (retry on the rare collision).
    let code;
    for (let attempt = 0; attempt < 6; attempt++) {
      code = generateCode();
      const exists = await Cohort.findOne({ code }).lean();
      if (!exists) break;
      code = null;
    }
    if (!code) return { success: false, error: 'Could not generate a code, please retry.' };

    await Cohort.create({
      code,
      name: name.trim().slice(0, 120),
      description: (description || '').trim().slice(0, 500),
      ownerEmail: user.email,
      ownerName: user.name || user.email.split('@')[0],
      createdAt: moment().format('DD-MM-YYYY'),
    });
    return { success: true, code };
  } catch (error) {
    console.error('createCohort error:', error);
    return { success: false, error: error.message };
  }
}

export async function getMyCohorts(idToken) {
  try {
    const user = await verifiedUser(idToken);
    if (!user) return { teaching: [], enrolled: [] };
    await dbConnect();

    const owned = await Cohort.find({ ownerEmail: user.email }).sort({ _id: -1 }).lean();
    const teaching = await Promise.all(owned.map(async (c) => ({
      ...c,
      memberCount: await CohortMember.countDocuments({ cohortCode: c.code }),
    })));

    const memberships = await CohortMember.find({ studentEmail: user.email }).lean();
    const codes = memberships.map((m) => m.cohortCode);
    const enrolledRaw = codes.length ? await Cohort.find({ code: { $in: codes } }).lean() : [];
    const enrolled = await Promise.all(enrolledRaw.map(async (c) => ({
      code: c.code, name: c.name, description: c.description, ownerName: c.ownerName,
      memberCount: await CohortMember.countDocuments({ cohortCode: c.code }),
    })));

    return {
      teaching: JSON.parse(JSON.stringify(teaching)),
      enrolled: JSON.parse(JSON.stringify(enrolled)),
    };
  } catch (error) {
    console.error('getMyCohorts error:', error);
    return { teaching: [], enrolled: [] };
  }
}

export async function joinCohort(code, idToken) {
  try {
    const user = await verifiedUser(idToken);
    if (!user) return { success: false, error: 'Not authenticated.' };
    const clean = (code || '').trim().toUpperCase();
    if (!clean) return { success: false, error: 'Enter an invite code.' };

    await dbConnect();
    const cohort = await Cohort.findOne({ code: clean }).lean();
    if (!cohort) return { success: false, error: 'No cohort found with that code.' };
    if (cohort.ownerEmail === user.email) return { success: false, error: 'You own this cohort.' };

    const existing = await CohortMember.findOne({ cohortCode: clean, studentEmail: user.email }).lean();
    if (existing) return { success: false, error: 'You have already joined this cohort.' };

    await CohortMember.create({
      cohortCode: clean,
      studentEmail: user.email,
      studentName: user.name || user.email.split('@')[0],
      joinedAt: moment().format('DD-MM-YYYY'),
    });
    return { success: true, name: cohort.name };
  } catch (error) {
    console.error('joinCohort error:', error);
    return { success: false, error: error.message };
  }
}

export async function getCohortDetail(code, idToken) {
  try {
    const user = await verifiedUser(idToken);
    if (!user) return null;
    await dbConnect();

    const clean = (code || '').trim().toUpperCase();
    const cohort = await Cohort.findOne({ code: clean }).lean();
    // Only the owner may view the cohort's student progress.
    if (!cohort || cohort.ownerEmail !== user.email) return null;

    const members = await CohortMember.find({ cohortCode: clean }).sort({ _id: 1 }).lean();

    const roster = await Promise.all(members.map(async (m) => {
      const interviews = await MockInterview.countDocuments({ createdBy: m.studentEmail });
      const answers = await UserAnswer.find({ userEmail: m.studentEmail }).lean();
      const ratings = answers.map((a) => Number(a.rating) || 0).filter((r) => r > 0);
      const avg = ratings.length ? +(ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1) : 0;
      return {
        email: m.studentEmail,
        name: m.studentName || m.studentEmail.split('@')[0],
        joinedAt: m.joinedAt,
        interviews,
        questionsAnswered: ratings.length,
        avgScore: avg,
      };
    }));

    return JSON.parse(JSON.stringify({
      code: cohort.code,
      name: cohort.name,
      description: cohort.description,
      createdAt: cohort.createdAt,
      roster,
    }));
  } catch (error) {
    console.error('getCohortDetail error:', error);
    return null;
  }
}
