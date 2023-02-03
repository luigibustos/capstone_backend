const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { createUserToken } = require("../middleware/Auth_Middleware");

// SING UP
// http://localhost:4000/auth/register
router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      username: username,
      email: email,
      password: hashedPassword,
    };
    const createdUser = await User.create(user);
    const rawPasword = password;
    if (createdUser) {
      req.body.password = rawPasword;
      const authenticatedUserToke = createUserToken(req, createdUser);
      res.status(201).json({
        user: createdUser,
        isLoggedIn: true,
        token: authenticatedUserToke,
      });
    } else {
      res.status(400).json({ error: "Something we wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN USER
// http://localhost:4000/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const token = await createUserToken(req, user);
  res.status(200).json({
    message: "Login successful",
    user: user,
    isLoggedIn: true,
    token,
  });
});

module.exports = router;
