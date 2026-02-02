import express from "express";
import multer from "multer";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  addImages, // <- cambiado
  deleteImage, // <- cambiado
} from "../controllers/roomController.js";
import { authRequired } from "../middlewares/validateToken.js";
import { authRole } from "../middlewares/verifyRole.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/rooms");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const ext = file.originalname.toLowerCase().split(".").pop();
  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes .jpg, .jpeg, .png o .webp"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter,
});

router.get("/", getRooms);
router.post("/", authRequired, authRole(["admin"]), createRoom);
router.put("/:id", authRequired, authRole(["admin"]), updateRoom);
router.delete("/:id", authRequired, authRole(["admin"]), deleteRoom);

router.post(
  "/:id/photos",
  authRequired,
  authRole(["admin"]),
  upload.array("photos", 5), // máximo 5 imágenes por solicitud
  addImages,
);

router.delete("/:id/photos", authRequired, authRole(["admin"]), deleteImage);

export default router;
