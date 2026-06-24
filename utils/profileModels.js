import mongoose from 'mongoose';

// One profile per user, keyed by their (verified) email.
const UserProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, maxlength: 320 },
  name: { type: String, maxlength: 120 },
  targetRole: { type: String, maxlength: 120 },      // e.g. "Frontend Developer"
  experienceLevel: { type: String, maxlength: 40 },  // Student / Fresher / 1-3 yrs / 3-5 yrs / 5+ yrs
  focusAreas: { type: String, maxlength: 400 },      // comma-separated skills/topics
  targetCompany: { type: String, maxlength: 160 },   // optional
  goal: { type: String, maxlength: 60 },             // e.g. "Land a job" / "Switch roles" / "Practice"
  onboardedAt: { type: String, maxlength: 40 },
}, { timestamps: false });

export const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);
