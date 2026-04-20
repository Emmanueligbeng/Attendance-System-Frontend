"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    router.push("/login");
  };

  const hideNavbarRoutes = ["/login", "/signup"];
  if (hideNavbarRoutes.includes(pathname)) return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center text-white">

      {/* LEFT SIDE */}
      <div
        className="font-bold text-lg cursor-pointer text-blue-400"
        onClick={() => router.push("/")}
      >
        QR Attendance
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 text-sm">

        <span
          className="cursor-pointer hover:text-blue-400"
          onClick={() => router.push("/")}
        >
          Home
        </span>
        <span
          className="cursor-pointer hover:text-blue-400"
          onClick={() => router.push("/scan")}
        >
          Scan
        </span>

        {isLoggedIn ? (
          <>
            <span
              className="cursor-pointer hover:text-blue-400"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </span>

            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <span
              className="cursor-pointer hover:text-blue-400"
              onClick={() => router.push("/login")}
            >
              Login
            </span>

            <span
              className="cursor-pointer hover:text-green-400"
              onClick={() => router.push("/signup")}
            >
              Signup
            </span>
          </>
        )}

      </div>
    </nav>
  );
}