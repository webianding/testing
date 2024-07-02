import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPrescriptions = async (
  url: string,
  token: string | undefined
) => {
  const res = await fetch(`${url}/prescription`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const prescription = await res.json();
  if (!res.ok) {
    throw Error(prescription.error);
  }
  return prescription;
};

export function validateRUT(rut: string) {
  // Remove any non-numeric characters
  rut = rut.replace(/[^\dKk]/g, "");

  // console.log(rut);

  // Check if RUT has at least 2 characters (1 for digits, 1 for verification)
  if (rut.length < 2) return false;

  // Separate the digits from the verification
  const rutDigits = rut.slice(0, -1);
  const rutVerification = rut.slice(-1).toUpperCase();

  // Calculate the verification digit
  let sum = 0;
  let mul = 2;
  for (let i = rutDigits.length - 1; i >= 0; i--) {
    sum += parseInt(rutDigits.charAt(i)) * mul;
    mul = (mul + 1) % 8 || 2;
  }
  const mod = sum % 11;
  const calculatedVerification = mod === 0 ? 0 : 11 - mod;

  // Compare calculated verification with provided verification
  let isValid;
  if (calculatedVerification === 10) {
    isValid = rutVerification === "K";
  } else {
    isValid = rutVerification === calculatedVerification.toString();
  }

  return isValid;
}

export function comparePasswords(password: string, confirmPassword: string) {
  if (password === confirmPassword) {
    return true;
  } else {
    return false;
  }
}

export function calculateAgeFromDOB(dob: string): number {
  const dobDate = new Date(dob);
  const today = new Date();

  const dobYear = dobDate.getFullYear();
  const dobMonth = dobDate.getMonth();
  const dobDay = dobDate.getDate();

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  let age = todayYear - dobYear;

  // Check if birthday has occurred this year
  if (todayMonth < dobMonth || (todayMonth === dobMonth && todayDay < dobDay)) {
    age--;
  }

  return age;
}
// Convert format to YYYY-MM-DD for input value
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;

}
