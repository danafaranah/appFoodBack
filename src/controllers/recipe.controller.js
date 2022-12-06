import {
    deleteImageCloudinary,
    uploadImageToCloudinary,
} from "../helpers/cloudinary.accions.js";
import { response } from "../helpers/response.js";
import { categoryModel } from "../models/category.model.js";
import { recipeModel } from "../models/recipe.model.js";
import { userModel } from "../models/user.model.js";

const recipeCtrl = {};

recipeCtrl.list = async(req, res) => {
    try {
        const recipes = await recipeModel.find().sort({ createdAt: -1 });
        response(res, 200, true, recipes, "Recipes list.");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

recipeCtrl.listOne = async(req, res) => {
    try {
        const { id } = req.params;
        const recipe = await recipeModel.findById(id);
        const ingredients = recipe.ingredients.split(", ");

        // Validar si el registro exite
        if (!recipe) {
            return response(res, 404, false, "", "The record does not exist.");
        }

        response(res, 200, true, {...recipe.toJSON(), ingredients: ingredients }, "Record found successfully.");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

recipeCtrl.add = async(req, res) => {
    try {
        const { name, description, rate, time, calories, ingredients, category } =
        req.body;

        const num = parseInt(rate);

        if (num < 0 || num > 5) {
            return response(
                res,
                409,
                false,
                "",
                "You entered an invalid value in rate (1-5), please try again."
            );
        }

        const newRecipe = new recipeModel({
            name,
            description,
            rate,
            time,
            calories,
            ingredients,
            category,
            user: req.userId,
        });

        if (req.file) {
            const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
            newRecipe.setImg({ secure_url, public_id });
        }

        await postModel.create(newRecipe);

        response(res, 201, true, "", "Recipe created.");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

recipeCtrl.delete = async(req, res) => {
    try {
        const { id } = req.params;
        const recipe = await recipeModel.findById(id);
        const userRecipe = await userModel.findById(recipe.user);
        const userLogged = await userModel.findById(req.userId);

        // Validar si existe el registro
        if (!recipe) {
            return response(res, 404, false, "", "The record does not exist.");
        }

        // Validar si el usuario que desea eliminar es el mismo que creó la receta
        if (userRecipe.id === userLogged.id) {
            if (recipe.public_id) {
                await deleteImageCloudinary(recipe.public_id);
            }
            await recipe.deleteOne();
            return response(
                res,
                200,
                true,
                "",
                "The recipe has been successfully deleted"
            );
        }

        response(
            res,
            400,
            false,
            "",
            "The recipe has been created by another user, you cannot delete it."
        );
    } catch (error) {
        response(res, 500, false, "", error.message);

    }
};

recipeCtrl.update = async(req, res) => {
    try {
        const { id } = req.params;
        const { category } = req.body;
        const recipe = await recipeModel.findById(id);
        const userRecipe = await userModel.findById(recipe.user);
        const userLogged = await userModel.findById(req.userId);

        // Validar si el usuario que desea actualizar la receta es el mismo que la creó
        if (userRecipe.id !== userLogged.id) {
            response(
                res,
                400,
                false,
                "",
                "The recipe has been created by another user, you cannot update it."
            );
        }

        // Validar si existe el registro
        if (!recipe) {
            return response(res, 404, false, "", "The recipe does not exist.");
        }

        // Validar si existe la categoría
        if (category !== recipe.category.toString()) {
            const newCategory = await categoryModel.findById({ _id: category })
            if (!newCategory)
                return response(res, 404, false, "", "The category does not exist");
        }

        if (req.file) {
            if (recipe.public_id) {
                await deleteImageCloudinary(recipe.public_id);
            }

            const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
            recipe.setImg({ secure_url, public_id });

            await recipe.save();
        }

        await recipe.updateOne(req.body);
        response(res, 200, true, "", "The recipe has been successfully updated");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

export default recipeCtrl;