import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";
import { Legend } from "recharts";

import { useEffect, useState } from "react";

const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28"];

export default function Analytics() {
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchData();

    // 🔥 auto-refresh (real-time feel)
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);

  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/claims", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setClaims(data);

      const approved = data.filter(c => c.status === "approved").length;
      const rejected = data.filter(c => c.status === "rejected").length;

      setStats({
        total: data.length,
        approved,
        rejected,
      });

    } catch (err) {
      console.error(err);
    }
  };

  // 📈 Monthly trend
  const monthlyData = {};
  claims.forEach((c) => {
    const month = new Date(c.date).toLocaleString("default", { month: "short" });
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  const lineData = Object.keys(monthlyData).map((m) => ({
    name: m,
    value: monthlyData[m],
  }));

  // 🍩 Status distribution
  const statusCount = {};
  claims.forEach((c) => {
    statusCount[c.status] = (statusCount[c.status] || 0) + 1;
  });

  const pieData = Object.keys(statusCount).map((key) => ({
    name: key,
    value: statusCount[key],
  }));

  // 📊 Bar chart (by type)
  const typeCount = {};
  claims.forEach((c) => {
    const type = c.type || "Other";
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  const barData = Object.keys(typeCount).map((key) => ({
    name: key,
    value: typeCount[key],
  }));

  // 📊 Approval rate
  const approvalRate =
    stats.total === 0
      ? 0
      : ((stats.approved / stats.total) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* 🔹 Top Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Claims" value={stats.total} />
        <Card title="Approved" value={stats.approved} />
        <Card title="Rejected" value={stats.rejected} />
        <Card title="Approval Rate" value={`${approvalRate}%`} />
      </div>

      {/* 🔹 Charts */}
      <div className="grid grid-cols-2 gap-6">

        {/* Line Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="mb-2 font-semibold">Claims Trend</h2>
          <LineChart width={400} height={250} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00C49F" />
          </LineChart>
        </div>

        {/* Pie Chart */}
        {/* <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="mb-2 font-semibold">Status Distribution</h2>
          <PieChart width={400} height={250}>
            <Pie data={pieData} dataKey="value" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div> */}

        <div className="bg-white p-4 rounded-xl shadow">
  <h2 className="mb-2 font-semibold">Status Distribution</h2>

  <PieChart width={400} height={250}>
    <Pie
      data={pieData}
      dataKey="value"
      cx="50%"
      cy="50%"
      outerRadius={80}
      label={({ name, percent }) =>
        `${name} ${(percent * 100).toFixed(0)}%`
      }
    >
      {pieData.map((entry, index) => (
        <Cell key={index} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>

    {/* 🔥 Legend */}
    <Legend />

    {/* 🔥 Tooltip */}
    <Tooltip />
  </PieChart>
</div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="mb-2 font-semibold">Insurance Type</h2>
          <BarChart width={400} height={250} data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#1E3A8A" />
          </BarChart>
        </div>

        {/* Payout Trend */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="mb-2 font-semibold">Payout Trend</h2>
          <LineChart width={400} height={250} data={lineData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#F59E0B" />
          </LineChart>
        </div>

      </div>
    </div>
  );
}

// 🔹 Reusable Card
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}