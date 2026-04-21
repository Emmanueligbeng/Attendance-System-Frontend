"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);

  const controllerRef = useRef<AbortController | null>(null);

  const COLORS = ["#22c55e", "#ef4444", "#eab308"];

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      setAdminName(decoded.username || decoded.user || decoded.name || "Admin");
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      router.push("/login");
    }
  }, [router]);

  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) throw new Error("No refresh token");

    const res = await fetch(`${API}/api/token/refresh/`, {  // ✅ fixed
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh })
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    localStorage.setItem("access", data.access);
    return data.access;
  };

  const fetchData = useCallback(async () => {
    if (controllerRef.current) controllerRef.current.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      let token = localStorage.getItem("access");

      if (!token) {
        setError("No authentication token");
        setLoading(false);
        return;
      }

      let res = await fetch(`${API}/api/get-attendance/`, {  // ✅ fixed
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });

      if (res.status === 401) {
        try {
          token = await refreshAccessToken();
          res = await fetch(`${API}/api/get-attendance/`, {  // ✅ fixed
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal
          });
        } catch {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          router.push("/login");
          return;
        }
      }

      if (!res.ok) throw new Error("Server error");

      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
      setError(null);

    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError("⚠️ Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      if (!document.hidden) fetchData();
    }, 5000);

    return () => {
      clearInterval(interval);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const trigger = localStorage.getItem("refresh_dashboard");
      if (trigger) {
        fetchData();
        localStorage.removeItem("refresh_dashboard");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const analytics = useMemo(() => {
    const total = data.length;
    const granted = data.filter(i => i.status?.toLowerCase() === "granted").length;
    const denied = data.filter(i => i.status?.toLowerCase() === "denied").length;
    const absent = data.filter(i => i.status?.toLowerCase() === "absent").length;

    const statusData = [
      { name: "Granted", value: granted },
      { name: "Denied", value: denied },
      { name: "Absent", value: absent },
    ];

    const courseMap: Record<string, number> = {};
    data.forEach(item => {
      if (!item.course) return;
      courseMap[item.course] = (courseMap[item.course] || 0) + 1;
    });

    const courseData = Object.keys(courseMap).map(course => ({
      course,
      count: courseMap[course]
    }));

    return { total, granted, denied, absent, statusData, courseData };
  }, [data]);

  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch(`${API}/api/export/`, {  // ✅ fixed
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        alert("Download failed");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download error");
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    router.push("/login");
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Welcome, <span className="text-blue-400 font-semibold">{adminName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={downloadExcel} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
            ⬇ Export Excel
          </button>

          <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">
            Logout
          </button>

          <span className="text-green-400 text-sm font-mono">● LIVE</span>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && <p className="text-center text-gray-400">Loading data...</p>}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <p className="text-center text-gray-500">No attendance records yet</p>
      )}

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat title="Total Scans" value={analytics.total} />
        <Stat title="Granted" value={analytics.granted} color="text-green-400" />
        <Stat title="Denied" value={analytics.denied} color="text-red-400" />
        <Stat title="Absent" value={analytics.absent} color="text-yellow-400" />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Access Status">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={analytics.statusData} dataKey="value" outerRadius={80}>
                {analytics.statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Course Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.courseData}>
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold">Recent Check-ins</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400">
              <tr>
                <th className="p-4">S/N</th>
                <th className="p-4">Name</th>
                <th className="p-4">Matric</th>
                <th className="p-4">Dept</th>
                <th className="p-4">Course</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="p-4">{i + 1}</td>
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.matric_number}</td>
                  <td className="p-4">{item.department}</td>
                  <td className="p-4">{item.course}</td>
                  <td className="p-4">{item.time ? new Date(item.time).toLocaleTimeString() : "—"}</td>
                  <td className={`p-4 ${
                    item.status?.toLowerCase() === "granted"
                      ? "text-green-400"
                      : item.status?.toLowerCase() === "denied"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}>
                    {item.status?.toUpperCase() || "UNKNOWN"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const Stat = ({ title, value, color = "" }: any) => (
  <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
    <h2 className="text-gray-400">{title}</h2>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const ChartCard = ({ title, children }: any) => (
  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
    <h2 className="mb-4 font-semibold">{title}</h2>
    {children}
  </div>
);