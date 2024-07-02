import { Button } from "@/components/ui/button";
import { getPrescriptions } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { useAuthContext } from "../Hooks/useAuthContext";
import PrescriptionContainer from "../Components/PrescriptionContainer";

const Prescriptions = async () => {
  // url to API
  const url = process.env.NEXT_PUBLIC_URL;

  // const prescriptions: prescriptionType[] = await getPrescriptions(url!);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <div className="max-w-7xl p-6 mx-auto">
        <h1 className="text-center font-bold text-2xl">Recetas</h1>
        <div className="flex justify-center  my-4">
          <Link href="/prescriptions/add">
            <Button className="my-2">Agregar nueva receta médica</Button>
          </Link>
        </div>
          <PrescriptionContainer />
      </div>
    </div>
  );
};

export default Prescriptions;
