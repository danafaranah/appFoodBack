import { response } from "../helpers/response.js";
import { categoryModel } from "../models/category.model.js";
import { recipeModel } from "../models/recipe.model.js";

const categoryCtrl = {};

categoryCtrl.getCategory = async(req, res) => {
    try {
        const categories = await categoryModel.find();

        response(res, 200, true, categories, "Category List.");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};
categoryCtrl.getCategoryById = async(req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        const recipe = await recipeModel.find({ category: id });

        if (!category) {
            return response(res, 404, false, "", "Category not found.");
        }

        response(
            res,
            200,
            true, {...category.toJSON(), recipe },
            "Category found."
        );
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};
categoryCtrl.addCategory = async(req, res) => {
    try {
        // const { name, description } = req.body;
        const { name } = req.body;
        const newCategory = new categoryModel({
            name,
            // description,
            user: req.userId,
        });

        await categoryModel.create(newCategory);
        response(res, 201, true, newCategory, "Category added successfully!");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

categoryCtrl.deleteCategory = async(req, res) => {
    try {
        const { id } = req.params;

        const category = await categoryModel.findById(id);

        const recipe = await recipeModel.findOne({ category: id });

        if (!category) {
            return response(res, 404, false, "", "Category not found.");
        }

        if (recipe) {
            return response(
                res,
                401,
                false,
                "",
                "The category could not be deleted because there are recipes associated with it."
            );
        }

        await category.deleteOne();
        response(res, 200, true, "", "Category successfully removed!");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

categoryCtrl.updateCategory = async(req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);

        if (!category) {
            return response(res, 404, false, "", "Category not found.");
        }

        await category.updateOne(req.body);
        response(res, 200, true, category, "Category updated successfully!");
    } catch (error) {
        response(res, 500, false, "", error.message);
    }
};

export default categoryCtrl;