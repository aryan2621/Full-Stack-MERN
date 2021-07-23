const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const dotenv = require("dotenv");
dotenv.config();
const db = process.env.MONGO_URL;
const router = require("./routes/posts");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.get("/",(req,res)=>{
  res.send("connected")
})
app.use("/posts", router);
app.use("/user", userRoutes);
mongoose.connect(
  db,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true },
  () => console.log("database is connected")
);

app.listen(port, () => console.log("server is running"));
