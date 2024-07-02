import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET;
const QR_TOKEN = process.env.QRSECRET;

export const generateJwtToken = (payload: any) => {
  const token = jwt.sign(payload, JWT_SECRET!, {
    expiresIn: "3d",
  });
  return token;
};


export const generateQRJwtToken = (payload: any) => {
  const token = jwt.sign(payload, QR_TOKEN!, {
    expiresIn: "20s",
  });
  return token;
};



export function convertToISODate(dateString: string): string {
  const dateParts = dateString.split('-');
  if (dateParts.length !== 3) {
      throw new Error('Invalid date format. Please provide date in YYYY-MM-DD format.');
  }
  
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]);
  const day = parseInt(dateParts[2]);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error('Invalid date format. Please provide date in YYYY-MM-DD format.');
  }

  const isoDate = new Date(year, month - 1, day).toISOString();
  return isoDate;
}


// this function validates if RUT no provided is valid

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
