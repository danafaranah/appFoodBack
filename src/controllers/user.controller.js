import { encryptPassword } from "../helpers/encryptPassword.js";
import { generateToken } from "../helpers/generateToken.js";
import { response } from "../helpers/response.js";
import { categoryModel } from "../models/category.model.js";
import { recipeModel } from "../models/recipe.model.js";
import { userModel } from "../models/user.model.js";

const userCtrl = {};

userCtrl.list = async (req, res) => {
  try {
    const users = await userModel.find();
    response(res, 200, true, users, "Lista de usuarios.")
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
}

userCtrl.listById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    // Validar si el registro exite
    if (!user) {
      return response(res, 404, false, "", "Username does not exist.");
    }

    const recetaAsociada = await recipeModel.find({ user: id });

    response(
      res,
      200,
      true,
      { ...user.toJSON(), recetaAsociada, password: null },
      "User found successfully."
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

userCtrl.register = async (req, res) => {
  try {
    const { email, password, name, lastname } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      return response(
        res,
        409,
        false,
        "",
        "The email address is already being used by someone else."
      );
    }

    const passwordEncrypt = encryptPassword(password);

    const newUser = new userModel({
      email,
      password: passwordEncrypt,
      name,
      lastname,
    });

    await newUser.save();

    const token = generateToken({ user: newUser._id });

    response(
      res,
      201,
      true,
      { ...newUser.toJSON(), password: null, token },
      "The user has been created successfully."
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

// Función para loguearse
userCtrl.login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await userModel.findOne({ email });

    if (user && user.matchPassword(password)) {
      const token = generateToken({ user: user._id });
      return response(
        res,
        200,
        true,
        { ...user.toJSON(), password: null, token },
        "Welcome"
      );
    }

    response(
      res,
      400,
      false,
      "",
      "The credentials are not correct, please try again."
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

// Función para eliminar usuarios
userCtrl.delete = async(req, res) => {
  try {
      const { id } = req.params;

      const user = await userModel.findById(id);

      const recipe = await recipeModel.findOne({ user: id });

      const category = await categoryModel.findOne({ user: id });

      if (!user) {
          return response(res, 404, false, "", "User does not exist.");
      }

      if (recipe || category) {
          return response(
              res,
              401,
              false,
              "",
              "The user could not be deleted because there are elements associated with it."
          );
      }

      await user.deleteOne();
      response(res, 200, true, "", "User deleted successfully");
  } catch (error) {
      response(res, 500, false, "", error.message);
  }
};

export default userCtrl;
