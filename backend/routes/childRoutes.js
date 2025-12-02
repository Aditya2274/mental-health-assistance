// backend/routes/childRoutes.js
import express from "express";
import {
  addChild,
  getMyChildren,
  getChildDetails,
  updateChild,
  deleteChild
} from "../controllers/childController.js";
import auth from "../middleware/auth.js";

const childRoutes = express.Router();

childRoutes.post("/add", auth, addChild);
childRoutes.get("/mine", auth, getMyChildren);
childRoutes.get("/:id/details", auth, getChildDetails);
childRoutes.put("/:id", auth, updateChild);
childRoutes.delete("/:id", auth, deleteChild);

export default childRoutes;
