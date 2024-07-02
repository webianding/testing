"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { comparePasswords, getPrescriptions } from "@/lib/utils";
import { useAuthContext } from "@/app/Hooks/useAuthContext";
import { toast } from "react-toastify";
import { ConfirmDelete } from "@/app/Components/ConfirmDelete";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { usePDF } from "react-to-pdf";

const Component = () => {
  return (
    <div>
      <button>Download PDF</button>
      <div>Content to be generated to PDF</div>
    </div>
  );
};

const Details = ({ params }: { params: { id: string } }) => {
  const { state, loadingUser, updateUser } = useAuthContext();

  const { toPDF, targetRef } = usePDF({
    filename: `${params.id} prescription.pdf`,
  });

  const router = useRouter();
  const [prescription, setPrescription] =
    React.useState<prescriptionType | null>(null);

  // deleting state
  const [deleting, setDeleting] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // url to API
  const url = process.env.NEXT_PUBLIC_URL;

  const fetchPrescriptions = async (url: string) => {
    const res = await fetch(`${url}/prescription/p/${params.id}`);
    const prescription = await res.json();
    // const prescriptions: prescriptionType[] = await getPrescriptions(url!);
    console.log({ hii: prescription });
    setPrescription(prescription);
  };

  const searchParams = useSearchParams();

  const medicationName = searchParams.get("medicationName");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const validity = searchParams.get("validity");

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const imageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.recetalegal.cl/qr/${params.id}_${state?.user.firstName}_${state?.user.lastName}_${state?.user.id}_${state?.user.qrPasswordSet}`;

  const handleDownload = async ({
    imageUrl,
    imageName,
  }: {
    imageUrl: string;
    imageName: string;
  }) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const deletePrescription = async (id: number) => {
    try {
      setDeleting(true);
      const res = await fetch(`${url}/prescription/p/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      setDeleting(false);

      if (!res.ok) {
        throw Error(data.error);
      }
      toast.success("Deleted successful!");
      router.push("/prescriptions", { scroll: false });
    } catch (error) {
      setDeleting(false);
      if (error instanceof Error) toast.error("Failed to delete prescription!");
    }
  };

  const setQrCodePassWord = async (password: string | null) => {
    try {
      if (!state) {
        return;
      }
      if (password) {
        const isPasswordSimilar = comparePasswords(password, confirmPassword);
        if (!isPasswordSimilar) {
          throw Error("Passwords do not match");
        }
      }

      setIsUpdatingPassword(true);

      const res = await fetch(`${url}/user/profile/qr`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ qrPassword: password }),
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        throw Error(data.error);
      }

      const localUserState = await localStorage.getItem("user");
      if (localUserState) {
        const localUserStateObject = JSON.parse(localUserState);
        const { user, ...localUserStateObjectWithoutUser } =
          localUserStateObject;
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...localUserStateObjectWithoutUser,
            user: { ...data.user },
          })
        );

        //getnew state from localStorage
        const userFromLocalStorage = localStorage.getItem("user");
        if (userFromLocalStorage) {
          updateUser(JSON.parse(userFromLocalStorage));
          console.log({ stateAfter: JSON.parse(userFromLocalStorage) });
        }

        toast.success("QR password set successfully!");
        setIsChecked(false);
        setIsUpdatingPassword(false);
      } else {
        throw Error("There was a problem setting the QR Code password");
      }
    } catch (error) {
      setIsUpdatingPassword(false);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (state) fetchPrescriptions(url!);
    if (!state && !loadingUser) {
      redirect("/");
    }
  }, [state]);

  return (
    <div ref={targetRef}>
      <h1 className="text-xl font-bold text-center my-2">{medicationName}</h1>
      <div className="flex justify-center gap-4 ">
        <Link href={`/prescriptions/${params.id}/edit`}>
          <Button>Actualizar Receta</Button>
        </Link>
        <Button
          onClick={() => {
            window.print();
            // toPDF()
          }}
        >
          Descargar PDF
        </Button>
      </div>

      <div className="max-w-7xl md:p-6 p-4 mx-auto flex gap-4 flex-col md:flex-row items-center">
        <div></div>
        <div className="md:flex-1 w-full bg-gray-100 rounded p-4">
          <p>
            <strong>Nombre del medicamento:</strong>{" "}
            {prescription?.medicationName}
          </p>
          <p>
            <strong>Diagnóstico:</strong> {prescription?.diagnosis}
          </p>

          <p>
            <strong>Cantidad diaria:</strong> {prescription?.dailyQuantity}
          </p>
          <p>
            <strong>Número de dosis diarias:</strong>{" "}
            {prescription?.numberOfDailyDoses}
          </p>
          <p>
            <strong>Programa de consumo:</strong>{" "}
            {prescription?.consumptionSchedule}
          </p>
          <p>
            <strong>Método de administración:</strong>{" "}
            {prescription?.administrationMethod}
          </p>
          <p>
            <strong>Objetivo del tratamiento:</strong>{" "}
            {prescription?.treatmentGoal}
          </p>
          <p>
            <strong>Fecha de emisión:</strong>{" "}
            {prescription
              ? new Date(prescription.issueDate).toLocaleDateString()
              : null}
          </p>
          <p>
            <strong>Fecha de caducidad:</strong>{" "}
            {prescription
              ? new Date(prescription.expiryDate).toLocaleDateString()
              : null}
          </p>
          <div className="bg-gray-200 w-full rounded-full h-1 mt-4"></div>
          <h3 className="mt-4 font-bold text-xl">Información del usuario</h3>
          <p>
            <strong>Correo electrónico:</strong> {prescription?.user?.email}
          </p>
          <p>
            <strong>Nombre:</strong>{" "}
            {prescription?.user
              ? `${prescription.user.firstName} ${prescription.user.lastName}`
              : null}
          </p>
          <div className="bg-gray-200 w-full rounded-full h-1 mt-4"></div>

          <h3 className="mt-4 font-bold text-xl">Información del médico</h3>
          <p>
            <strong>Nombre:</strong> {prescription?.doctor?.name}
          </p>
          <p>
            <strong>RUT:</strong> {prescription?.doctor?.rut}
          </p>
          <p>
            <strong>Número de registro médico:</strong>{" "}
            {prescription?.doctor?.medicalRegistryNumber}
          </p>
          <p>
            <strong>Especialidad:</strong> {prescription?.doctor?.specialty}
          </p>
          <p>
            <strong>Teléfono:</strong> {prescription?.doctor?.phone}
          </p>
          <p>
            <strong>Dirección:</strong> {prescription?.doctor?.address}
          </p>
          <p>
            <strong>Comuna:</strong> {prescription?.doctor?.commune}
          </p>
          <p>
            <strong>Ciudad:</strong> {prescription?.doctor?.city}
          </p>
        </div>

        <div className="md:flex-1 flex flex-col items-center">
          <div className="flex flex-col items-center gap-2">
            {!state?.user.qrPasswordSet && (
              <p className="text-red-500">
                Tu código QR no está seguro y puede ser accedido por cualquier
                persona que pueda escanearlo.
              </p>
            )}

            <Button
              variant={`${
                state?.user.qrPasswordSet ? "destructive" : "default"
              }`}
              disabled={isChecked}
              className="my-4"
              onClick={() => {
                if (!state?.user.qrPasswordSet) {
                  setIsChecked(true);
                } else {
                  // setIsChecked(!isChecked);
                  setQrCodePassWord(null);
                  // alert("unchecked");
                }
              }}
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : state?.user.qrPasswordSet ? (
                "¿Eliminar contraseña del código QR?"
              ) : (
                "Establecer contraseña del código QR"
              )}
            </Button>
          </div>
          {!state?.user.qrPasswordSet && isChecked ? (
            <div className="border  flex flex-col items-center my-4 p-4 rounded-lg">
              <Image
                placeholder="blur"
                src="/receta-legal-logo-light.jpg"
                width={250}
                height={250}
                alt={params.id}
                blurDataURL="/receta-legal-logo-light.jpg"
              />
              <p className="font-bold text-red-500">Código QR no asegurado</p>
              <p>Establece una contraseña para asegurar el código QR</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setQrCodePassWord(password);
                }}
                className="my-2"
              >
                <Label className="font-bold">Ingresa la contraseña:</Label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Ingresa la contraseña del código QR"
                />
                <Label className="font-bold mt-4">
                  Confirma la contraseña:
                </Label>
                <Input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Confirma la contraseña del código QR"
                />

                <Button className="my-4">
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    "Establecer contraseña del código QR"
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <>
              {state?.user.qrPasswordSet && (
                <p className="text-center text-green-500 my-4">
                  El código QR está protegido con contraseña
                </p>
              )}
              <Image
                placeholder="blur"
                blurDataURL="/receta-legal-logo-light.jpg"
                width={250}
                height={250}
                alt={params.id}
                src={imageSrc}
              />
              <Button
                className="my-4"
                onClick={() =>
                  handleDownload({
                    imageUrl: imageSrc,
                    imageName: `Código_QR_para_${name}_receta`,
                  })
                }
              >
                Descargar código QR
              </Button>
            </>
          )}

          {/* <Button
          onClick={() =>
            deletePrescription(prescription?.id ? prescription.id : 0)
          }
          variant={"destructive"}
          className=""
        >
          Eliminar Receta
        </Button> */}
          <ConfirmDelete
            deleting={deleting}
            id={prescription?.id}
            deletePrescription={deletePrescription}
          />
        </div>
      </div>
    </div>
  );
};

export default Details;
