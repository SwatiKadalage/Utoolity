import { Router } from "express";
import { upload } from "../middleware/upload.middleware";
import * as controller from "../controllers/imageClassification.controller";

const router = Router();

// Classify image and move to folder
router.post(
  "/",
  upload.single("image"),
  controller.classify
);

// Create a new category folder
router.post(
  "/folders",
  controller.createFolder
);

// Get summary of folders
router.get(
  "/summary",
  controller.getSummary
);

// New: Download all sorted images as a ZIP
router.get(
  "/download/:sessionId",
  controller.downloadSortedImages
);

export default router;