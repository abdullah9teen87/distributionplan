import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const signerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdminApprove: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "distributor"],
      default: "distributor",
    },
  },
  { timestamps: true }
);

const Signer = models.Signer || model("Signer", signerSchema);

export default Signer;
