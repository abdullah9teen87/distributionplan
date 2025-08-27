"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/data/baseurl";
import toast from "react-hot-toast";

const initialState = {
  registrationNumber: "",
  registrationDate: "",
  gender: "",
  name: "",
  age: "",
  fatherHusbandName: "",
  contactNumber: "",
  address: "",
  familyMembers: "",
  cnicNumber: "",
  detail: "",
  status: "depending",
  jobStatus: "unemployed",
  jobType: "",
  monthlyIncome: "",
  referalPerson: "",
  isVerified: false,
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const UpdateUserForm = ({ userData, onUpdateSuccess, onCancel }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // On mount or when userData changes, fill form fields
  useEffect(() => {
    if (userData) {
      setForm({
        ...initialState,
        ...userData,
        registrationDate: formatDateForInput(userData.registrationDate),
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "registrationNumber",
      "registrationDate",
      "gender",
      "name",
      "age",
      "fatherHusbandName",
      "contactNumber",
      "address",
      "familyMembers",
      "cnicNumber",
      "status",
      "jobStatus",
    ];

    const emptyFields = requiredFields.filter(
      (field) => !form[field] || form[field].toString().trim() === ""
    );

    if (emptyFields.length > 0) {
      toast.error(`Please fill required fields: ${emptyFields.join(", ")}`);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating user...");

    try {
      // Assuming userData._id exists for update API
      const res = await axios.put(
        `${BASE_URL}/api/users/${userData._id}`,
        form
      );

      if (res.status === 200) {
        toast.success("User updated successfully!", { id: toastId });
        if (onUpdateSuccess) onUpdateSuccess();
      } else {
        toast.error("Failed to update user", { id: toastId });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#fefefe] to-[#e2e8f0] px-2 sm:px-4 py-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200"
      >
        <fieldset className="space-y-6 sm:space-y-8">
          <legend className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-2 sm:mb-4">
            Update User Form
          </legend>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 text-xs sm:text-sm lg:text-base">
            {/* Copy all input fields exactly as in registration form */}
            {/* Example for a few: */}
            {[
              { label: "Registration Number", name: "registrationNumber" },
              {
                label: "Registration Date",
                name: "registrationDate",
                type: "date",
              },
              { label: "Name", name: "name" },
              { label: "Father / Husband Name", name: "fatherHusbandName" },
              { label: "Age", name: "age", type: "number" },
              {
                label: "CNIC Number",
                name: "cnicNumber",
                type: "text",
                pattern: "\\d{5}-\\d{7}-\\d{1}",
                placeholder: "12345-1234567-1",
              },
              {
                label: "Contact Number",
                name: "contactNumber",
                type: "text",
                pattern: "0\\d{3}-\\d{7}",
                placeholder: "0300-1234567",
              },
              { label: "Address", name: "address" },
              {
                label: "Family Members",
                name: "familyMembers",
                type: "number",
                min: 0,
                max: 9,
              },
              { label: "Job Type", name: "jobType" },
              {
                label: "Monthly Income",
                name: "monthlyIncome",
                type: "number",
              },
              { label: "Referral Person", name: "referalPerson" },
            ].map(({ label, name, type = "text", ...rest }) => (
              <div key={name} className="flex flex-col">
                <label
                  htmlFor={name}
                  className="text-gray-700 font-medium mb-1"
                >
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={form[name]}
                  onChange={handleChange}
                  {...rest}
                  className="input-field"
                />
              </div>
            ))}

            {/* Gender radio */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Gender</label>
              <div className="flex flex-wrap gap-3">
                {["Male", "Female"].map((option) => (
                  <label key={option} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={form.gender === option}
                      onChange={handleChange}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status radio */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Current Status
              </label>
              <div className="flex flex-wrap gap-3">
                {["depending", "stable", "death"].map((option) => (
                  <label key={option} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="status"
                      value={option}
                      checked={form.status === option}
                      onChange={handleChange}
                    />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Employment Status */}
            <div className="flex flex-col col-span-2 md:col-span-2 lg:col-span-2">
              <label className="text-gray-700 font-medium mb-1">
                Employment Status
              </label>
              <div className="flex flex-wrap gap-4">
                {["unemployed", "employed", "retired", "widow"].map(
                  (option) => (
                    <label key={option} className="flex items-center space-x-1">
                      <input
                        type="radio"
                        name="jobStatus"
                        value={option}
                        checked={form.jobStatus === option}
                        onChange={handleChange}
                      />
                      <span className="capitalize">{option}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Detail as textarea */}
            <div className="flex flex-col col-span-2 md:col-span-3 lg:col-span-4">
              <label
                htmlFor="detail"
                className="text-gray-700 font-medium mb-1"
              >
                Detail
              </label>
              <textarea
                name="detail"
                id="detail"
                rows={3}
                value={form.detail}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Enter detailed notes or remarks..."
              />
            </div>

            {/* Verified */}
            <div className="flex items-center gap-2 col-span-2 md:col-span-3 lg:col-span-4 mt-2">
              <input
                type="checkbox"
                name="isVerified"
                checked={form.isVerified}
                onChange={handleChange}
                className="h-4 w-4 text-blue-500"
              />
              <label htmlFor="isVerified" className="text-gray-700 font-medium">
                Is Verified
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 py-2 sm:py-3 text-white font-semibold rounded-lg shadow transition text-sm sm:text-base ${
                loading
                  ? "bg-blue-200 cursor-not-allowed"
                  : "bg-blue-400 hover:bg-blue-500"
              }`}
            >
              {loading ? "Updating..." : "Update User"}
            </button>

            <button
              type="button"
              onClick={() => onCancel && onCancel()}
              disabled={loading}
              className="w-1/2 py-2 sm:py-3 bg-white text-gray-600 border border-gray-400 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default UpdateUserForm;
