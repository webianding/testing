"use client";

import { Button } from "@/components/ui/button";
import { comparePasswords, validateRUT } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { InputWithLabel } from "../Components/InputComponent";
import { useAuthContext } from "../Hooks/useAuthContext";

const SignUpForm = () => {
  // api url
  const url = process.env.NEXT_PUBLIC_URL;

  const { updateUser, state } = useAuthContext();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [passwordStrength, setStrength] = useState("");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [rut, setRUT] = React.useState("");

  // check if is strong password
  const checkPasswordStrength = (password: string) => {
    // Regular expressions to check for various password criteria
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Checking length and other conditions to determine strength
    if (
      password.length >= 8 &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    ) {
      setStrength("Strong");
    } else if (
      password.length >= 6 &&
      (hasUpperCase || hasLowerCase) &&
      hasNumber
    ) {
      setStrength("Moderate");
    } else {
      setStrength(
        "Weak. Use at least 8 characters including uppercase, lowercase, number and special character."
      );
    }
  };

  // // function to register new users
  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      setError("");
      if (!validateRUT(rut)) {
        throw Error("Please enter a valid RUT no");
      }
      if (!comparePasswords(password, confirmPassword)) {
        throw Error("Passwords do not match");
      }

      // attempt to sign up user through api call
      const res = await fetch(`${url}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          rut,
          password,
        }),
      });

      const user = await res.json();
      if (!res.ok) {
        setIsLoading(false);

        throw Error(user.error);
      }

      toast.success("Signed Up Successful!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // update authcontext

      updateUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (error instanceof Error)
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
    }
  };

  useEffect(() => {
    if (state) {
      redirect("/");
    }
  }, [state]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSignUp();
      }}
      className="flex flex-col items-center w-full md:p-4"
    >
      <InputWithLabel
        required={true}
        onChange={(e) => setFirstName(e.target.value)}
        label="Nombre"
        name="firstname"
        type="text"
        placeholder="Nombre"
      />
      <InputWithLabel
        required={true}
        onChange={(e) => setLastName(e.target.value)}
        label="Apellido"
        name="lastname"
        type="text"
        placeholder="Apellido"
      />
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
        onChange={(e) => setRUT(e.target.value)}
        label="RUT"
        name="rut"
        type="text"
        placeholder="RUT"
      />
      <InputWithLabel
        passwordStrength={passwordStrength}
        required={true}
        onChange={(e) => {
          checkPasswordStrength(e.target.value);
          setPassword(e.target.value);
        }}
        label="Contraseña"
        name="password"
        type="password"
        placeholder="Escriba su contraseña"
      />
      {passwordStrength && (
        <p
          className={`${
            passwordStrength ===
            "Débil. Use al menos 8 caracteres incluyendo mayúsculas, minúsculas, números y caracteres especiales."
              ? "text-red-500"
              : passwordStrength === "Moderada"
              ? "text-orange-500"
              : passwordStrength === "Fuerte"
              ? "text-green-500"
              : ""
          }`}
        >
          La contraseña es {passwordStrength}
        </p>
      )}
      <InputWithLabel
        required={true}
        onChange={(e) => setConfirmPassword(e.target.value)}
        label="Confirmar Contraseña"
        name="password"
        type="password"
        placeholder="Confirme su contraseña"
      />
      <Button disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          "Registrarse"
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
