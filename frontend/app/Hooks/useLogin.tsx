import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useAuthContext();

  const url = process.env.NEXT_PUBLIC_URL;


  const logIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response =await fetch(`${url}/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(res.error);
      }
      if (response.ok) {
        // save user to local storage
        localStorage.setItem("user", JSON.stringify(res));

        // update authcontext
        updateUser(res);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  return { logIn, error, isLoading };
};
