"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const QR = ({ params }: { params: { id: string } }) => {
  const url = process.env.NEXT_PUBLIC_URL;

  const [password, setPassword] = React.useState("");
  const [prescription, setPrescription] = useState<prescriptionType | null>(
    null
  );

  const [gettingPrescriptions, setGettingPrescriptions] = useState(false);

  const [loading, setLoading] = useState(false);

  // call to the backend to check if the qr password is correct

  const checkPassword = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${url}/user/profile/qr/${params.id.split("_")[3]}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            secured: params.id.split("_")[4],
          }),
        }
      );

      const data = await res.json();

      console.log({ data });
      if (!res.ok) {
        throw Error(data.error);
      }
      setLoading(false);
      toast.success("Authorized! Getting prescription...");

      // fetch prescription from the backend
      setGettingPrescriptions(true);
      const prescriptionRes = await fetch(
        `${url}/prescription/qr/${params.id.split("_")[0]}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${data.qrToken}`,
          },
        }
      );

      const prescriptionData = await prescriptionRes.json();
      setGettingPrescriptions(false);

      console.log(prescriptionData);

      if (!prescriptionRes.ok) {
        throw Error(prescriptionData.error);
      }

      setPrescription(prescriptionData);
    } catch (error) {
      setLoading(false);

      setGettingPrescriptions(false);
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const prescriptions = {
    id: 24,
    diagnosis: "Trastorno de ansiedad y síndrome de dolor crónico",
    medicationName: "Cannabis sativa spp",
    dailyQuantity: "3 gramos",
    numberOfDailyDoses: "",
    consumptionSchedule: "2 Times A day",
    administrationMethod: "",
    treatmentGoal: "",
    issueDate: "2024-03-28T00:00:00.000Z",
    expiryDate: "2024-03-28T00:00:00.000Z",
    userId: "a1676cab-51c0-465c-ba81-aa5df6ff079f",
    doctorRut: "12391279-9",
  };

  const {
    id,
    diagnosis,
    medicationName,
    dailyQuantity,
    numberOfDailyDoses,
    consumptionSchedule,
    administrationMethod,
    treatmentGoal,
    issueDate,
    expiryDate,
    userId,
    doctorRut,
  } = prescriptions;
  return (
    <div className="max-w-7xl mx-auto p-6">
    <p>
      {gettingPrescriptions ? (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          Obteniendo receta
        </>
      ) : (
        ""
      )}
    </p>
    {prescription ? (
      <>
        {/* <div>{JSON.stringify(prescription)}</div> */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {prescription?.medicationName}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Nombre del paciente:</p>
              <p className="font-semibold">
                {prescription?.user?.firstName} {prescription?.user?.lastName}
              </p>
            </div>
            {/* <div>
              <p className="text-gray-600">ID:</p>
              <p className="font-semibold">{prescription?.id}</p>
            </div> */}
            <div>
              <p className="text-gray-600">Medicamento:</p>
              <p className="font-semibold">{prescription?.medicationName}</p>
            </div>
            <div>
              <p className="text-gray-600">Cantidad diaria:</p>
              <p className="font-semibold">{prescription?.dailyQuantity}</p>
            </div>
            <div>
              <p className="text-gray-600">Número de dosis diarias:</p>
              <p className="font-semibold">
                {prescription?.numberOfDailyDoses}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Horario de consumo:</p>
              <p className="font-semibold">
                {prescription?.consumptionSchedule}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Método de administración:</p>
              <p className="font-semibold">
                {prescription?.administrationMethod}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Objetivo del tratamiento:</p>
              <p className="font-semibold">{prescription?.treatmentGoal}</p>
            </div>
            <div>
              <p className="text-gray-600">Fecha de emisión:</p>
              <p className="font-semibold">
                {prescription
                  ? new Date(prescription.issueDate).toLocaleDateString()
                  : ""}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Fecha de vencimiento:</p>
              <p className="font-semibold">
                {prescription
                  ? new Date(prescription.expiryDate).toLocaleDateString()
                  : ""}
              </p>
            </div>
            {/* <div>
              <p className="text-gray-600">ID del usuario:</p>
              <p className="font-semibold">{prescription?.user?.id}</p>
            </div> */}
            {/* 
            <div>
              <p className="text-gray-600">ID del médico:</p>
              <p className="font-semibold">{prescription?.doctor?.id}</p>
            </div> */}
            <div>
              <p className="text-gray-600">Nombre del médico:</p>
              <p className="font-semibold">{prescription?.doctor?.name}</p>
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="max-w-7xl mx-auto p-6">
        {/* QR - {params.id} */}
        {params.id.split("_")[4] === "false" ? (
          <></>
        ) : (
          <p>
            Por favor, ingrese la contraseña para ver la receta de{" "}
            <span className="font-bold">
              {params.id.split("_")[1]} {params.id.split("_")[2]}
            </span>
          </p>
        )}
        <p>
          {/* Nombre- {params.id.split("_")[1]} {params.id.split("_")[2]} */}
        </p>
        <div className="w-full mx-auto mt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              checkPassword();
            }}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            {params.id.split("_")[4] !== "false" ? (
              <></>
            ) : (
              <p className="mb-2">
                Haga clic para ver la receta de{" "}
                <span className="font-bold">
                  {params.id.split("_")[1]} {params.id.split("_")[2]}
                </span>
              </p>
            )}
            {params.id.split("_")[4] === "false" ? (
              <></>
            ) : (
              <div className="mb-4">
                <Label
                  // className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Contraseña
                </Label>
                <Input
                  // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={params.id.split("_")[4] === "true"}
                />
              </div>
            )}
            {/* {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>} */}
            <div className="flex items-center justify-between">
              <Button disabled={loading} className="" type="submit">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : params.id.split("_")[4] === "false" ? (
                  "Ver"
                ) : (
                  "Enviar"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default QR;
