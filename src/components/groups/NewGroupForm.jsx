"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/data/baseurl";
import toast from "react-hot-toast";
import AreaMultiSelect from "../AreaMultiSelect"; // tumne already banaya hai
import { AiOutlineClose } from "react-icons/ai";
import { HiUserAdd } from "react-icons/hi";
import { useRouter } from "next/navigation";

const initialState = {
  distributor: "",
  areas: [],
  users: [],
  totalAmount: "",
  remarks: "",
};

const NewGroupForm = ({ onSubmit }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [distributors, setDistributors] = useState([]);
  const router = useRouter();
  // 🔎 user search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const formatCNIC = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  };

  const formatContact = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  };

  const formatSearchInput = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 13) return formatCNIC(value);
    if (digits.length === 11) return formatContact(value);
    return value;
  };

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/distributors`);
        setDistributors(res?.data?.data?.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load distributors");
      }
    };
    fetchDistributors();
  }, []);

  // 1️⃣ totalAmount calculate karne ke liye useEffect
  useEffect(() => {
    const total = form.users.reduce((sum, u) => {
      const amt = parseFloat(u.amount) || 0;
      return sum + amt;
    }, 0);
    setForm((prev) => ({ ...prev, totalAmount: total.toFixed(2) }));
  }, [form.users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // user search
  const handleUserSearch = async () => {
    if (!searchQuery.trim()) return toast.error("Please enter a search term.");
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/users?q=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchResult(res.data.data || null);
      if (!res.data.data) toast.error("User not found.");
    } catch (error) {
      toast.error("User Not Registered.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // add user
  const handleAddUser = () => {
    if (!searchResult) return;

    const alreadyExists = form.users.some((u) => u._id === searchResult._id);
    if (alreadyExists) {
      toast.error("User already added in this group");
      return;
    }

    setForm((prev) => ({
      ...prev,
      users: [...prev.users, { ...searchResult, amount: "" }],
    }));
    setSearchResult(null);
    setSearchQuery("");
  };

  // remove user
  const removeUser = (index) => {
    const updated = [...form.users];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, users: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating group...");

    try {
      // payload prepare karte waqt console log
      const payload = {
        distributor: form.distributor,
        areas: form.areas,
        users: form.users.map((u) => ({
          user: u._id,
          amount: parseFloat(u.amount) || 0,
        })),
        totalAmount: parseFloat(form.totalAmount) || 0,
        remarks: form.remarks,
      };

      console.log("Payload being sent to API:", payload);

      const res = await axios.post(
        `${BASE_URL}/api/distributor-groups`,
        payload
      );

      console.log("Response from API:", res);

      if (res.status === 201) {
        toast.success("Group created successfully!", { id: toastId });
        setForm(initialState);
        if (onSubmit) onSubmit(payload);
      }
    } catch (err) {
      console.error("Error creating group:", err?.response || err);
      toast.error(err?.response?.data?.message || "Failed to create group", {
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
            New Distributor Group
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

            {/* Areas */}
            <AreaMultiSelect form={form} setForm={setForm} disabled={loading} />
          </div>
          {/* Users */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Users</h3>

            {/* Search */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter Reg. No., CNIC, or Mobile"
                value={searchQuery}
                onChange={(e) => {
                  const formatted = formatSearchInput(e.target.value);
                  setSearchQuery(formatted);
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
              />
              <button
                type="button"
                onClick={handleUserSearch}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm"
                disabled={loading}
              >
                Search
              </button>
            </div>

            {/* Search Result */}
            {searchResult && (
              <div className="border p-3 rounded-lg mb-3 bg-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-2 justify-between items-center">
                <div>
                  <strong>Name:</strong> {searchResult.name}
                </div>
                <div>
                  <strong>CNIC No.:</strong> {searchResult.cnicNumber}
                </div>
                <div>
                  <strong>Mobile No.:</strong> {searchResult.contactNumber}
                </div>

                <button
                  type="button"
                  onClick={handleAddUser}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition"
                >
                  <HiUserAdd size={18} />
                  <span>Add User</span>
                </button>
              </div>
            )}

            {/* Added Users */}
            {form.users.length > 0 && (
              <div className="space-y-2">
                {form.users.map((u, index) => (
                  <div
                    key={u._id}
                    className="relative border p-3 rounded-lg bg-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-2 items-center"
                  >
                    {/* User Info */}
                    <div>
                      <strong>Name:</strong>{" "}
                      <span className="capitalize">{u.name}</span>
                    </div>
                    <div>
                      <strong>CNIC No.:</strong> {u.cnicNumber}
                    </div>
                    <div>
                      <strong>Mobile No:</strong> {u.contactNumber}
                    </div>

                    {/* Amount input */}
                    <div className="w-full sm:w-32 text-center sm:text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={
                          u.amount !== undefined && u.amount !== null
                            ? u.amount
                            : ""
                        }
                        onChange={(e) => {
                          const updated = [...form.users];
                          updated[index].amount =
                            parseFloat(e.target.value) || 0;
                          setForm((prev) => ({ ...prev, users: updated }));
                        }}
                        placeholder="Amount"
                        className="input-field text-center sm:text-right no-arrows w-full sm:w-32"
                      />
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeUser(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                      disabled={loading}
                    >
                      <AiOutlineClose size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TotalAmount */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={form.totalAmount}
              readOnly
              className="input-field bg-gray-100 cursor-not-allowed"
            />
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

          <div className="grid grid-cols-2  items-center justify-between gap-3 sm:gap-4 mt-2">
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
              {loading ? "Submitting..." : "Create Group"}
            </button>

            <button
              type="button"
              className="w-full py-2 sm:py-3 text-blue-600 border font-semibold rounded-lg shadow-md border-gray-400 transition text-sm sm:text-base"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default NewGroupForm;
