"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/data/baseurl";
import toast from "react-hot-toast";
import { AREAS } from "@/data/cities";
import AreaMultiSelect from "./AreaMultiSelect";

const initialState = {
  distributor: "",
  month: "",
  areas: [],
  users: [], // yeh UserPayment IDs ka array hona chahiye
  totalAmount: "",
  returnedAmount: 0,
  status: "handover",
  remarks: "",
};

const NewPaymentForm = ({ onSubmit }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [distributors, setDistributors] = useState([]);
  const [userPayments, setUserPayments] = useState([]);

  // fetch distributors & userPayments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dRes = await axios.get(`${BASE_URL}/api/distributors`);
        // const uRes = await axios.get(`${BASE_URL}/api/user-payments`);

        setDistributors(dRes?.data?.data?.data || []);
        // setUserPayments(uRes?.data?.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch distributors or user payments");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addUser = () => {
    setForm((prev) => ({
      ...prev,
      users: [...prev.users, ""], // sirf ID store karni hai
    }));
  };

  const updateUser = (index, value) => {
    const updated = [...form.users];
    updated[index] = value;
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
        ...form,
        totalAmount: Number(form.totalAmount),
        returnedAmount: Number(form.returnedAmount || 0),
      };

      const res = await axios.post(
        `${BASE_URL}/api/distributor-payments`,
        payload
      );

      if (res.status === 201) {
        toast.success("Payment created successfully!", { id: toastId });
        setForm(initialState);
        if (onSubmit) onSubmit(form);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create payment", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#f8fafc] via-[#fefefe] to-[#e2e8f0] px-2 sm:px-4 py-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200"
      >
        <fieldset className="space-y-6 sm:space-y-8">
          <legend className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
            New Distributor Payment
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Distributor */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Distributor</label>
              <select
                name="distributor"
                value={form.distributor}
                onChange={handleChange}
                disabled={loading}
                className="input-field"
              >
                <option value="">Select Distributor</option>
                {distributors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} - {d.cnicNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Month</label>
              <input
                type="month"
                name="month"
                value={form.month}
                onChange={handleChange}
                disabled={loading}
                className="input-field"
              />
            </div>

            {/* 📌 Area Multi Select */}
          <AreaMultiSelect form={form} setForm={setForm} disabled={loading} />

            {/* Total Amount */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={form.totalAmount}
                onChange={handleChange}
                disabled={loading}
                className="input-field"
              />
            </div>

            {/* Returned Amount */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Returned Amount</label>
              <input
                type="number"
                name="returnedAmount"
                value={form.returnedAmount}
                onChange={handleChange}
                disabled={loading}
                className="input-field"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Payment Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={loading}
                className="input-field"
              >
                {["handover", "completed"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Remarks */}
            <div className="flex flex-col sm:col-span-2">
              <label className="font-medium mb-1">Remarks</label>
              <textarea
                name="remarks"
                rows={3}
                value={form.remarks}
                onChange={handleChange}
                disabled={loading}
                className="input-field resize-none"
                placeholder="Enter remarks..."
              />
            </div>
          </div>

          {/* Users */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Users (UserPayments)</h3>
            {form.users.map((u, index) => (
              <div
                key={index}
                className="flex items-center gap-3 mb-3 border p-3 rounded-lg"
              >
                <select
                  value={u}
                  onChange={(e) => updateUser(index, e.target.value)}
                  disabled={loading}
                  className="input-field flex-1"
                >
                  <option value="">Select UserPayment</option>
                  {userPayments.map((up) => (
                    <option key={up._id} value={up._id}>
                      {up.user?.name} - {up.amount} Rs
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => removeUser(index)}
                  className="text-red-600 hover:underline text-sm"
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addUser}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
              disabled={loading}
            >
              + Add UserPayment
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 sm:py-3 text-white font-semibold rounded-lg shadow transition text-sm sm:text-base ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Create Payment"}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default NewPaymentForm;
