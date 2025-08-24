"use client";
import { BASE_URL } from "@/data/baseurl";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

const DistributorRegistrationForm = ({ onSubmit }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    const toastId = toast.loading("Submitting...");

    try {
      const res = await axios.post(`${BASE_URL}/api/users`, form);

      if (res.status === 201) {
        toast.success("User registered successfully!", { id: toastId });
        setForm(initialState);
        if (onSubmit) onSubmit(form);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to register user.";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const formatCNIC = (value) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "").slice(0, 13);
    // Apply format: 5-7-1
    if (digits.length <= 5) return digits;
    if (digits.length <= 12)
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(
      12,
      13
    )}`;
  };

  const formatContact = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4, 11)}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let formattedValue = value;

    if (name === "cnicNumber") {
      formattedValue = formatCNIC(value);
    }

    if (name === "contactNumber") {
      formattedValue = formatContact(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#fefefe] to-[#e2e8f0] px-2 sm:px-4 py-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200"
      >
        <fieldset className="space-y-6 sm:space-y-8">
          <legend className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-2 sm:mb-4">
            User Registration Form
          </legend>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 text-xs sm:text-sm lg:text-base">
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
                placeholder: "12345-1234567-1",
              },
              {
                label: "Contact Number",
                name: "contactNumber",
                type: "text",
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
                  disabled={loading}
                  {...rest}
                  className={`input-field ${
                    loading ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
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
                      disabled={loading}
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
                      disabled={loading}
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
                        disabled={loading}
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
                disabled={loading}
                className={`input-field resize-none ${
                  loading ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
                className="h-4 w-4 text-blue-600"
                disabled={loading}
              />
              <label htmlFor="isVerified" className="text-gray-700 font-medium">
                Is Verified
              </label>
            </div>
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
            {loading ? "Submitting..." : "Register User"}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default DistributorRegistrationForm;
