"use client";
import { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function UserDetail({ params }) {
  const router = useRouter();

  // Dummy single user (Normally you will fetch by params.id)
  const user = { id: params.id, name: "Ali Khan", amount: 5000, status: "Pending" };

  const [status, setStatus] = useState(user.status);
  const [remarks, setRemarks] = useState("");

  const handleSave = () => {
    if (status === "Failed" && !remarks.trim()) {
      alert("Remarks are required for Failed status.");
      return;
    }
    alert(`Status updated: ${status} ${remarks ? `- ${remarks}` : ""}`);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back */}
      <div className="bg-gradient-to-r from-blue-300 to-blue-400 text-white p-5 shadow-md flex items-center">
        <button onClick={() => router.push("/dashboard")} className="mr-3">
          <AiOutlineArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold">User Detail</h1>
      </div>

      <div className="p-5 max-w-lg mx-auto">
        <div className="bg-white shadow-md rounded-lg p-5 space-y-4">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p>
            <span className="font-medium">Amount:</span> Rs {user.amount}
          </p>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Remarks (Only for Failed) */}
          {status === "Failed" && (
            <div>
              <label className="block text-sm font-medium mb-1">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border rounded-lg p-2"
                rows={3}
                placeholder="Enter reason for failure..."
              />
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
