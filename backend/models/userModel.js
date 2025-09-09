import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto'


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                if (this.isModified("password")) {
                    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
                }
                return true;
            },
            message: "Password must be at least 8 characters long, include a letter, a number and a special character."
        }
    },

    avatar: {
        type: String,
        default: ""
    },

    dob: {
        type: Date
    },

    sex: {
        type: String
    },

    bio: {
        type: String,
        default: ""
    },


    phone: {
        type: Number,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};
const userModel =
  mongoose.models.userModel || mongoose.model("userModel", userSchema);

export default userModel;
