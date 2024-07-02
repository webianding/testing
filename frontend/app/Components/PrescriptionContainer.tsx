"use client";

import { getPrescriptions } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../Hooks/useAuthContext";
import { redirect } from "next/navigation";

const PrescriptionContainer = () => {
  const { state, loadingUser } = useAuthContext();

  if (!state && !loadingUser) {
    redirect("/");
  }

  const url = process.env.NEXT_PUBLIC_URL;

  const [prescriptions, setPrescriptions] = useState<prescriptionType[] | null>(
    null
  );

  const getPres = async () => {
    try {
      if (!state) {
        return;
      }
      const res = await fetch(`${url}/prescription`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${state?.token}`,
        },
      });

      const prescription = await res.json();
      if (!res.ok) {
        throw Error(prescription.error);
      }
      setPrescriptions(prescription);
      return prescription;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPres();
  }, [state]);
  return (
    <div className="flex gap-4 justify-center w-full flex-wrap p-4">
      {!prescriptions?.length ? (
        <p className="text-center">
          No tienes recetas médicas. Por favor, añade una receta médica para comenzar.
        </p>
      ) : (
        prescriptions?.map((prescription) => {
          return (
            <Link
            key={prescription.id}
            href={`/prescriptions/${prescription.id}?medicationName=${prescription.medicationName}`}
          >
            <div className="w-80 hover:bg-slate-100 transition-all shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <p>
                <p className="text-xl">
                  <strong>Nombre del medicamento:</strong>{" "}
                  {prescription.medicationName}
                </p>
                <p>
                  <strong>Fecha de emisión:</strong>{" "}
                  {new Date(prescription.issueDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Fecha de caducidad:</strong>{" "}
                  {new Date(prescription.expiryDate).toLocaleDateString()}
                  <div className="h-1 bg-gray-200 my-2"></div>
                </p>
                <strong>Nombre:</strong>{" "}
                {`${prescription.user.firstName} ${prescription.user.lastName}`}
              </p>
          
              <div className="h-1 bg-gray-200 my-2"></div>
          
              <h3 className="mt-4">Información del médico</h3>
              <p>
                <strong>Nombre:</strong> {prescription.doctor?.name}
              </p>
          
              <p>
                <strong>Especialidad:</strong> {prescription.doctor?.specialty}
              </p>
            </div>
          </Link>
          
          );
        })
      )}
    </div>
  );
};

export default PrescriptionContainer;
