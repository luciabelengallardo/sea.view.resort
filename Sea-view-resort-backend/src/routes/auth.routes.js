import express from "express";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import {
  login,
  logout,
  profile,
  register,
  verifyEmail,
  verifyToken,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import {
  passwordChange,
  passwordResetRequest,
} from "../controllers/password-reset.controller.js";
import { authRole } from "../middlewares/verifyRole.js";
import {
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/manage-user.controller.js";

const router = express.Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);
router.get("/verify-token", verifyToken);
router.get("/verify-email", verifyEmail);
router.post("/password-reset-request", passwordResetRequest);
router.post("/password-change/:token", passwordChange);
router.get("/users", authRequired, authRole(["admin"]), getUsers);
router.put("/users/:id", authRequired, authRole(["admin"]), updateUser);
router.delete("/users/:id", authRequired, authRole(["admin"]), deleteUser);

export default router;
