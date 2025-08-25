import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const distributorPaymentSchema = new Schema(
  {
    distributorGroup: {
      type: Types.ObjectId,
      ref: "DistributorGroup", 
      required: true,
    },
    month: {
      type: String, 
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },

    users: [
      {
        user: { type: Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true, min: 0 },  // (is ko get karo group me mojod payment se and edit option daina)
        status: {
          type: String,
          enum: ["paid", "pending", "failed"],
          default: "pending",
        },
        failedremarks: {
          type: String,
          default: "",
        },
        carryForward: {
          type: Boolean,
          default: false,
        },
      },
    ],

    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// 🔹 Calculate summary before save
distributorPaymentSchema.pre("save", function (next) {
  let total = 0;
  let paid = 0;
  let pending = 0;

  this.users.forEach((u) => {
    total += u.amount;
    if (u.status === "paid") paid += u.amount;
    else pending += u.amount;
  });

  this.totalAmount = total;
  this.paidAmount = paid;
  this.pendingAmount = pending;

  next();
});

const DistributorPayment =
  mongoose.models.DistributorPayment ||
  model("DistributorPayment", distributorPaymentSchema);

export default DistributorPayment;
