"use client";

import { Button } from "@/components/ui/button";
import { comparePasswords } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { InputWithLabel } from "./InputComponent";

const PasswordRecovery = ({
  token,
  email,
}: {
  token: string;
  email: string;
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;

  const handleSubmit = async () => {
    // Perform validation
    // if (!email || !password || !confirmPassword) {
    //   setError("Please fill in all fields");
    //   return;
    // }
    // if (password !== confirmPassword) {
    //   setError("Passwords do not match");
    //   return;
    // }
    // Submit the form
    // You can add your own logic to handle password recovery here

    // Clear the form fields

    try {
      setLoading(true);

      const isPasswordMatch = comparePasswords(password, confirmPassword);
      if (!isPasswordMatch) {
        throw Error("Passwords do not match");
      }
      const res = await fetch(`${url}/user/profile/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (!res.ok) {
        throw Error(data.error);
      }
      toast.success("Password reset successful. Please Log in");

      router.push("/login", { scroll: false });
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperación de Contraseña
          </h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <InputWithLabel
                label="Correo Electrónico"
                name="email"
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                disabled
              />
            </div>
            <div>
              <InputWithLabel
                onChange={(e) => setPassword(e.target.value)}
                label="Nueva Contraseña"
                name="new password"
                type="password"
                placeholder="Nueva Contraseña"
              />
            </div>
            <div>
              <InputWithLabel
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="Confirmar Nueva Contraseña"
                name="confirm password"
                type="password"
                placeholder="Confirmar nueva contraseña"
              />
            </div>
          </div>

          <Button>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default PasswordRecovery;
