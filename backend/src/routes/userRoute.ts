import express from "express";
import * as UserController from "../controllers/userController";

const router = express.Router();

router.post("/signup", UserController.signUp);

router.post("/signin", UserController.signIn);

router.get("/getProfile/:profileId", UserController.getProfile)

export default router;