const express = require("express");
const Item = require("../Models/ItemsModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post(
  "/items",
  upload.single("productImage"),
  asyncErrorHandler(async (req, res, next) => {
    const newItem = new Item({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category_id: req.body.category_id,
      productImage: req.file.filename, // Save the filename instead of the buffer
    });

    await newItem.save();
    res.status(201).json(newItem);
  })
);

router.put("/items/:id", upload.single("productImage"), async (req, res) => {
  try {
    const itemId = req.params.id;

    const updatedData = {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      size: req.body.size,
      description: req.body.description,
      category_id: req.body.category_id,
      productImage: req.file.filename,
    };

    const updatedItem = await Item.findByIdAndUpdate(itemId, updatedData, {
      new: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteItem/:id", async (req, res) => {
  const itemId = req.params.id;

  try {
    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (deletedItem) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/itemsCategory", async (req, res) => {
  try {
    const categoryId = req.query.categoryId
      ? req.query.categoryId
      : "65569d8cf4a8d4687d535d8d";

    if (!categoryId) {
      return res
        .status(400)
        .json({ error: "Category ID is required in query parameters" });
    }

    const items = await Item.find({ category_id: categoryId });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
