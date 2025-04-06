import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("Auth route with get method");
});
export default router;