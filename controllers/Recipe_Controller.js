const express = require("express");
const router = express.Router();
const { Recipe, User } = require("../models");
const {
  handleValidateOwnership,
  requireToken,
} = require("../middleware/Auth_Middleware");

require("../config/db.connection");

// GET ALL RECIPES
router.get("/", async (req, res, next) => {
  try {
    const recipes = await Recipe.find({});
    // .populate("owner");
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE RECIPE
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const recipe = await Recipe.findById(id);
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST RECIPE
router.post("/", requireToken, async (req, res, next) => {
  try {
    const owner = req.user._id;
    req.body.owner = owner;
    const createdRecipe = await Recipe.create(req.body);

    const user = await User.findById(owner);
    user.recipes.push(createdRecipe._id);
    await user.save();

    res.status(201).json(createdRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT
router.put("/:id", requireToken, async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  try {
    handleValidateOwnership(req, await Recipe.findById(id));
    const updateRecipe = await Recipe.findByIdAndUpdate(id, body);
    res.status(201).json(updateRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE
router.delete("/:id", requireToken, async (req, res, next) => {
  const id = req.params.id;
  try {
    handleValidateOwnership(req, await Recipe.findById(id));
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    res.status(202).json(deletedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
