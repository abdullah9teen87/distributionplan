import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    registrationDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
      required: true,
    },
    fatherHusbandName: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      match: [/^0\d{3}-\d{7}$/, "Invalid contact number format (e.g. 0300-1234567)"],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    familyMembers: {
      type: Number,
      min: 0,
      max: 9,
      required: true,
    },
    cnicNumber: {
      type: String,
      required: true,
      match: [/^\d{5}-\d{7}-\d{1}$/, "Invalid CNIC format (e.g. 12345-1234567-1)"],
    },
    detail: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["depending", "stable", "death"],
      default: "depending",
    },
    jobStatus: {
      type: String,
      enum: ["unemployed", "employed", "retired", "widow"],
      default: "unemployed",
    },
    jobType: {
      type: String,
      default: "",
      trim: true,
    },
    monthlyIncome: {
      type: Number,
      min: 0,
    },
    referalPerson: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,  
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
