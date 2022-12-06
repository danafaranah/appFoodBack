import { Router } from "express";
import userCtrl from "../controllers/user.controller.js";
import { authClient } from "../middleware/auth.js";

const route = Router();

route.post("/register", userCtrl.register);
route.post("/login", userCtrl.login);
route.get("/:id", userCtrl.listById);
route.get("/", userCtrl.list);
route.delete("/:id", userCtrl.delete);

export default route;
