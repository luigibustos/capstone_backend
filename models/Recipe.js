const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema(
  {
    recipeName: {
      type: String,
      required: true,
    },
    roast: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    balance: {
      type: String,
      required: true,
    },
    strength: {
      type: String,
      required: true,
    },
    servingSize: {
      type: String,
      required: true,
    },
    waterTemp: {
      type: String,
      required: true,
    },
    waterAmount: {
      type: Number,
      required: true,
    },
    coffeeAmount: {
      type: Number,
      required: true,
    },
    pours: [
      {
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;
