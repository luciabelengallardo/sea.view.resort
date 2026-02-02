import express from "express";
import {
  createRoom,
  deleteImage,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  uploadImage,
} from "../controllers/rooms.controller.js";
import { upload } from "../middlewares/upload.js";
import { authRequired } from "../middlewares/validateToken.js";
import { authRole } from "../middlewares/verifyRole.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoom);
router.post("/", authRequired, authRole(["admin"]), createRoom);
router.put("/:id", authRequired, authRole(["admin"]), updateRoom);
router.delete("/:id", authRequired, authRole(["admin"]), deleteRoom);
router.post(
  "/:id/images",
  authRequired,
  authRole(["admin"]),
  upload.single("image"),
  uploadImage,
);
router.delete(
  "/:id/images/:index",
  authRequired,
  authRole(["admin"]),
  deleteImage,
);

export default router;
