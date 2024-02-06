const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./Routes/ItemRoutes");
const categoreyRoutes = require("./Routes/categoryRoutes");
const CustomError = require("./utils/custumeError");
const errorController = require("./controllers/errorController");

require("dotenv").config();

const mongodbenv = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 3004;

mongoose.connect(mongodbenv, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use("/api", express.static("uploads"));

app.use(express.json());
app.use(categoreyRoutes);
app.use(itemRoutes);

app.all("*", (req, res, next) => {
  const error = new CustomError("Can't find this URL on the server", 404);
  next(error);
});

app.use((error, req, res, next) => {
  errorController(error, req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
