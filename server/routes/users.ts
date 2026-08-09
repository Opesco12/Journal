import express from "express";
import multer from "multer";
import {
  searchUsersController,
  uploadProfileImageController,
} from "../controllers/users";
import { validate } from "../middleware/validate";
import { searchUsersSchema } from "../validators/users";

const router = express.Router();
const allowedProfileImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (allowedProfileImageTypes.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    const error = new Error(
      "Profile image must be a JPEG, PNG, WebP, or GIF",
    ) as Error & { status?: number };
    error.status = 400;
    cb(error);
  },
});

router.get("/search", validate(searchUsersSchema), searchUsersController);
router.post(
  "/profile-image",
  upload.single("image"),
  uploadProfileImageController,
);

export default router;
