import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: "true" }));

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

import userRoutes from "./routes/userRoutes.js";
import contactUsRoutes from "./routes/contactUsRoutes.js";
import newsletterSignupRoutes from "./routes/newsletterSignupRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import blogRoutes from "./routes/blogsRoutes.js";
import storageRoutes from "./routes/storageRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import kycRoutes from "./routes/kycRoutes.js";
import membershipRoutes from "./routes/partnerMembership.js";

app.use("/api/v1", userRoutes);
app.use("/api/v1", contactUsRoutes);
app.use("/api/v1", newsletterSignupRoutes);
app.use("/api/v1", testimonialRoutes);
app.use("/api/v1", blogRoutes);
app.use("/api/v1", storageRoutes);
app.use("/api/v1", partnerRoutes);
app.use("/api/v1", kycRoutes);
app.use("/api/v1", membershipRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Database connected !");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
