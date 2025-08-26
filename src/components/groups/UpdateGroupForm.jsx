"use client";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/data/baseurl";
import toast from "react-hot-toast";

const UpdateGroupForm = ({ groupData, onUpdateSuccess, onCancel }) => {
  const [form, setForm] = useState(groupData || {});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/distributor-groups/${form._id}`, form);
      toast.success("Group updated successfully.");
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      toast.error("Failed to update group.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white border border-gray-200 p-6 rounded-xl shadow-md space-y-4"
    >
      <h3 className="text-xl font-semibold text-gray-800">Update Group</h3>

      {/* Distributor Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Distributor</label>
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

      {/* Total Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Total Amount</label>
        <input
          type="number"
          name="totalAmount"
          value={form.totalAmount || ""}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Remarks</label>
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
          <label className="block text-sm font-medium text-gray-700">Users Count</label>
          <input
            type="number"
            value={form.users?.length || 0}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Users Amount</label>
          <input
            type="number"
            value={form.users?.reduce((sum, u) => sum + (u.amount || 0), 0) || 0}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
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
