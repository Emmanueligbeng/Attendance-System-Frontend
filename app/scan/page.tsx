"use client"

import { useEffect, useState, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"

export default function ScanPage() {
  const [result, setResult] = useState("")
  const [status, setStatus] = useState("")
  const [reason, setReason] = useState("")
  const [student, setStudent] = useState<any>(null)
  const [animate, setAnimate] = useState("")

  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isRunningRef = useRef<boolean>(false)
  const scannedRef = useRef<boolean>(false)

  const successSound = useRef<HTMLAudioElement | null>(null)
  const errorSound = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (scannerRef.current) return

    successSound.current = new Audio("/sounds/success.mp3")
    errorSound.current = new Audio("/sounds/error.mp3")

    const scanner = new Html5Qrcode("reader")
    scannerRef.current = scanner

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 350, height: 350 } },

          async (decodedText) => {
            if (scannedRef.current) return
            scannedRef.current = true

            setResult(decodedText)

            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/check-attendance/`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    matric_number: decodedText,
                    course_code: "CSC101",
                  }),
                }
              )

              const data = await res.json()

              setStatus(data.status)
              setReason(data.reason || "")
              setStudent(data.student || null)

              if (data.status === "granted") {
                successSound.current?.play()
                setAnimate("success")
              } else {
                errorSound.current?.play()
                setAnimate("error")
              }

              setTimeout(() => setAnimate(""), 1500)

            } catch {
              setStatus("error")
              setReason("Network error")
              errorSound.current?.play()
              setAnimate("error")
            }

            if (scannerRef.current && isRunningRef.current) {
              scannerRef.current.stop().catch(() => {})
              isRunningRef.current = false
            }
          },

          // ✅ FIXED: 4th argument (error callback)
          (errorMessage) => {
            console.log("Scan error:", errorMessage)
          }
        )

        isRunningRef.current = true
      } catch {
        setStatus("error")
        setReason("Camera access failed")
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const handleRescan = async () => {
    setResult("")
    setStatus("")
    setReason("")
    setStudent(null)
    scannedRef.current = false

    if (scannerRef.current) {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 350 },

        async () => {},

        // ✅ FIXED: 4th argument here too
        (errorMessage) => {
          console.log("Scan error:", errorMessage)
        }
      )

      isRunningRef.current = true
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative">

      {animate === "success" && (
        <div className="absolute inset-0 bg-green-500 opacity-20 animate-pulse" />
      )}
      {animate === "error" && (
        <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse" />
      )}

      <h1 className="text-2xl font-bold mb-4 tracking-wide">
        EXAM GATE SCANNER
      </h1>

      <div className="w-full max-w-xl border-2 border-gray-700 rounded-xl overflow-hidden">
        <div id="reader" style={{ minHeight: 400 }} />
      </div>

      {status && (
        <div className={`mt-6 text-3xl font-extrabold tracking-wider ${
          status === "granted" ? "text-green-400" : "text-red-400"
        }`}>
          {status === "granted" ? "ACCESS GRANTED" : "ACCESS DENIED"}
        </div>
      )}

      {reason && (
        <p className="text-red-400 mt-2 text-sm">
          {reason}
        </p>
      )}

      {student && (
        <div className="mt-6 bg-gray-900 border border-gray-700 p-5 rounded-xl w-full max-w-md">

          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                student.image
                  ? `${process.env.NEXT_PUBLIC_API_URL}${student.image}`
                  : "/default.png"
              }
              className="w-16 h-16 rounded-full border border-gray-600 object-cover"
            />

            <div>
              <h2 className="font-bold text-lg">{student.name}</h2>
              <p className="text-gray-400">{student.matric_number}</p>
            </div>
          </div>

          <p className="text-sm"><strong>Dept:</strong> {student.department}</p>
          <p className="text-sm"><strong>Level:</strong> {student.level}</p>

          <div className="mt-2">
            <strong className="text-sm">Courses:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {student.courses?.map((c: string, i: number) => (
                <span
                  key={i}
                  className="bg-gray-800 px-2 py-1 text-xs rounded border border-gray-600"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleRescan}
        className="mt-6 bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Scan Next Student
      </button>

    </div>
  )
}