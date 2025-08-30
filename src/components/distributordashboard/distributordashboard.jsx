"use client";
import { BASE_URL } from "@/data/baseurl";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DistributorDashboard() {
  const [distributor, setDistributor] = useState(null);
  const [distributorData, setDistributorData] = useState({
    totalPayment: 0,
    pendingPayment: 0,
    carryForward: 0,
    users: [],
  });

  const router = useRouter();

  useEffect(() => {
    const getDistributor = async () => {
      try {
        const response = JSON.parse(localStorage.getItem("user"));
        
        if (!response?.id) {
            console.error("No distributor ID found in localStorage");
            return;
        }
        
        console.log("Distributor from localStorage:", response);
        setDistributor(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getDistributor();
  }, []);

useEffect(() => {
  const getUsers = async () => {
    try {
      if (!distributor) {
        console.log("distributor not found");
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/api/distributor-payments/by-distributor/${distributor.id}`
      );
      console.log(res?.data);

      const payments = res.data?.data || [];
      const latestPayment = payments[0] || { users: [], totalAmount: 0 };

      const pendingPayment = latestPayment.users
        .filter((u) => u.status === "pending")
        .reduce((sum, u) => sum + (u.amount || 0), 0);

      const carryForward = latestPayment.users
        .filter((u) => u.carryForward)
        .reduce((sum, u) => sum + (u.amount || 0), 0);

      setDistributorData({
        totalPayment: latestPayment.totalAmount || 0,
        pendingPayment,
        carryForward,
        users: latestPayment.users.map((u) => ({
          id: u.user?._id,
          name: u.user?.name || "Unknown",
          amount: u.amount,
          status: u.status,
        })),
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  getUsers();
}, [distributor]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-300 to-blue-400 text-white p-5 shadow-md">
        <h1 className="text-center text-xl font-bold tracking-wide">
          Distributor Dashboard
        </h1>
      </div>

      <div className="p-5 space-y-6 max-w-lg mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-100 text-center shadow-md rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700">Total</p>
            <p className="text-lg font-bold text-blue-700">
              Rs {distributorData.totalPayment}
            </p>
          </div>
          <div className="bg-yellow-100 text-center shadow-md rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700">Pending</p>
            <p className="text-lg font-bold text-yellow-700">
              Rs {distributorData.pendingPayment}
            </p>
          </div>
          <div className="bg-red-100 text-center shadow-md rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700">Carry Fwd</p>
            <p className="text-lg font-bold text-red-700">
              Rs {distributorData.carryForward}
            </p>
          </div>
        </div>

        {/* User List */}
        <h2 className="text-lg font-semibold mt-4">Current Users</h2>
        <div className="space-y-3">
          {distributorData.users.map((user) => (
            <div
              key={user.id}
              onClick={() =>
                router.push(`/dashboard/distributor/user/${user.id}`)
              }
              className="p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer flex justify-between items-center"
            >
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-gray-600">
                Rs {user.amount} • {user.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
