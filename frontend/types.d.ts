const prescription = [
  {
    id: 1,
    diagnosis: "Trastorno de ansiedad y síndrome de dolor crónico",
    medicationName: "Cannabis sativa spp.",
    dailyQuantity: "3 gramos",
    numberOfDailyDoses: "6 dosis completas",
    consumptionSchedule: "Exclusivamente después del trabajo",
    administrationMethod: "Vaporización por inhalación no pirolítica",
    treatmentGoal:
      "Efecto analgésico y ansiolítico para trastorno de ansiedad y síndrome de dolor crónico deportivo",
    issueDate: "2024-03-09T21:00:00.000Z",
    expiryDate: "2024-04-09T21:00:00.000Z",
    userId: "eb0effab-9d3c-4c6f-8214-a5b24c19c2fd",
    doctorId: 1,
    user: {
      email: "copfogo@gmail.com",
      firstName: "Intro",
      lastName: "Dueces",
      id: "eb0effab-9d3c-4c6f-8214-a5b24c19c2fd",
    },
    doctor: {
      id: 1,
      name: "Dr. Roberto Fernández",
      rut: "21.987.654-3",
      medicalRegistryNumber: "123456",
      specialty: "Cardiólogo",
      phone: "+56912345678",
      address: "Avenida Real 456",
      commune: "Las Condes",
      city: "Santiago de Chile",
    },
  },
];

const user = {
  id: "eb0effab-9d3c-4c6f-8214-a5b24c19c2fd",
  firstName: "Intro",
  lastName: "Dueces",
  email: "copfogo@gmail.com",
  password: "$2b$10$KoAQSPs8Dq/RRjtKJTLFR.v/m84072W/iPW7FMxV24fvMV5JPpECi",
  createdAt: "2024-03-11T08:37:23.535Z",
  updatedAt: "2024-03-11T08:37:23.535Z",
  rut: null,
  phone: null,
  address: null,
  commune: null,
  city: null,
  dateOfBirth: null,
  age: null,
  qrPassword: null,
  qrPasswordSet: false,
};

type UserProfile = typeof user;

type prescriptionType = (typeof prescription)[0];
