import express from "express";
import * as UserController from "../controllers/userController";

const router = express.Router();

router.post("/signup", UserController.signUp);

router.post("/signin", UserController.signIn);

router.post("/addAnimal/:username", UserController.addAnimal);

router.get("/getProfile/:username", UserController.getProfile)

router.post("/updateProfile/:username", UserController.updateProfile)

export default router;