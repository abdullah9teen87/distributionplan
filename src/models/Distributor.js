import mongoose from "mongoose";

const distributorSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      trim: true,
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
      enum: ["working", "leaved", "retired"],
      default: "working",
    },
    jobStatus: {
      type: String,
      enum: ["business", "employed", "unemployed"],
      default: "employed",
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

export default mongoose.models.Distributor || mongoose.model("Distributor", distributorSchema);
