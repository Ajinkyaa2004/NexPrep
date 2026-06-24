import mongoose from 'mongoose';

// A cohort is a class/batch owned by an educator; students join via invite code.
const CohortSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, maxlength: 12 }, // invite code
  name: { type: String, required: true, maxlength: 120 },
  description: { type: String, maxlength: 500 },
  ownerEmail: { type: String, required: true, maxlength: 320 },
  ownerName: { type: String, maxlength: 120 },
  createdAt: { type: String, maxlength: 40 },
}, { timestamps: false });

// Membership of a student in a cohort.
const CohortMemberSchema = new mongoose.Schema({
  cohortCode: { type: String, required: true, maxlength: 12 },
  studentEmail: { type: String, required: true, maxlength: 320 },
  studentName: { type: String, maxlength: 120 },
  joinedAt: { type: String, maxlength: 40 },
}, { timestamps: false });

CohortSchema.index({ ownerEmail: 1 });
CohortMemberSchema.index({ cohortCode: 1 });
CohortMemberSchema.index({ studentEmail: 1 });
CohortMemberSchema.index({ cohortCode: 1, studentEmail: 1 }, { unique: true });

export const Cohort = mongoose.models.Cohort || mongoose.model('Cohort', CohortSchema);
export const CohortMember = mongoose.models.CohortMember || mongoose.model('CohortMember', CohortMemberSchema);
