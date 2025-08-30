import mongoose from "mongoose";

const LoginHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Signer" }, // reference to user
    identifier: String, // email ya mobile attempt
    status: { type: String, enum: ["success", "failed"], default: "failed" },
    ip: String,
    userAgent: String,
  },
  { timestamps: true } // createdAt, updatedAt
);

export default mongoose.models.LoginHistory ||
  mongoose.model("LoginHistory", LoginHistorySchema);
