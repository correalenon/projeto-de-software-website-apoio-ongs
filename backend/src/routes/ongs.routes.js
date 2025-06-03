import { Router } from 'express';
import {getOngs, getOngByID, deleteOngByID, putOng, postOng, getCNPJ, getMe, getOngProjects, PutPasswordOng} from '../controllers/ongs.controller.js';
import { authenticateUserOrOng } from '../services/authentication.js';

const router = Router();

router.get("/me", authenticateUserOrOng, getMe);
router.get("/cnpj/:cnpj", getCNPJ);
router.get("/projects", authenticateUserOrOng, getOngProjects);
router.put("/editpassword", authenticateUserOrOng, PutPasswordOng);
router.get("/", authenticateUserOrOng, getOngs);
router.get("/:id", authenticateUserOrOng, getOngByID);
router.post("/", postOng);
router.put("/", authenticateUserOrOng, putOng);
router.delete("/:id", authenticateUserOrOng, deleteOngByID);

export default router;