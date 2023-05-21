import express from "express";
import userRoute from "./routes/userRoute";
import conversationRoute from "./routes/conversationRoute"
import assignRoute from "./routes/assignRoute"

import cors from "cors";
import "dotenv/config"


const app = express();
// middleware
const corsOptions = {
    origin: ["https://bodypositiveclient.onrender.com", "http://localhost:3000", "https://www.bodypawsitive.org" ] // frontend URI (ReactJS)
}

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors(corsOptions));

// routes
app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/assigns", assignRoute); 

app.get("/", (req, res) => {
    res.status(201).json({ message: "Connected to Backend!" });
});


export default app;