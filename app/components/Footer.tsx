"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 text-sm py-4 mt-0">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">

        <p>© {new Date().getFullYear()} QR Attendance System</p>

        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer">Privacy</span>
          <span className="hover:text-white cursor-pointer">Terms</span>
          <span className="hover:text-white cursor-pointer">Support</span>
        </div>

      </div>
    </footer>
  );
}