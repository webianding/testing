"use client";

import PresForm from "@/app/Components/PresForm";
import PrescriptionForm from "@/app/Components/PrescriptionForm";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { useAuthContext } from "@/app/Hooks/useAuthContext";
import { validateRUT } from "@/lib/utils";

const EditPrescription = ({ params }: { params: { id: string } }) => {
  const { state, loadingUser } = useAuthContext();
  if (!state && !loadingUser) {
    redirect("/");
  }

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    userId: "",
    doctorRut: "",
    diagnosis: "",
    medicationName: "",
    dailyQuantity: "",
    numberOfDailyDoses: "",
    consumptionSchedule: "",
    administrationMethod: "",
    treatmentGoal: "",
    issueDate: "",
    expiryDate: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const url = process.env.NEXT_PUBLIC_URL;

  const handleSubmit = async () => {
    // Handle form submission here
    console.log(formData);

    try {
      const isValidRUT = validateRUT(formData.doctorRut);
      if (!isValidRUT) {
        throw Error("Please enter a valid Doctor's RUT");
      }
      const { id, userId, ...formDataWithoutId } = formData;

      setLoading(true);
      const res = await fetch(`${url}/prescription/p/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state?.token}`,
        },

        body: JSON.stringify({ prescription: formDataWithoutId }),
      });
      const newPrescription = await res.json();
      console.log(newPrescription);
      setLoading(false);
      if (!res.ok) {
        throw Error(newPrescription.error);
      }
      toast.success("Updated prescription succesfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push(`/prescriptions/${params.id}`, { scroll: false });

      setFormData({
        id: "",
        userId: "",
        doctorRut: "",
        diagnosis: "",
        medicationName: "",
        dailyQuantity: "",
        numberOfDailyDoses: "",
        consumptionSchedule: "",
        administrationMethod: "",
        treatmentGoal: "",
        issueDate: "",
        expiryDate: "",
      });
      console.log(newPrescription);
    } catch (error) {
      setLoading(false);

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
        console.log(error.message);
        console.log(error);
      }
    }
  };

  const fetchPrescriptions = async (url: string) => {
    const res = await fetch(`${url}/prescription/p/${params.id}`);
    const prescription = await res.json();
    // const prescriptions: prescriptionType[] = await getPrescriptions(url!);
    const { user, doctor, ...newPres } = prescription;
    console.log({ hii: newPres });
    setFormData(newPres);
  };

  useEffect(() => {
    if (state) fetchPrescriptions(url!);
    if (!state && !loadingUser) {
      redirect("/");
    }
  }, [state]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-xl font-bold text-center my-2">
      Actualizar Receta
      </h1>
      <PresForm
        disableDoctorRut={true}
        handleSubmit={handleSubmit}
        loading={loading}
        handleChange={handleChange}
        formData={formData}
      />
    </div>
  );
};

export default EditPrescription;
