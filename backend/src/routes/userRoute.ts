import express from "express";
import * as UserController from "../controllers/userController";

const router = express.Router();

router.post("/addUser/:assignedTo", UserController.addUser);

router.post("/signin", UserController.signIn);

router.post("/addAnimal/:username", UserController.addAnimal);

router.get("/getProfile/:username", UserController.getProfile)

router.get("/getAllProfiles", UserController.getAllProfiles)

router.post("/updateProfile/:username", UserController.updateProfile)

router.get("/getAnimalDetails/:username/animals/:animalId", UserController.getAnimalDetails)

router.get("/getAnimalWeights/:username/animals/:animalId", UserController.getAnimalWeights)

router.post("/updateAnimal/:username/animals/:animalId", UserController.updateAnimal)

router.post("/addAnimalWeight/:username/animals/:animalId", UserController.addAnimalWeight)

router.post("/postWeight/", UserController.uploadWeight)

export default router;