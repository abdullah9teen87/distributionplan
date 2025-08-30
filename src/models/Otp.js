import mongoose from "mongoose";

const { Schema, model } = mongoose;

const otpSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true },
    mobile: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true }, 
  },
  { timestamps: true }
);

const Otp = mongoose.models.Otp || model("Otp", otpSchema);
export default Otp;
