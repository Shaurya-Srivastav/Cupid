import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the structure of a User document in MongoDB
export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  profile: {
    nickname?: string;
    bio?: string;
    avatar?: string; // Profile image URL
  };
  stats: {
    totalDatesPlanned: number;
    dateNightsPerMonth: number;
    citiesVisited: number;
    totalHoursSpentTogether: number;
    coupleRankAmongFriends: number | null;
    mostFrequentActivity: string;
    trophiesEarned: number;
    tierLevel: string;
  };
  dateHistory: mongoose.Types.ObjectId[];
  completedGoals: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the User schema
const UserSchema: Schema<UserDocument> = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: { type: String, required: true, minlength: 8 },

    // Profile object to hold user-specific details
    profile: {
      nickname: { type: String },
      bio: { type: String },
      avatar: { type: String }, // URL to profile avatar
    },

    // Stats object to track user activity and achievements
    stats: {
      totalDatesPlanned: { type: Number, default: 0 },
      dateNightsPerMonth: { type: Number, default: 0 },
      citiesVisited: { type: Number, default: 0 },
      totalHoursSpentTogether: { type: Number, default: 0 },
      coupleRankAmongFriends: { type: Number, default: null },
      mostFrequentActivity: { type: String, default: '' },
      trophiesEarned: { type: Number, default: 0 },
      tierLevel: { type: String, default: 'Unrated' },
    },

    // References to related documents
    dateHistory: [{ type: Schema.Types.ObjectId, ref: 'DateEvent' }],
    completedGoals: [{ type: Schema.Types.ObjectId, ref: 'CompletedGoal' }],
  },
  { timestamps: true }
);

// Middleware to hash password before saving if it’s modified
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Method to compare provided password with stored password hash
UserSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
const User = mongoose.model<UserDocument>('User', UserSchema);
export default User;
