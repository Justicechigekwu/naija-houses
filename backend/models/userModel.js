import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  password: {
    type: String,
    required: function () {
      return this.provider === 'local';
    },
    validate: {
      validator: function (value) {
        if (this.provider === 'google') return true;
        if (this.isModified('password')) {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
        }
        return true;
      },
      message:
        'Password must be at least 8 characters long, include a letter, a number and a special character.'
    }
  },

  avatar: {
    type: String,
    default: ''
  },

  avatarPublicId: {
    type: String,
    default: ""
  },

  dob: Date,
  sex: String,

  bio: {
    type: String,
    default: ''
  },

  phone: {
    type: String,
    default: ''
  },

  location: {
    type: String,
    default: ''
  },

  trialUsed: {
    type: Map,
    of: Boolean,
    default: {}
  },

  pushTokens: {
    type: [String],
    default: [],
  },

  pushNotificationsEnabled: {
    type: Boolean,
    default: true,
  },
  
  lastPushTokenUpdatedAt: {
    type: Date,
    default: null,
  },

  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
  },

  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,

    isBanned: {
    type: Boolean,
    default: false,
    index: true,
  },

  bannedAt: {
    type: Date,
    default: null,
  },

  banReason: {
    type: String,
    default: "",
    trim: true,
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const userModel =
  mongoose.models.userModel || mongoose.model('userModel', userSchema);

export default userModel;
