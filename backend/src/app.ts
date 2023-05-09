import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";

import cors from "cors";
import "dotenv/config"


const app = express();
// middleware
const corsOptions = {
    origin: ["https://bodypositiveclient.onrender.com", "http://localhost:3000", "https://www.bodypawsitive.org" ] // frontend URI (ReactJS)] // frontend URI (ReactJS)
}
app.use(express.json());
app.use(cors(corsOptions));

// route
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
    res.status(201).json({ message: "Connected to Backend!" });
});


export default app;