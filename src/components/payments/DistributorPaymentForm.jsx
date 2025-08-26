"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "@/data/baseurl";

const AREAS = [
  "Khokhrapar",
  "Nayabad",
  "Garden",
  "Lyari",
  "Korangi",
  "Gulshan",
  "Malir",
  "Nazimabad",
  "Landhi",
  "Orangi",
  "North Karachi",
  "North Nazimabad",
  "Defence",
  "Clifton",
  "Shah Faisal",
  "Saddar",
  "Liaquatabad",
  "Johar",
  "Surjani",
  "FB Area",
  "Shah Latif",
  "Steel Town",
];

export default function DistributorPaymentForm() {
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState("");
  const [month, setMonth] = useState("");
  const [area, setArea] = useState("");
  const [userPayments, setUserPayments] = useState([]);

  // For searching users
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const { res } = await axios.get(`${BASE_URL}/api/distributors`);
          console.log(res?.data);

        // setDistributors(data.data || []);
      } catch (err) {
        console.error("Error fetching distributors:", err);
      }
    };
    fetchDistributors();
  }, []);

  // search user by CNIC / mobile / regNumber
  const handleUserSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const { data } = await axios.get(`/api/users?q=${searchQuery}`);
      setSearchResults(Array.isArray(data.data) ? data.data : [data.data]);
    } catch (err) {
      toast.error("User not found");
    }
  };

  const addUserPayment = (user) => {
    if (userPayments.find((up) => up.user === user._id)) {
      toast.error("User already added");
      return;
    }
    setUserPayments([
      ...userPayments,
      { user: user._id, name: user.name, amount: "", status: "pending", failedremarks: "" },
    ]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleUserPaymentChange = (index, field, value) => {
    const updated = [...userPayments];
    updated[index][field] = value;
    setUserPayments(updated);
  };

  const handleSubmit = async () => {
    if (!selectedDistributor || !month || !area || userPayments.length === 0) {
      toast.error("Please fill all fields and add at least one user.");
      return;
    }

    try {
      const payload = {
        distributor: selectedDistributor,
        month,
        area,
        users: userPayments.map(({ user, amount, status, failedremarks }) => ({
          user,
          amount,
          status,
          failedremarks,
        })),
      };

      const { data } = await axios.post("/api/distributor-payments", payload);
      toast.success("Distributor payment created successfully!");
      console.log("Response:", data);

      // Reset form
      setSelectedDistributor("");
      setMonth("");
      setArea("");
      setUserPayments([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating payment");
    }
  };

  return (
    <Card className="p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Distributor Payment Form</h2>
      <CardContent className="space-y-4">
        {/* Distributor select */}
        <div>
          <label className="block mb-1">Select Distributor</label>
          <Select value={selectedDistributor} onValueChange={setSelectedDistributor}>
            <SelectTrigger>
              <SelectValue placeholder="Choose distributor" />
            </SelectTrigger>
            <SelectContent>
              {distributors.map((d) => (
                <SelectItem key={d._id} value={d._id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month select */}
        <div>
          <label className="block mb-1">Select Month</label>
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>

        {/* Area select */}
        <div>
          <label className="block mb-1">Select Area</label>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger>
              <SelectValue placeholder="Choose area" />
            </SelectTrigger>
            <SelectContent>
              {AREAS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search user */}
        <div>
          <label className="block mb-1">Search User</label>
          <div className="flex gap-2">
            <Input
              placeholder="Search by CNIC / Mobile / Reg No"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleUserSearch}>Search</Button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 border rounded p-2">
              {searchResults.map((u) => (
                <div key={u._id} className="flex justify-between items-center border-b py-1">
                  <span>
                    {u.name} ({u.cnicNumber}) - {u.contactNumber}
                  </span>
                  <Button size="sm" onClick={() => addUserPayment(u)}>
                    + Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Users table */}
        {userPayments.length > 0 && (
          <div>
            <label className="block mb-2">User Payments</label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Failed Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPayments.map((up, i) => (
                  <TableRow key={i}>
                    <TableCell>{up.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={up.amount}
                        onChange={(e) => handleUserPaymentChange(i, "amount", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={up.status} onValueChange={(val) => handleUserPaymentChange(i, "status", val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={up.failedremarks}
                        onChange={(e) => handleUserPaymentChange(i, "failedremarks", e.target.value)}
                        placeholder="Enter remarks if failed"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Submit button */}
        <Button className="w-full" onClick={handleSubmit}>
          Create Distributor Payment
        </Button>
      </CardContent>
    </Card>
  );
}
