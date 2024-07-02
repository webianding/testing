"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useAuthContext } from "../Hooks/useAuthContext";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { validateRUT } from "@/lib/utils";
import { useRouter } from 'next/navigation'


function PrescriptionForm() {
  const { state, loadingUser } = useAuthContext();
  if (!state && !loadingUser) {
    redirect("/");
  }

  const router = useRouter()


  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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
      setLoading(true);
      const res = await fetch(`${url}/prescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state?.token}`,
        },
        body: JSON.stringify(formData),
      });
      const newPrescription = await res.json();
      setLoading(false);
      if (!res.ok) {
        throw Error(newPrescription.error);
      }
      toast.success("Prescription added", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push('/prescriptions', { scroll: false })

      setFormData({
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
      }
    }
  };

  return (
    <div className="mx-auto">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="md:grid md:grid-cols-2 flex flex-col gap-4">
        {/* <div>
          <Label htmlFor="userId">ID de Usuario:</Label>
          <Input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
          />
        </div> */}
        <div>
          <Label htmlFor="doctorRut">RUT del Médico:</Label>
          <Input
            required={true}
            type="text"
            id="doctorRut"
            name="doctorRut"
            value={formData.doctorRut}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="diagnosis">Diagnóstico:</Label>
          <Input
            type="text"
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="medicationName">Nombre del Medicamento:</Label>
          <Input
            type="text"
            id="medicationName"
            name="medicationName"
            value={formData.medicationName}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="dailyQuantity">Cantidad Diaria:</Label>
          <Input
            type="text"
            id="dailyQuantity"
            name="dailyQuantity"
            value={formData.dailyQuantity}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="numberOfDailyDoses">Número de Dosis Diarias:</Label>
          <Input
            type="text"
            id="numberOfDailyDoses"
            name="numberOfDailyDoses"
            value={formData.numberOfDailyDoses}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="consumptionSchedule">Horario de Consumo:</Label>
          <Input
            type="text"
            id="consumptionSchedule"
            name="consumptionSchedule"
            value={formData.consumptionSchedule}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="administrationMethod">Método de Administración:</Label>
          <Input
            type="text"
            id="administrationMethod"
            name="administrationMethod"
            value={formData.administrationMethod}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="treatmentGoal">Objetivo del Tratamiento:</Label>
          <Input
            type="text"
            id="treatmentGoal"
            name="treatmentGoal"
            value={formData.treatmentGoal}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="issueDate">Fecha de Emisión:</Label>
          <Input
            type="date"
            id="issueDate"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="expiryDate">Fecha de Vencimiento:</Label>
          <Input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
          />
        </div>
      </div>
      <Button className="mt-4" disabled={loading}>
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
  
  );
}

export default PrescriptionForm;
