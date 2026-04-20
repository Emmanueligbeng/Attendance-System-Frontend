"use client";

import "./globals.css";
import { usePathname } from "next/navigation";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideFooterRoutes = ["/login", "/signup"];
  const hideNavbarRoutes = ["/login", "/signup"];

  const showFooter = !hideFooterRoutes.includes(pathname);
  const showNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className="bg-black text-white flex flex-col min-h-screen">

        {/* NAVBAR */}
        {showNavbar && <Navbar />}

        {/* PAGE CONTENT */}
        <main className="flex-grow">
          {children}
        </main>

        {/* FOOTER */}
        {showFooter && <Footer />}

      </body>
    </html>
  );
}