import { Router } from "express";
import recipeCtrl from "../controllers/recipe.controller.js";
import { authClient } from "../middleware/auth.js";
import { upload } from "../middleware/imgUpload.js";

const route = Router();

route.get("/", recipeCtrl.list);
route.get("/:id", recipeCtrl.listOne);
route.post("/", upload.single("img"), recipeCtrl.add);
route.put("/:id", authClient, upload.single("img"), recipeCtrl.update);
route.delete("/:id", recipeCtrl.delete);

export default route;