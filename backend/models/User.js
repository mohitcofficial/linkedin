import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: [6, "Password must be atleast 8 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    designation: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
      },
    ],
    education: [
      {
        type: String,
      },
    ],
    profileImage: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    backgroundImage: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 120, partialFilterExpression: { isVerified: false } }
);

export const User = mongoose.model("User", userSchema);
