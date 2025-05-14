import { Router } from 'express';
import {getOngs, getOngByID, deleteOngByID, putOngByID, postOng, getCNPJ, getMe} from '../controllers/ongs.controller.js';
import { authenticateUserOrOng } from '../services/authentication.js';

const router = Router();

router.get("/me", authenticateUserOrOng, getMe);
router.get("/cnpj/:cnpj", getCNPJ);
router.get("/", authenticateUserOrOng, getOngs);
router.get("/:id", authenticateUserOrOng, getOngByID);
router.post("/", postOng);
router.put("/:id", authenticateUserOrOng, putOngByID);
router.delete("/:id", authenticateUserOrOng, deleteOngByID);

export default router;