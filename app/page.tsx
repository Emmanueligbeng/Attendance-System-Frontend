"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const features = [
  {
    title: "QR verification",
    desc: "Instant identity validation with secure, student-unique QR codes.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    iconBg: "rgba(99,102,241,0.15)",
  },
  {
    title: "Real-time tracking",
    desc: "Monitor attendance live as students check in — dashboard updates instantly.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    iconBg: "rgba(16,185,129,0.12)",
  },
  {
    title: "Fraud prevention",
    desc: "Duplicate check-in detection stops impersonation and proxy attendance.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    iconBg: "rgba(239,68,68,0.12)",
  },
  {
    title: "Excel export",
    desc: "Download full attendance records as formatted Excel files in one click.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    iconBg: "rgba(234,179,8,0.12)",
  },
  {
    title: "Multi-course support",
    desc: "Track attendance across multiple courses and departments simultaneously.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    iconBg: "rgba(99,102,241,0.15)",
  },
  {
    title: "Secured admin access",
    desc: "JWT-based authentication keeps dashboard access restricted to staff only.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    iconBg: "rgba(16,185,129,0.12)",
  },
]

const steps = [
  {
    title: "Student receives their QR code",
    desc: "Each registered student is issued a unique QR code tied to their matric number and enrolled courses.",
  },
  {
    title: "Scan at the exam entrance",
    desc: "The invigilator scans the QR — the system checks registration, detects duplicates, and logs the time.",
  },
  {
    title: "Access granted instantly",
    desc: "A clear granted or denied response appears with the student photo and details for visual verification.",
  },
]

const stats = [
  { value: "1,000+", label: "Students verified" },
  { value: "99%", label: "Accuracy rate" },
  { value: "24/7", label: "Availability" },
]

export default function Home() {
  return (
    <div className="bg-[#0B0F19] text-gray-200 min-h-screen">

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-indigo-600 rounded-full top-[-120px] left-[-80px] opacity-[0.08]" />
        <div className="absolute w-[300px] h-[300px] bg-purple-600 rounded-full bottom-[-80px] right-[-60px] opacity-[0.08]" />

        <div className="text-center max-w-2xl z-10">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-xs text-indigo-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Live system — operational
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-slate-50"
          >
            Smart QR attendance<br />for modern campuses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base text-slate-400 mb-8 leading-relaxed"
          >
            Secure, real-time student verification. No paper. No fraud. Just scan and go.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 justify-center flex-wrap"
          >
            <Link href="/scan">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition">
                Start scanning
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/5 transition">
                View dashboard
              </button>
            </Link>
          </motion.div>

          {/* Inline stats */}
          <div className="mt-12 flex gap-8 justify-center flex-wrap">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-slate-50">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-indigo-500/10 text-indigo-300 text-xs px-3 py-1 rounded-md mb-3">
            Features
          </span>
          <h2 className="text-3xl font-bold text-slate-50">Everything you need</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-[#111827] border border-gray-800 hover:border-indigo-500/60 rounded-2xl p-6 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.iconBg }}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#0F172A] py-20 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-indigo-500/10 text-indigo-300 text-xs px-3 py-1 rounded-md mb-3">
              How it works
            </span>
            <h2 className="text-3xl font-bold text-slate-50">Three simple steps</h2>
          </div>

          <div className="flex flex-col">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-medium flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-gray-800 my-2" />
                  )}
                </div>
                <div className={`pt-1.5 ${i < steps.length - 1 ? "pb-8" : ""}`}>
                  <h3 className="font-semibold text-slate-100 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-[#0B0F19]">
        <h2 className="text-3xl font-bold text-slate-50 mb-3">Ready to get started?</h2>
        <p className="text-slate-400 mb-8">Set up takes minutes. No hardware required.</p>
        <Link href="/scan">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-medium text-base transition">
            Start scanning now
          </button>
        </Link>
      </section>

      {/* FOOTER
      <footer className="bg-[#020617] border-t border-gray-800 py-5 px-6 flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-[10px] text-white font-semibold">
            QR
          </div>
          <span className="text-slate-500 text-sm">© 2026 Techturant.com</span>
        </div>
        <nav className="flex gap-5">
          {["Privacy", "Terms", "Support"].map((l) => (
            <span key={l} className="text-slate-500 hover:text-slate-300 text-sm cursor-pointer transition-colors">
              {l}
            </span>
          ))}
        </nav>
      </footer> */}

    </div>
  )
}