import { Router } from "express";
import { z } from "zod";
import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { uploadLimiter } from "../../middleware/rateLimiter";

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().trim().min(3).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\d{11}$/, "Phone must be 11 digits")
    .optional(),
});

router.patch(
  "/profile",
  auth(Role.CUSTOMER, Role.ADMIN, Role.TECHNICIAN),
  validateRequest(updateProfileSchema),
  UserController.updateProfile,
);

router.get(
  "/customers",
  auth(Role.ADMIN),
  UserController.getCustomers,
);

router.patch("/profile-image",
    uploadLimiter,
    auth(Role.CUSTOMER, Role.ADMIN, Role.TECHNICIAN),
    upload.single("profileImage"),
    UserController.uploadProfileImage);

export const UserRoutes = router;
