"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { InputWithLabel } from "../Components/InputComponent";
import { useAuthContext } from "../Hooks/useAuthContext";
import { useLogin } from "../Hooks/useLogin";
import Link from "next/link";

const LoginForm = () => {
  const { state, updateUser } = useAuthContext();

  if (state) {
    redirect("/");
  }

  // API URL
  const url = process.env.NEXT_PUBLIC_URL;

  // State variables for email and password
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle login
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(`${url}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setIsLoading(false);
        setError(data.error);
        throw Error(data.error);
      }

      if (res.ok) {
        // save user to local storage
        localStorage.setItem("user", JSON.stringify(data));

        // update authcontext
        updateUser(data);
        setIsLoading(false);
      }

      // You can add your login logic here, such as making an API call to authenticate the user
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.error("Login failed:", error);
      }
    }
  };

  return (
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleLogin();
  }}
  className="flex flex-col items-center w-full md:p-4"
>
  <InputWithLabel
    required={true}
    onChange={(e) => setEmail(e.target.value)}
    label="Correo electrónico"
    name="email"
    type="email"
    placeholder="Correo electrónico"
  />
  <InputWithLabel
    required={true}
    label="Contraseña"
    onChange={(e) => setPassword(e.target.value)}
    name="password"
    type="password"
    placeholder="Contraseña"
  />
  <Link className="mb-4" href={"forgotpassword"}>
    ¿Olvidaste tu contraseña?
  </Link>
  <Button disabled={isLoading}>
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Iniciando Sesión...
      </>
    ) : (
      "Iniciar Sesión"
    )}
  </Button>
</form>

  );
};

export default LoginForm;
