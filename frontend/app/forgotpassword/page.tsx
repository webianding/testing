"use client";

import React, { useState } from "react";
import { InputWithLabel } from "../Components/InputComponent";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Loader2, Loader2Icon } from "lucide-react";

const ForgotPassword = () => {
  const url = process.env.NEXT_PUBLIC_URL;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPasswordResetRequest = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${url}/user/profile/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log(data);
      setLoading(false);


      if (!res.ok) {
        throw Error(data.error);
      }
      toast.success("An email with the reset link was sent to your email")
    } catch (error) {
      setLoading(false);

      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
<div>
  <h1 className="text-center font-bold text-lg my-4">Restablecer Contraseña</h1>
  <div className="max-w-7xl mx-auto p-6 flex justify-center">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendPasswordResetRequest();
      }}
      className="max-w-7xl mx-auto p-"
    >
      Ingresa el correo electrónico para restablecer la contraseña
      <InputWithLabel
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        label="Correo Electrónico"
        name="email"
        required
        placeholder="Ingresa Correo Electrónico"
      />
      <Button>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            Enviando...
          </>
        ) : (
          "Enviar"
        )}
      </Button>
    </form>
  </div>
</div>

  );
};

export default ForgotPassword;
