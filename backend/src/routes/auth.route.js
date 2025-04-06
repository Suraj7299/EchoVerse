import { Router } from "express";
import { authCallback } from "../contollers/auth.controller.js";
const router = Router();

router.get("/", (req, res) => {
  res.send("Auth route with get method");
});
router.post("/callback", authCallback);
export default router;