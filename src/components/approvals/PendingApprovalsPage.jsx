"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BASE_URL } from "@/data/baseurl";

export default function SignersPage() {
  const [signers, setSigners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("card");
  const [currentTab, setCurrentTab] = useState("all");

  const fetchSigners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/signer`);
      if (res.data.success) {
        const sorted = res.data.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSigners(sorted);
      }
    } catch (err) {
      toast.error("Failed to fetch signers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSigners();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await axios.patch(`/api/signer/${id}/action`, { action });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchSigners();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const filteredSigners = signers.filter((s) => {
    if (currentTab === "all") return true;
    const statusLabel = s.isAdminApprove ? "approved" : "pending";
    return statusLabel === currentTab;
  });

  const actionButtonClass = "bg-blue-400 hover:bg-blue-500 text-white";

  const getStatus = (s) => (s.isAdminApprove ? "approved" : "pending");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Signers</h1>

    <div className="flex sm:flex-row flex-col justify-between items-center">
        {/* Tabs */}
      <div className="flex sm:w-72 w-full gap-2 mb-4 justify-between items-center  ">
        {["all", "pending", "approved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`px-4 py-1.5 sm:w-24 w-full rounded text-sm font-medium transition ${
              currentTab === tab
                ? "bg-blue-400 text-white border border-blue-500"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table/Card toggle */}
      <div className="flex sm:w-64 w-full gap-2 mb-4">
        <button
          onClick={() => setViewMode("card")}
          className={`px-4 w-full py-1.5 rounded text-sm font-medium transition ${
            viewMode === "card"
              ? "bg-blue-400 text-white border border-blue-500"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          Card View
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={`px-4 py-1.5 w-full rounded text-sm font-medium transition ${
            viewMode === "table"
              ? "bg-blue-400 text-white border border-blue-500"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          Table View
        </button>
      </div>

    </div>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filteredSigners.length === 0 ? (
        <p className="text-gray-700">No signers in this category.</p>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
          <table className="min-w-full border border-gray-300 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-300">Name</th>
                <th className="px-4 py-2 border border-gray-300">Email</th>
                <th className="px-4 py-2 border border-gray-300">Role</th>
                <th className="px-4 py-2 border border-gray-300">Status</th>
                {currentTab === "pending" && (
                  <th className="px-4 py-2 border border-gray-300">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredSigners.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300 capitalize">
                    {s.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {s.email}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 capitalize">
                    {s.role}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 capitalize">
                    {getStatus(s) === "approved" ? "Approved" : "Pending"}
                  </td>
                  {currentTab === "pending" && (
                    <td className="w-full flex px-4 py-2 border border-gray-300 space-x-2">
                      <button
                        onClick={() => handleAction(s._id, "approve")}
                        className={`w-full px-3 py-1 rounded ${actionButtonClass}`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(s._id, "reject")}
                        className={`w-full px-3 py-1 rounded ${actionButtonClass}`}
                      >
                        Reject
                      </button>
                   
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Card View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSigners.map((s) => (
            <div
              key={s._id}
              className="bg-white shadow rounded-lg p-4 border border-gray-200 flex flex-col justify-between transition hover:shadow-md"
            >
              <div>
                <h2 className="font-semibold text-lg text-gray-800 capitalize">
                  {s.name}
                </h2>
                <p className="text-gray-600">{s.email}</p>
                <p className="text-gray-500 text-sm mt-1 capitalize">
                  Role: {s.role}
                </p>
                <p className="text-gray-500 text-sm mt-1 capitalize">
                  Status: {getStatus(s) === "approved" ? "Approved" : "Pending"}
                </p>
              </div>
              {getStatus(s) === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAction(s._id, "approve")}
                    className={`flex-1 px-3 py-1 rounded ${actionButtonClass}`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(s._id, "reject")}
                    className={`flex-1 px-3 py-1 rounded ${actionButtonClass}`}
                  >
                    Reject
                  </button>
                 
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
