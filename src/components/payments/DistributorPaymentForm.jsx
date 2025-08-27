"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/data/baseurl";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { HiUserAdd } from "react-icons/hi";
import { useRouter } from "next/navigation";
import MultiSelect from "../DistributorSelectInput";
import GroupSelectInput from "../GroupSelectInput";

const initialState = {
  distributorGroup: "",
  month: "",
  users: [],
  totalAmount: 0,
  remarks: "",
};

const NewPaymentForm = ({ onSubmit }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const router = useRouter();

  // fetch all groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/distributor-groups`);
        setGroups(res?.data?.data?.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load groups");
      }
    };
    fetchGroups();
  }, []);

  // when group changes, populate users & their last month payment if exists
  useEffect(() => {
    if (!form.distributorGroup) return;
    const group = groups.find((g) => g._id === form.distributorGroup);
    if (!group) return;

    const usersWithAmount = group.users.map((u) => ({
      user: u.user._id,
      name: u.user.name,
      cnicNumber: u.user.cnicNumber,
      contactNumber: u.user.contactNumber,
      amount: u.amount || 0, // default from group
      status: "pending", // default for new payment
      carryForward: false,
      failedremarks: "",
    }));

    setForm((prev) => ({
      ...prev,
      users: usersWithAmount,
      totalAmount: usersWithAmount.reduce((sum, u) => sum + u.amount, 0),
    }));
  }, [form.distributorGroup, groups]);

  // update total amount whenever users' amount changes
  useEffect(() => {
    const total = form.users.reduce(
      (sum, u) => sum + (parseFloat(u.amount) || 0),
      0
    );
    setForm((prev) => ({ ...prev, totalAmount: total }));
  }, [form.users]);

  const handleUserAmountChange = (index, value) => {
    const updated = [...form.users];
    updated[index].amount = parseFloat(value) || 0;
    setForm((prev) => ({ ...prev, users: updated }));
  };

  const removeUser = (index) => {
    const updated = [...form.users];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, users: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Submitting payment...");

    try {
      const payload = {
        distributorGroup: form.distributorGroup,
        month: form.month,
        remarks: form.remarks,
        users: form.users.map((u) => ({
          user: u.user,
          amount: u.amount,
          status: u.status,
          carryForward: u.carryForward,
          failedremarks: u.failedremarks,
        })),
      };

      const res = await axios.post(
        `${BASE_URL}/api/distributor-payments`,
        payload
      );

      if (res.status === 201) {
        toast.success("Payment created successfully!", { id: toastId });
        setForm(initialState);
        if (onSubmit) onSubmit(payload);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create payment", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:p-4 p-2">
      <form
        onSubmit={handleSubmit}
        className=" mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200"
      >
        <fieldset className="space-y-6 sm:space-y-8">
          <legend className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
            New Distributor Payment
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Distributor Group */}

            <GroupSelectInput
              form={form}
              setForm={setForm}
              groups={groups}
              disabled={loading}
              label="Distributor Group"
            />

            {/* Month */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Month</label>
              <input
                type="month"
                name="month"
                value={form.month}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, month: e.target.value }))
                }
                disabled={loading}
                className="input-field"
              />
            </div>
          </div>

          {/* Users */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Users</h3>
            {form.users.length === 0 && (
              <p className="text-gray-500 italic">No users in this group.</p>
            )}
            {form.users.map((u, index) => {
              return (
                <div
                  key={u.user}
                  className="relative border p-3 rounded-lg bg-gray-50 grid grid-cols-2 md:grid-cols-5 gap-2 items-start mb-2"
                >
                  {/* Name */}
                  <div className="text-left">
                    <strong>Name: </strong> {u.name}
                  </div>

                  {/* CNIC */}
                  <div className="text-left">
                    <strong>CNIC: </strong> {u.cnicNumber}
                  </div>

                  {/* Mobile */}
                  <div className="text-left">
                    <strong>Mobile: </strong> {u.contactNumber}
                  </div>

                  {/* Current Month Amount */}
                  <div className="text-left sm:text-right">
                    <strong>Amount: </strong> {u.amount}
                  </div>

                  {/* CarryForward Amount */}
                  <div className="text-left sm:text-right">
                    <strong>CarryForward: </strong> {u.carryForward || "No"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Amount */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Total Amount</label>
            <input
              type="number"
              value={form.totalAmount}
              readOnly
              className="input-field bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Remarks */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Remarks</label>
            <textarea
              name="remarks"
              rows={3}
              value={form.remarks}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, remarks: e.target.value }))
              }
              disabled={loading}
              className="input-field resize-none"
              placeholder="Enter remarks..."
            />
          </div>

          <div className="grid grid-cols-2 items-center justify-between gap-3 sm:gap-4 mt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 sm:py-3 text-white font-semibold rounded-lg shadow transition text-sm sm:text-base ${
                loading
                  ? "bg-blue-200 cursor-not-allowed"
                  : "bg-blue-400 hover:bg-blue-500"
              }`}
            >
              {loading ? "Submitting..." : "Create Payment"}
            </button>

            <button
              type="button"
              className="w-full py-2 sm:py-3 text-blue-500 border font-semibold rounded-lg shadow-md border-gray-400 transition text-sm sm:text-base"
              onClick={() => router.back()}
            >
              Close
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default NewPaymentForm;
