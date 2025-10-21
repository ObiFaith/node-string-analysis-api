import express from "express";
import {
  getString,
  getStrings,
  createString,
  deleteString,
  getStringByNL,
} from "../controllers/string.js";

const router = express.Router();

router.route("/").get(getStrings).post(createString);
router.route("/filter-by-natural-language").get(getStringByNL);
router.route("/:value").get(getString).delete(deleteString);

export default router;
