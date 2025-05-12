import { Router } from 'express';
import {getOngs, getOngByID, deleteOngByID, putOngByID, postOng, getCNPJ} from '../controllers/ongs.controller.js';
import { authenticateUser } from '../services/authentication.js';

const router = Router();

router.get("/cnpj/:cnpj", getCNPJ);
router.get("/", authenticateUser, getOngs);
router.get("/:id", authenticateUser, getOngByID);
router.post("/", postOng);
router.put("/:id", authenticateUser, putOngByID);
router.delete("/:id", authenticateUser, deleteOngByID);

export default router;