import { Router } from "express";
import categoryCtrl from "../controllers/category.controller.js";
import { authClient } from "../middleware/auth.js";

const route = Router();

route.get("/", categoryCtrl.getCategory);
route.get("/:id", categoryCtrl.getCategoryById);
route.post("/", categoryCtrl.addCategory);
route.delete("/:id", authClient, categoryCtrl.deleteCategory);
route.put("/:id", authClient, categoryCtrl.updateCategory);

export default route;