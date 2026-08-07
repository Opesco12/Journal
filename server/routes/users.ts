import express from "express";
import { searchUsersController } from "../controllers/users";
import { validate } from "../middleware/validate";
import { searchUsersSchema } from "../validators/users";

const router = express.Router();

router.get("/search", validate(searchUsersSchema), searchUsersController);

export default router;
