import express from "express";
import cors from "cors";
import morgan from "morgan";
import { conectarDb } from "./database.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Routes
import userRoutes from "./routes/user.routes.js"
import categoryRoutes from "./routes/category.routes.js"
import recipeRoutes from "./routes/recipe.routes.js"


conectarDb();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("Port", 4000);

app.use("/public", express.static(__dirname + "/storage/imgs"))

app.use(morgan("dev"));
app.use(cors({origin: "*"}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/recipe", recipeRoutes);



app.listen(app.get("Port"), () => {
    console.log("El servidor está en el puerto ", app.get("Port"));
})
