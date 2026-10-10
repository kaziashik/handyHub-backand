import { NextFunction, Request, Response } from "express";
import multer from "multer";
// Set up Multer for handling file uploads
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });

const profilePhoto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }
    callback(new Error("Profile photo must be an image"));
  },
});

export function optionalProfilePhoto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  profilePhoto.single("profileImage")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      next(new Error("Profile photo must be 2MB or smaller"));
      return;
    }
    next(error);
  });
}