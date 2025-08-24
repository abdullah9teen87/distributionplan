// models/UserPayment.js
import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const userPaymentSchema = new Schema(
  {
    distributorPayment: {
      type: Types.ObjectId,
      ref: "DistributorPayment",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    failedremarks: {
      type: String,
      default: "",
      validate: {
        validator: function (value) {
          if (this.status === "failed") {
            return value && value.trim().length > 0;
          }
          return true;
        },
        message: "Remarks are required when payment status is 'failed'.",
      },
    },
    carryForward: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserPayment =
  mongoose.models.UserPayment || model("UserPayment", userPaymentSchema);

export default UserPayment;
