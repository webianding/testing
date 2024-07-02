import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

const PresForm = ({
  handleSubmit,
  handleChange,
  formData,
  loading,
  disableDoctorRut,
}: {
  handleSubmit: () => void;
  handleChange?: (e: any) => void;
  formData: {
    userId: string;
    doctorRut: string;
    diagnosis: string;
    medicationName: string;
    dailyQuantity: string;
    numberOfDailyDoses: string;
    consumptionSchedule: string;
    administrationMethod: string;
    treatmentGoal: string;
    issueDate: string;
    expiryDate: string;
  };
  loading: boolean;
  disableDoctorRut: boolean;
}) => {
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="md:grid md:grid-cols-2 flex flex-col gap-4">
          {/* <div>
      <Label htmlFor="userId">ID de usuario:</Label>
      <Input
        type="text"
        id="userId"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
      />
    </div> */}
          <div>
            <Label htmlFor="doctorRut">RUT del médico:</Label>
            <Input
              disabled={disableDoctorRut}
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
            <Label htmlFor="medicationName">Nombre del medicamento:</Label>
            <Input
              type="text"
              id="medicationName"
              name="medicationName"
              value={formData.medicationName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="dailyQuantity">Cantidad diaria:</Label>
            <Input
              type="text"
              id="dailyQuantity"
              name="dailyQuantity"
              value={formData.dailyQuantity}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="numberOfDailyDoses">Número de dosis diarias:</Label>
            <Input
              type="text"
              id="numberOfDailyDoses"
              name="numberOfDailyDoses"
              value={formData.numberOfDailyDoses}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="consumptionSchedule">Programa de consumo:</Label>
            <Input
              type="text"
              id="consumptionSchedule"
              name="consumptionSchedule"
              value={formData.consumptionSchedule}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="administrationMethod">
              Método de administración:
            </Label>
            <Input
              type="text"
              id="administrationMethod"
              name="administrationMethod"
              value={formData.administrationMethod}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="treatmentGoal">Objetivo del tratamiento:</Label>
            <Input
              type="text"
              id="treatmentGoal"
              name="treatmentGoal"
              value={formData.treatmentGoal}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="issueDate">Fecha de emisión:</Label>
            <Input
              type="date"
              id="issueDate"
              name="issueDate"
              value={formData.issueDate ? formatDate(formData.issueDate) : ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="expiryDate">Fecha de caducidad:</Label>
            <Input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate ? formatDate(formData.expiryDate) : ""}
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
};

export default PresForm;
