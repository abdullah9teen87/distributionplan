"use client";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/data/baseurl";
import UpdateGroupForm from "./UpdateGroupForm"; // make this like UpdateDistributorForm
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import { IoClose } from "react-icons/io5"; 
import { FaSearch } from "react-icons/fa";

const GroupUpdate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return toast.error("Please enter a search term.");
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/distributor-groups?q=${encodeURIComponent(searchQuery.trim())}`
      );
      console.log("Response Data:", res.data);
      if (!res.data.data) toast.error("Group not found.");
      setGroup(res.data.data || null);
    } catch (error) {
      toast.error("Error searching group.");
      setGroup(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setGroup(null);
  };

  const handleCancel = () => {
    setGroup(null);
  };

  const handleUpdateSuccess = () => {
    setGroup(null);
    toast.success("Group updated successfully.");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#fefefe] to-[#e2e8f0] px-2 sm:px-4 py-4">
      <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
          <FiSearch className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          Search & Update Group
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 relative">
          {/* Input with clear button */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter Distributor ID or Distributor Name or CNIC"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
              >
                <IoClose size={18} />
              </button>
            )}
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-white font-medium text-sm sm:text-base rounded-lg shadow transition bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin text-white" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <FaSearch />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </div>

      {group && (
        <div className="mt-6 animate-fade-in">
          <UpdateGroupForm
            groupData={group}
            onUpdateSuccess={handleUpdateSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default GroupUpdate;
