"use client";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/data/baseurl";
import UpdateUserForm from "./UpdateUserForm";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { IoClose } from "react-icons/io5"; // X icon
import { FaUserEdit } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";

const UserUpdate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return toast.error("Please enter a search term.");
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/users?q=${encodeURIComponent(searchQuery.trim())}`
      );
      setUser(res.data.data || null);
      if (!res.data.data) toast.error("User not found.");
    } catch (error) {
      toast.error("Error searching user.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setUser(null);
  };
  const handleCancel = () => {
  setUser(null); // close form on cancel
};

  const handleUpdateSuccess = () => {
    setUser(null);
    toast.success("User updated successfully.");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#fefefe] to-[#e2e8f0] px-2 sm:px-4 py-4">
      <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
          <FiSearch className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          Search & Update User
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 relative">
          {/* Input with clear button inside */}
          <div className="relative w-full">
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

      {user && (
        <div className="mt-6 animate-fade-in">
          <UpdateUserForm
            userData={user}
            onUpdateSuccess={handleUpdateSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default UserUpdate;
