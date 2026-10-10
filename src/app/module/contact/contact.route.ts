import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "../../middleware/validateRequest";
import { ContactController } from "./contact.controller";

const router = Router();

const contactSchema = z.object({
  name: z.string().trim().min(3).max(100),
  email: z.email(),
  message: z.string().trim().min(10).max(1000),
});

router.post("/", validateRequest(contactSchema), ContactController.sendMessage);

export const ContactRoutes = router;
