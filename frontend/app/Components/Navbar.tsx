"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "../Hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Navbar = () => {
  const { state, updateUser } = useAuthContext();
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

  // State to manage the visibility of the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="w-full bg-[#05703b] text-white p-4">
      <div className="max-w-7xl mx-auto relative">
        <nav className="flex justify-between items-center">
          <Link className="cursor-pointer" href={"/"}>
            <img
            // onResize={}
              src="/Logo_RLegal_white.png"
              alt="Receta Legal Logo"
              // width={80}
              // height={80}
              className="md:w-[100px] w-20"
            />
          </Link>
          {/* Hamburger menu icon for small screens */}
          <div className="block lg:hidden relative">
            <button
              className="text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-16 w-64  right-0 bg-[#232325] p-4  z-10 rounded-md">
                <div className="flex flex-col gap-4">
                  {/* Render navigation links */}
                  {environment === "production" ? (
                    <></>
                  ) : (
                    <>
                      {state ? (
                        <>
                          <Link
                            onClick={() => setIsMobileMenuOpen(false)}
                            href={"/profile"}
                          >
                            Perfil
                          </Link>
                          <Link
                            onClick={() => setIsMobileMenuOpen(false)}
                            href={"/prescriptions"}
                          >
                            Ver Mis Prescripciones
                          </Link>

                          <Link href={"/Ley-21575_23-MAY-2023.pdf"}>
                            Información Legal
                          </Link>
                          <Button
                            className="bg-red-400 text-white hover:text-black hover:bg-white"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              localStorage.removeItem("user");
                              updateUser(null);
                            }}
                          >
                            Cerrar sesión
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link
                            onClick={() => setIsMobileMenuOpen(false)}
                            href={"/login"}
                          >
                            Iniciar sesión
                          </Link>
                          <Link
                            onClick={() => setIsMobileMenuOpen(false)}
                            href={"/register"}
                          >
                            Registrarse
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Main navigation links for larger screens */}
          <div className="hidden lg:flex gap-8 items-center">
            {environment === "production" ? (
              <></>
            ) : (
              <>
                {state ? (
                  <>
                    <Link href={"/profile"}>Perfil</Link>
                    <Link href={"/prescriptions"}>Ver Mis Prescripciones</Link>
                    <Link href={"/Ley-21575_23-MAY-2023.pdf"}>
                      Información Legal
                    </Link>
                    <Button
                      className="bg-red-400 text-white hover:text-black hover:bg-white"
                      onClick={() => {
                        localStorage.removeItem("user");
                        updateUser(null);
                      }}
                    >
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href={"/login"}>Iniciar sesión</Link>
                    <Link href={"/register"}>Registrarse</Link>
                  </>
                )}
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
