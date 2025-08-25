"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter
} from "recharts";

const userData = [
  { name: "Active Users", value: 400 },
  { name: "Inactive Users", value: 150 },
  { name: "New Users", value: 120 },
];

const distributorData = [
  { name: "Distributor A", value: 300 },
  { name: "Distributor B", value: 200 },
  { name: "Distributor C", value: 150 },
];

const monthlyPayments = [
  { month: "Jan", amount: 4000 },
  { month: "Feb", amount: 3200 },
  { month: "Mar", amount: 5000 },
  { month: "Apr", amount: 4500 },
  { month: "May", amount: 5200 },
  { month: "Jun", amount: 6100 },
];

const paymentPlans = [
  { plan: "Basic", total: 2000 },
  { plan: "Standard", total: 3500 },
  { plan: "Premium", total: 5000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function HomePage() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Pie Chart - Users Distribution */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Users Distribution (Pie Chart)</h2>
          <PieChart width={350} height={250}>
            <Pie data={userData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {userData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </CardContent>
      </Card>

      {/* Bar Chart - Distributor Distribution */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Distributor Distribution (Bar Chart)</h2>
          <BarChart width={400} height={250} data={distributorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#FF8042" />
          </BarChart>
        </CardContent>
      </Card>

      {/* Line Chart - Monthly Payments */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Monthly Payments (Line Chart)</h2>
          <LineChart width={400} height={250} data={monthlyPayments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </CardContent>
      </Card>

      {/* Area Chart - Payment Plans */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Payment Plans (Area Chart)</h2>
          <AreaChart width={400} height={250} data={paymentPlans}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="plan" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="total" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </CardContent>
      </Card>

      {/* Radar Chart - Users vs Distributor */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Users vs Distributors (Radar Chart)</h2>
          <RadarChart outerRadius={90} width={400} height={250} data={[
            { subject: "Users", A: 670, fullMark: 1000 },
            { subject: "Distributors", A: 650, fullMark: 1000 },
          ]}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar name="Value" dataKey="A" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </CardContent>
      </Card>

      {/* Scatter Chart - Custom Example */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Custom Scatter Data</h2>
          <ScatterChart width={400} height={250}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="stature" />
            <YAxis type="number" dataKey="y" name="weight" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter name="Data Points" data={[{ x: 100, y: 200 }, { x: 120, y: 100 }, { x: 170, y: 300 }]} fill="#0088FE" />
          </ScatterChart>
        </CardContent>
      </Card>
    </div>
  );
}
