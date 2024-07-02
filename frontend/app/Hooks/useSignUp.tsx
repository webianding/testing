import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { ToastContainer, toast } from "react-toastify";

export const useSignup = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const url = process.env.NEXT_PUBLIC_URL;
  const { updateUser } = useAuthContext();

  const signUp = async (
    firstName: string,
    lastName: string,
    rut: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${url}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, lastName, firstName, rut }),
      });

      const res = await response.json();

      if (!response.ok) {
        console.log(res);
        setIsLoading(false);
        setError(res.error);
      
      } else {
        toast.success("Signed In Successful!", {
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
        updateUser(res);
        setIsLoading(false);
        console.log(res);
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        setError(error.message);
        console.log(error);
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
    }
  };

  return { signUp, error, isLoading };
};
