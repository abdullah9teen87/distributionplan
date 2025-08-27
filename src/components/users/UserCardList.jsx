import React from "react";
import {
  HiUser,
  HiCalendar,
  HiLocationMarker,
  HiBadgeCheck,
  HiBriefcase,
  HiCash,
  HiIdentification,
  HiPhone,
  HiUserGroup,
  HiHome,
  HiUserCircle,
} from "react-icons/hi";

const statusColors = {
  depending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  stable: { bg: "bg-green-100", text: "text-green-800" },
  critical: { bg: "bg-red-100", text: "text-red-800" },
};

const UserCardList = ({ users = [] }) => {
  if (users.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">No users found.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((u) => (
        <div
          key={u._id}
          className="relative border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-xl transition p-5 flex flex-col justify-between"
        >
          {/* Verified Badge at Top Right */}
          {u.isVerified && (
            <div className="absolute top-3 right-3 text-green-600 flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full text-xs font-medium">
              <HiBadgeCheck className="text-green-600" />
              Verified
            </div>
          )}

          {/* Name and Reg No */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-blue-400 capitalize flex flex-wrap gap-2 items-center">
              {u.name}
              {u.registrationNumber && (
                <span className="text-sm text-gray-500 font-medium italic">
                  Reg no. {u.registrationNumber}
                </span>
              )}
            </h3>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-[24px_1fr_2fr] gap-x-3 gap-y-3 text-gray-700 text-sm">
            <HiUser className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Age</span>
            <span>{u.age ?? "-"}</span>

            <HiCalendar className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Reg. Date</span>
            <span>
              {u.registrationDate
                ? new Date(u.registrationDate).toLocaleDateString()
                : "-"}
            </span>

            

            <HiIdentification className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">CNIC</span>
            <span>{u.cnicNumber || "-"}</span>

            <HiPhone className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Mobile</span>
            <span>{u.contactNumber || "-"}</span>

            <HiUserCircle className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Gender</span>
            <span>{u.gender || "-"}</span>

            <HiUserGroup className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Family Members</span>
            <span>{u.familyMembers ?? "-"}</span>

            <HiHome className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Father/Husband</span>
            <span>{u.fatherHusbandName || "-"}</span>

            <HiBadgeCheck className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Status</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize w-fit ${
                statusColors[u.status?.toLowerCase()]?.bg || "bg-gray-200"
              } ${statusColors[u.status?.toLowerCase()]?.text || "text-gray-700"}`}
            >
              {u.status || "Unknown"}
            </span>

            <HiBriefcase className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Job Status</span>
            <span>{u.jobStatus || "-"}</span>

            <HiCash className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Monthly Income</span>
            <span>
              {u.monthlyIncome
                ? `Rs. ${u.monthlyIncome.toLocaleString()}`
                : "-"}
            </span>
            <HiLocationMarker className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Address</span>
            <span className="truncate">{u.address || "-"}</span>
          </div>

          {/* Detail Section */}
          {u.detail && (
            <p className="mt-5 text-sm text-gray-500 italic line-clamp-3">
              {u.detail}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserCardList;
