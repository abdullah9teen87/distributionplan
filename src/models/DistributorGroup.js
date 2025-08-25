import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const distributorGroupSchema = new Schema(
  {
    distributor: {
      type: Types.ObjectId,
      ref: "Distributor",
      required: true,
    },
    areas: {
      type: [String],
      required: true,
    },
    users: [
      {
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
      },
    ],
   totalAmount: { type: Number, required: true, min: 0 },
    remarks: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

distributorGroupSchema.statics.addUserToGroup = async function (
  groupId,
  userId
) {
  const User = mongoose.model("User");
  const DistributorGroup = this;

  // 1) check if user exists
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // 2) check user eligibility (status must be 'depending')
  if (user.status !== "depending") {
    throw new Error("User is not eligible (status must be 'depending')");
  }

  // 3) check if user already in another group
  const alreadyInGroup = await DistributorGroup.findOne({
     "users.user": userId,
  }).populate("distributor", "name"); // distributor ka sirf "name" field laa rahe hain

  if (alreadyInGroup) {
    throw new Error(
      `User already exists in group (${alreadyInGroup._id}) under distributor: ${alreadyInGroup.distributor?.name}`
    );
  }

  // 4) finally add user to this group
  const group = await DistributorGroup.findById(groupId);
  if (!group) throw new Error("Group not found");

  group.users.push({ user: userId, amount: 0 });
  group.totalAmount = group.users.reduce((sum, u) => sum + u.amount, 0);
  await group.save();

  return group;
};

const DistributorGroup =
  mongoose.models.DistributorGroup ||
  model("DistributorGroup", distributorGroupSchema);

export default DistributorGroup;
