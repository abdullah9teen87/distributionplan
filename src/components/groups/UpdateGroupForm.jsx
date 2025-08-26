"use client";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/data/baseurl";
import toast from "react-hot-toast";
import { HiUserAdd } from "react-icons/hi";

const UpdateGroupForm = ({ groupData, onUpdateSuccess, onCancel }) => {
  const [form, setForm] = useState(groupData || {});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/distributor-groups/${form._id}`, {
        ...form,
        // backend will recalc totalAmount
        users: form.users.map((u) => ({
          user: u.user?._id || u.user, // only ObjectId
          amount: u.amount || 0,
        })),
      });

      toast.success("Group updated successfully.");
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to update group.";
      toast.error(msg);
      console.error("Update group error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
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

    // prevent duplicate in same group
    const alreadyExists = form.users.some(
      (u) => (u.user?._id || u.user) === searchResult._id
    );
    if (alreadyExists) {
      toast.error("User already added in this group");
      return;
    }

    setForm((prev) => ({
      ...prev,
      users: [
        ...prev.users,
        {
          user: searchResult,
          amount: 0,
        },
      ],
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

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white border border-gray-200 p-6 rounded-xl shadow-md space-y-4"
    >
      <h3 className="text-xl font-semibold text-gray-800">Update Group</h3>

      {/* Distributor Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Distributor
        </label>
        <input
          type="text"
          name="distributor"
          value={form.distributor?.name || ""}
          onChange={handleChange}
          disabled
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Areas */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Areas</label>
        <input
          type="text"
          name="areas"
          value={form.areas || ""}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Total Amount (auto calculated) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Total Amount
        </label>
        <input
          type="number"
          value={form.users?.reduce((sum, u) => sum + (u.amount || 0), 0) || 0}
          disabled
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Remarks
        </label>
        <textarea
          name="remarks"
          value={form.remarks || ""}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users count + amount (read-only) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Users Count
          </label>
          <input
            type="number"
            value={form.users?.length || 0}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Users Amount
          </label>
          <input
            type="number"
            value={
              form.users?.reduce((sum, u) => sum + (u.amount || 0), 0) || 0
            }
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Users Section */}
      <div>
        <h4 className="text-lg font-medium text-gray-800 mb-2">Users</h4>

        {/* Search User */}
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

        {/* Current Users */}
        {form.users?.map((u, index) => (
          <div
            key={u.user?._id || index}
            className="flex items-center gap-4 mb-3 p-3 border rounded-lg bg-gray-50"
          >
            {/* User Name */}
            <div className="flex-1">
              <label className="block text-xs text-gray-600">Name</label>
              <input
                type="text"
                value={u.user?.name || u.name || ""}
                disabled
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-100"
              />
            </div>

            {/* CNIC */}
            <div className="flex-1">
              <label className="block text-xs text-gray-600">CNIC</label>
              <input
                type="text"
                value={u.user?.cnicNumber || u.cnicNumber || ""}
                disabled
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-100"
              />
            </div>

            {/* Contact */}
            <div className="flex-1">
              <label className="block text-xs text-gray-600">Contact</label>
              <input
                type="text"
                value={u.user?.contactNumber || u.contactNumber || ""}
                disabled
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm bg-gray-100"
              />
            </div>

            {/* Amount (editable) */}
            <div className="flex-1">
              <label className="block text-xs text-gray-600">Amount</label>
              <input
                type="number"
                value={u.amount || 0}
                onChange={(e) => {
                  const newAmount = parseInt(e.target.value) || 0;
                  setForm((prev) => {
                    const updatedUsers = [...prev.users];
                    updatedUsers[index].amount = newAmount;
                    return { ...prev, users: updatedUsers };
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeUser(index)}
              className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow transition disabled:bg-blue-400"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );
};

export default UpdateGroupForm;
