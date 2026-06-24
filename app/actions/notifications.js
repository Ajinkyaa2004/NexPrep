'use server';

import dbConnect from '../../utils/mongodb';
import { MockInterview, UserAnswer } from '../../utils/models';
import { Cohort, CohortMember } from '../../utils/cohortModels';
import { verifyAuthToken } from '../../firebase/admin';
import moment from 'moment';

function levelInfo(answered) {
  const thresholds = [0, 5, 15, 30, 50, 80, 120];
  let level = 1;
  for (let i = 1; i < thresholds.length; i++) if (answered >= thresholds[i]) level = i + 1;
  const next = thresholds[level] ?? null;
  return { level, toNext: next !== null ? Math.max(0, next - answered) : 0 };
}

/**
 * Computes a small set of relevant, real notifications for the signed-in user.
 */
export async function getNotifications(idToken) {
  try {
    const auth = await verifyAuthToken(idToken);
    if (!auth?.email) return [];
    const email = auth.email;
    await dbConnect();

    const [interviews, answers, ownedCohorts] = await Promise.all([
      MockInterview.find({ createdBy: email }).select('mockId createdAt').lean(),
      UserAnswer.find({ userEmail: email }).select('rating createdAt mockIdRef').lean(),
      Cohort.find({ ownerEmail: email }).select('code name').lean(),
    ]);

    const notifications = [];
    const today = moment().format('DD-MM-yyyy');

    if (interviews.length === 0) {
      notifications.push({
        id: 'first', icon: 'rocket',
        title: 'Start your first mock interview',
        body: 'Create an interview and get instant AI feedback.',
        href: '/dashboard',
      });
    } else {
      const lastActive = answers.length
        ? answers.map((a) => a.createdAt).filter(Boolean).sort().slice(-1)[0]
        : null;
      const activeDays = new Set(answers.map((a) => a.createdAt)).size;
      if (lastActive && lastActive !== today && activeDays > 0) {
        notifications.push({
          id: 'streak', icon: 'flame',
          title: `Keep your ${activeDays}-day streak going`,
          body: 'Practise today to stay on track.',
          href: '/dashboard',
        });
      }
      if (answers.length > 0) {
        notifications.push({
          id: 'feedback', icon: 'check',
          title: 'Your feedback reports are ready',
          body: `You've answered ${answers.length} question${answers.length > 1 ? 's' : ''} — review your reports.`,
          href: `/dashboard/interview/${interviews[interviews.length - 1].mockId}/feedback`,
        });
      }
      const { level, toNext } = levelInfo(answers.length);
      if (toNext > 0) {
        notifications.push({
          id: 'level', icon: 'trophy',
          title: `${toNext} answer${toNext > 1 ? 's' : ''} to Level ${level + 1}`,
          body: 'Keep practising to level up.',
          href: '/dashboard',
        });
      }
    }

    // Educator notifications
    for (const c of ownedCohorts.slice(0, 2)) {
      const members = await CohortMember.countDocuments({ cohortCode: c.code });
      notifications.push(members > 0
        ? { id: `cohort-${c.code}`, icon: 'users', title: `${members} student${members > 1 ? 's' : ''} in "${c.name}"`, body: 'View their progress.', href: `/dashboard/cohorts/${c.code}` }
        : { id: `cohort-empty-${c.code}`, icon: 'users', title: `Invite students to "${c.name}"`, body: `Share code ${c.code} to get started.`, href: `/dashboard/cohorts/${c.code}` });
    }

    return JSON.parse(JSON.stringify(notifications.slice(0, 6)));
  } catch (error) {
    console.error('getNotifications error:', error);
    return [];
  }
}
