import express from "express";
import * as assignController from "../controllers/assignController";

const router = express.Router();

router.get("/getAssigns/:username", assignController.getAssigns);

export default router;