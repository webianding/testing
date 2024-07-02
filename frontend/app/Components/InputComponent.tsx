import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputWithLabel({
  label,
  name,
  type,
  placeholder,
  onChange,
  required,
  value,
  disabled,
  passwordStrength,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  passwordStrength?: string;
}) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
      <Label htmlFor="email">{label}</Label>
      <Input
        className={`${
          passwordStrength === "Weak. Use at least 8 characters including uppercase, lowercase, number and special character."
            ? "border-red-500"
            : passwordStrength === "Moderate"
            ? "border-orange-500"
            : passwordStrength === "Strong"
            ? "border-green-500"
            : ""
        }`}
        required={required}
        onChange={onChange}
        type={type}
        id={type}
        placeholder={placeholder}
        name={name}
        value={value}
        disabled={disabled}
      />
    </div>
  );
}
