"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

function DistributorPayment() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [month, setMonth] = useState("2025-09");
  const [payment, setPayment] = useState(null);

  // 🔹 Load groups from API
  useEffect(() => {
    fetch("/api/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data));
  }, []);

  // 🔹 Create Payment from Group
  const createPayment = async () => {
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: selectedGroup, month }),
    });
    const data = await res.json();
    setPayment(data);
  };

  return (
    <div className="p-6 grid gap-6">
      {/* Select Group */}
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">Create Distributor Payment</h2>
        <Select onValueChange={setSelectedGroup}>
          {groups.map((g) => (
            <SelectItem key={g._id} value={g._id}>
              {g.distributor.name} ({g.areas.join(", ")})
            </SelectItem>
          ))}
        </Select>

        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="mt-3"
        />

        <Button className="mt-3" onClick={createPayment}>
          Create Payment
        </Button>
      </Card>

      {/* Show Payment if created */}
      {payment && (
        <Card className="p-4">
          <h2 className="text-xl font-bold">Payment Summary</h2>
          <p>Total: {payment.totalAmount}</p>
          <p>Paid: {payment.paidAmount}</p>
          <p>Pending: {payment.pendingAmount}</p>

          <div className="mt-4 grid gap-3">
            {payment.users.map((u) => (
              <Card key={u.user._id} className="p-3">
                <CardContent className="flex justify-between items-center">
                  <span>{u.user.name} - Rs.{u.amount}</span>
                  <Badge
                    variant={
                      u.status === "paid"
                        ? "success"
                        : u.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {u.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default DistributorPayment;