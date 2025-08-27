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
      type: String, // format: YYYY-MM
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
    users: [
      {
        user: { type: Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true, min: 0 },
        status: {
          type: String,
          enum: ["paid", "pending", "failed"],
          default: "pending",
        },
        failedremarks: { type: String, default: "" },
        carryForward: { type: Boolean, default: false },
      },
    ],
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔹 Pre-validate: populate users and handle carry forward
distributorPaymentSchema.pre("validate", async function (next) {
  if (!this.isNew) return next();

  const DistributorGroup = mongoose.model("DistributorGroup");
  const DistributorPayment = mongoose.model("DistributorPayment");

  // 1️⃣ Get group and its users
  const group = await DistributorGroup.findById(this.distributorGroup).populate("users.user");
  if (!group) return next(new Error("Distributor group not found"));

  // 2️⃣ Check last month's payment
  const [year, month] = this.month.split("-").map(Number);
  const lastMonthDate = new Date(year, month - 2, 1); // JS month 0-based
  const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(
    lastMonthDate.getMonth() + 1
  ).padStart(2, "0")}`;

  const lastPayment = await DistributorPayment.findOne({
    distributorGroup: this.distributorGroup,
    month: lastMonthStr,
  });

  // 3️⃣ Populate users for current month
  this.users = group.users.map((u) => {
    let carryForward = false;
    let amount = u.amount; // base group amount

    if (lastPayment) {
      const lastUser = lastPayment.users.find(
        (lu) => lu.user.toString() === u.user._id.toString()
      );
      if (lastUser && lastUser.status === "pending") {
        carryForward = true;
        amount += lastUser.amount; // add last month pending
      }
    }

    return {
      user: u.user._id,
      amount,
      status: "pending",
      carryForward,
    };
  });

  next();
});

// 🔹 Calculate summary before save
distributorPaymentSchema.pre("save", function (next) {
  let total = 0,
    paid = 0,
    pending = 0;

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
