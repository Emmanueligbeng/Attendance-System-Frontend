"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!form.username || !form.password) {
      alert("Fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully");
        router.push("/login");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-6 rounded-xl w-80 border border-gray-800">

        <h1 className="text-xl font-bold mb-4 text-center">Create Account</h1>

        <input
          placeholder="Username"
          className="w-full mb-3 p-2 rounded bg-gray-800 outline-none"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 rounded bg-gray-800 outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 p-2 rounded bg-gray-800 outline-none"
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p
          className="text-sm text-gray-400 mt-4 cursor-pointer text-center"
          onClick={() => router.push("/login")}
        >
          Already have an account? Login
        </p>

      </div>
    </div>
  );
}