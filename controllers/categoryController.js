import Category from "../models/Category.js";

/////////////////////////////////////////////////
// CREATE CATEGORY
/////////////////////////////////////////////////

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/////////////////////////////////////////////////
// GET ALL
/////////////////////////////////////////////////

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/////////////////////////////////////////////////
// UPDATE
/////////////////////////////////////////////////

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
      },
    );

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/////////////////////////////////////////////////
// DELETE
/////////////////////////////////////////////////

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
