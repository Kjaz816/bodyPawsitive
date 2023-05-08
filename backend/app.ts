import express from "express";
import "dotenv/config"


const app = express();


app.use(express.json());


// route
app.get("/", (req, res) => {
    res.status(201).json({message: "Connected to Backend!"});
});

export default app;