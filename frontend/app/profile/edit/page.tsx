"use client";

import { useAuthContext } from "@/app/Hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate, validateRUT } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  rut: string;
  phone: string;
  address: string;
  commune: string;
  city: string;
  dateOfBirth: string;
  age: string;
}

function UserProfile() {

  const router = useRouter()

  const { state, loadingUser } = useAuthContext();
  const [formData, setFormData] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    rut: "",
    phone: "",
    address: "",
    commune: "",
    city: "",
    dateOfBirth: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);

  if (!state && !loadingUser) {
    redirect("/");
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission here
    // Update user profile with formData
  };

  const url: string | undefined = process.env.NEXT_PUBLIC_URL;
  const id: string = "eb0effab-9d3c-4c6f-8214-a5b24c19c2fd";

  const [profile, setProfile] = useState<UserProfile | null>(null);

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
      setFormData(profileData);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  // update profile function
  const updateProfile = async () => {
    console.log(formData);
    try {
      if (!state || !url) {
        return;
      }
      setLoading(true);
      if (!validateRUT(formData.rut)) {
        throw Error("Enter a valid RUT no");
      }
      const res = await fetch(`${url}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ updateProfile: formData }),
      });
      setLoading(false);

      const data = await res.json();
      if (!res.ok) {
        throw Error(data.error);
      }
      toast.success("Profile updated successfully");
      router.push("/profile", {scroll: false})
    } catch (error) {
      console.log(error);
      setLoading(false);

      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, [state, url]);

  return (
    <div className="max-w-7xl p-6 mx-auto">
    <h1 className="text-center text-2xl font-bold my-4">Editar Perfil</h1>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateProfile();
      }}
    >
      <div className="md:grid md:grid-cols-2 flex flex-col gap-4">
        <div>
          <Label htmlFor="firstName">Nombre:</Label>
          <Input
            value={formData.firstName}
            type="text"
            id="firstName"
            name="firstName"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Apellido:</Label>
          <Input
            value={formData.lastName}
            type="text"
            id="lastName"
            name="lastName"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Correo electrónico:</Label>
          <Input
            disabled={true}
            value={formData.email}
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
          />
        </div>
  
        <div>
          <Label htmlFor="rut">RUT:</Label>
          <Input
            value={formData.rut}
            type="text"
            id="rut"
            name="rut"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono:</Label>
          <Input
            value={formData.phone}
            type="text"
            id="phone"
            name="phone"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="address">Dirección:</Label>
          <Input
            value={formData.address}
            type="text"
            id="address"
            name="address"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="commune">Comuna:</Label>
          <Input
            value={formData.commune}
            type="text"
            id="commune"
            name="commune"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="city">Ciudad:</Label>
          <Input
            value={formData.city}
            type="text"
            id="city"
            name="city"
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Fecha de Nacimiento:</Label>
          <Input
            // value={formData.dateOfBirth}
            value={
              formData.dateOfBirth ? formatDate(formData.dateOfBirth) : ""
            }
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            onChange={handleChange}
          />
        </div>
      </div>
      <Button disabled={loading} type="submit" className="mt-4 ">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Actualizando...
          </>
        ) : (
          "Enviar"
        )}
      </Button>
    </form>
  </div>
  
  );
}

export default UserProfile;
