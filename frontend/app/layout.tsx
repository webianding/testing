import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Navbar from "./Components/Navbar";
import AuthContextProvider from "./Context/AuthContext";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Footer from "./Components/Footer";

export const metadata: Metadata = {
  title: "Receta Legal",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  return (
    <AuthContextProvider>
      <html className="scroll-smooth" lang="en">
        <body className={`${inter.className} bg-gray-50`}>
          <Navbar />
          {children}

          <ToastContainer />

          {/* {environment === "production" ? (
            <div className="bg-[url('/esteban-lopez-cQtAjvP6hUQ-unsplash.jpg')] bg-center bg-cover h-[100vh]">
              <div className="flex flex-col h-full w-full justify-center items-center max-w-7xl mx-auto md:p-6 p-4">
                <h1 className="text-4xl my-10 font-bold text-white text-center">
                  Receta Legal is coming soon...
                </h1>
                <Image
                  src="/Logo_RLegal_white.png"
                  alt="Receta Legal Logo"
                  width={300}
                  height={300}
                />
              </div>
            </div>
          ) : (
            <>
            </>
          )} */}
          <Footer />
        </body>
      </html>
    </AuthContextProvider>
  );
}
