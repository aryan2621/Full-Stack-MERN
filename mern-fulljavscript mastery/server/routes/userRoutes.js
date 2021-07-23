const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Modal/User");
const userRoutes = require("express").Router();
const auth = require("../middleware/auth");



userRoutes.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not Exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "text",
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong!!!" });
  }
});

userRoutes.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, confirmPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already Exist" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password Not Matching" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName}${lastName}`,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, "text", {
      expiresIn: "1h",
    });
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong!!!" });
  }
});

module.exports = userRoutes;
