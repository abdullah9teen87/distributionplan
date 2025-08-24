import React from "react";
import {
  HiUser,
  HiCalendar,
  HiLocationMarker,
  HiBadgeCheck,
  HiBriefcase,
  HiIdentification,
  HiPhone,
  HiHome,
  HiUserCircle,
} from "react-icons/hi";

const statusColors = {
  depending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  stable: { bg: "bg-green-100", text: "text-green-800" },
  critical: { bg: "bg-red-100", text: "text-red-800" },
};

const DistributorCardList = ({ distributors = [] }) => {
  if (distributors.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">No distributors found.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {distributors.map((d) => (
        <div
          key={d._id}
          className="relative border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-xl transition p-5 flex flex-col justify-between"
        >
          {/* Verified Badge */}
          {d.isVerified && (
            <div className="absolute top-3 right-3 text-green-600 flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full text-xs font-medium">
              <HiBadgeCheck className="text-green-600" />
              Verified
            </div>
          )}

          {/* Name and Registration */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-blue-700 capitalize flex flex-wrap gap-2 items-center">
              {d.name}
              {d.registrationNumber && (
                <span className="text-sm text-gray-500 font-medium italic">
                  Reg no. {d.registrationNumber}
                </span>
              )}
            </h3>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-[24px_1fr_2fr] gap-x-3 gap-y-3 text-gray-700 text-sm">
            <HiUser className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Age</span>
            <span>{d.age ?? "-"}</span>

            <HiCalendar className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Reg. Date</span>
            <span>
              {d.registrationDate
                ? new Date(d.registrationDate).toLocaleDateString()
                : "-"}
            </span>

            <HiIdentification className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">CNIC</span>
            <span>{d.cnicNumber || "-"}</span>

            <HiPhone className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Mobile</span>
            <span>{d.contactNumber || "-"}</span>

            <HiUserCircle className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Gender</span>
            <span>{d.gender || "-"}</span>

            <HiHome className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Father/Husband</span>
            <span>{d.fatherHusbandName || "-"}</span>

            <HiBadgeCheck className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Status</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize w-fit ${
                statusColors[d.status?.toLowerCase()]?.bg || "bg-gray-200"
              } ${statusColors[d.status?.toLowerCase()]?.text || "text-gray-700"}`}
            >
              {d.status || "Unknown"}
            </span>

            <HiBriefcase className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Job Status</span>
            <span>{d.jobStatus || "-"}</span>

            <HiLocationMarker className="text-gray-400 mt-0.5" />
            <span className="font-semibold capitalize">Address</span>
            <span className="truncate">{d.address || "-"}</span>
          </div>

          {/* Detail Section */}
          {d.detail && (
            <p className="mt-5 text-sm text-gray-500 italic line-clamp-3">
              {d.detail}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DistributorCardList;
