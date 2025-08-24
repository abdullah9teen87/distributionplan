// models/DistributorPayment.js

import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const distributorPaymentSchema = new Schema(
  {
    distributor: {
      type: Types.ObjectId,
      ref: "Distributor",
      required: true,
    },
    month: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{4}-(0[1-9]|1[0-2])$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid month format (YYYY-MM)`,
      },
    },
     area: {
      type: String,
      default: "",
      required: true,
    },
    users: [
      {
        type: Types.ObjectId,
        ref: "UserPayment",
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    returnedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["handover", "completed"],
      default: "handover",
    },
    isClosedByAdmin: {
      type: Boolean,
      default: false,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const DistributorPayment =
  mongoose.models.DistributorPayment ||
  model("DistributorPayment", distributorPaymentSchema);

export default DistributorPayment;
