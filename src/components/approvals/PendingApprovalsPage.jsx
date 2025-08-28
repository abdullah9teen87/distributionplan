"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BASE_URL } from "@/data/baseurl";

export default function PendingApprovalsPage() {
  const [signers, setSigners] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingSigners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/signer/pending`);
      if (res.data.success) {
        setSigners(res.data.data);
      }
      console.log(res.data);
    } catch (err) {
      toast.error("Failed to fetch pending signers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSigners();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await axios.patch(`/api/signer/${id}/action`, { action });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchPendingSigners(); // refresh list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Signer Approvals</h1>
      {signers.length === 0 ? (
        <p>No pending signers.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {signers.map((s) => (
              <tr key={s._id}>
                <td className="px-4 py-2 border">{s.name}</td>
                <td className="px-4 py-2 border">{s.email}</td>
                <td className="px-4 py-2 border">{s.role}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleAction(s._id, "approve")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(s._id, "reject")}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(s._id, "block")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
