const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");

require("../config/db.connection");

// GET ALL USERS
// http://localhost:4000/users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE USER
// http://localhost:4000/users/:id
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).populate("recipes");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST USER
// http://localhost:4000/users
router.post("/", async (req, res, next) => {
  try {
    // const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    const createdUser = await User.create(user);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
// http://localhost:4000/users/:id
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedPerson = await User.findByIdAndDelete(id);
    res.status(202).json(deletedPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
