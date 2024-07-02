"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthContext } from "../Hooks/useAuthContext";
import { redirect } from "next/navigation";
import { calculateAgeFromDOB, formatDate } from "@/lib/utils";

const Profile = () => {
  const { state, loadingUser } = useAuthContext();
  const url: string | undefined = process.env.NEXT_PUBLIC_URL;

  if (!state && !loadingUser) {
    redirect("/");
  }
  // Assuming user is already authenticated

  const [user, setUser] = useState<UserProfile | null>(null);

  const getProfile = async () => {
    try {
      if (!state || !url) {
        return;
      }
      const res = await fetch(`${url}/user/profile/`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const profileData = await res.json();
      if (!res.ok) {
        throw new Error(profileData.error);
      }
      console.log(profileData);
      setUser(profileData);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, [state, url]);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6">
  <h1 className="text-center text-2xl font-bold my-4">Perfil</h1>
  {loadingUser ? (
    "Cargando"
  ) : (
    <>
      <div className="flex justify-center my-4">
        <Link href="/profile/edit">
          <Button>Editar Perfil</Button>
        </Link>
      </div>
      <div>
        <div className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="p-8">
              <p className="mt-2 text-gray-600">
                <span className="font-bold">Nombre:</span> {user?.firstName}
              </p>
              <p className="mt-2 text-gray-600">
                <span className="font-bold">Apellido:</span> {user?.lastName}
              </p>
              <p className="mt-2 text-gray-600">
                <span className="font-bold">Correo electrónico:</span>{" "}
                {user?.email}
              </p>
              <p className="mt-2 text-gray-600">
                <span className="font-bold">Fecha de nacimiento:</span>{" "}
                {user?.dateOfBirth ? formatDate(user?.dateOfBirth) : ""}
              </p>
              <p className="mt-2 text-gray-600">
                <span className="font-bold">Edad:</span>{" "}
                {calculateAgeFromDOB(
                  user?.dateOfBirth
                    ? user.dateOfBirth
                    : new Date().toISOString()
                )}{" "}
                años
              </p>
              <p className="mt-2 text-gray-600">
                <span className="font-bold">RUT:</span> {user?.rut}
              </p>
              <p className="mt-2 text-gray-600">
                <span className="font-bold">Teléfono:</span> {user?.phone}
              </p>
              <p className="mt-2 text-gray-600">
                <span className="font-bold">Dirección:</span> {user?.address}
              </p>
              <p className="mt-2 text-gray-600">
                <span className="font-bold">Comuna:</span> {user?.commune}
              </p>
              <p className="mt-2 text-gray-600">
                <span className="font-bold">Ciudad:</span> {user?.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )}
</div>

    </div>
  );
};

export default Profile;
