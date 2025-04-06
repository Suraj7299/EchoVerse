import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("Album route with get method");
});
export default router;