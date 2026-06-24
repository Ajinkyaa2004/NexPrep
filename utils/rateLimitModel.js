import mongoose from 'mongoose';

// Per-user, per-day AI call counter. key = "email:YYYY-MM-DD".
const RateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  day: { type: String },
}, { timestamps: false });

export const RateLimit = mongoose.models.RateLimit || mongoose.model('RateLimit', RateLimitSchema);
