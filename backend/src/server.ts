import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors, { CorsOptions } from "cors";

import userRoutes from "./routes/user.routes";
import prescriptionRoutes from "./routes/prescription.routes";
import doctorRoutes from "./routes/doctor.routes";

const app = express();
const PORT = process.env.PORT || 5000;




// middleware
app.use(express.json());
app.use(cors())

app.use("/user", userRoutes);
app.use("/prescription", prescriptionRoutes);
app.use("/doctors", doctorRoutes);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
