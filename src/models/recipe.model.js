import mongoose from "mongoose";
const { Schema, model } = mongoose;

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The 'name' field is required"],
    },
    description: {
      type: String,
      required: [true, "The 'description' field is required"],
    },
    rate: {
      type: Number,
      required: [true, "The 'rate' field is required"],
    },
    time: {
      type: Number,
      required: [true, "The 'time' field is required"],
    },
    calories: {
      type: Number,
      required: [true, "The 'calories' field is required"],
    },
    ingredients: {
      type: String,
      required: [true, "The 'ingredients' field is required"],
    },
    category: {
        type: Schema.Types.ObjectId,
        required: [true, "The 'category' field is required"],
        ref: "category"
    },
    imgUrl: {
        type: String,
        required: [true, "The 'imgUrl' field is required"],
        default: null,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    public_id: String,
  },
  {
    timestamps: true,
  }
);

recipeSchema.methods.setImg = function setImg({ secure_url, public_id }) {
    this.imgUrl = secure_url;
    this.public_id = public_id;
};

export const recipeModel = model("recipe", recipeSchema);
