import { Schema, model } from "mongoose";
const categorySchema = new Schema({
        name: {
            type: String,
            required: [true, "El campo nombre es requerido."],
        },
        // description: {
        //     type: String,
        //     required: [true, "El campo descripcion es requerido."],

        // },
        user: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
    },

    { timestamps: true }
);

export const categoryModel = model("category", categorySchema);