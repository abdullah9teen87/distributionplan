"use client";
import React from "react";

const PaymentCardList = ({ payments }) => {
  if (!Array.isArray(payments) || payments.length === 0) {
    return <p className="text-gray-600 text-center py-4">No payments found.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {payments.map((p) => (
        <div
          key={p._id}
          className="p-4 border rounded-xl shadow hover:shadow-lg transition bg-white"
        >
          <h2 className="text-lg font-semibold text-gray-800">
            {p.distributor?.name || "Unknown Distributor"}
          </h2>
          <p className="text-sm text-gray-600">Month: {p.month}</p>
          <p className="text-sm text-gray-600">Total Amount: Rs. {p.totalAmount}</p>
          <p className="text-sm text-gray-600">Returned Amount: Rs. {p.returnedAmount}</p>
          <p
            className={`text-sm font-medium ${
              p.status === "completed"
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            Status: {p.status}
          </p>
          <p className="text-sm text-gray-600">
            Closed By Admin: {p.isClosedByAdmin ? "Yes" : "No"}
          </p>
          {p.remarks && (
            <p className="text-sm text-gray-500">Remarks: {p.remarks}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Created: {new Date(p.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PaymentCardList;
