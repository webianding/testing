import PrescriptionForm from "@/app/Components/PrescriptionForm";
import React from "react";

const AddPrescription = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-center font-bold text-2xl mt-2 mb-4">
      Añadir Nueva Receta
      </h1>
      <PrescriptionForm />
    </div>
  );
};

export default AddPrescription;
