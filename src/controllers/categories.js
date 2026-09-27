import { body, validationResult } from "express-validator";

// Import categories model functions
import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments,
  createCategory,
  updateCategory
} from "../models/categories.js";

import { getProjectDetails } from "../models/projects.js";

const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 200 characters"),
];

// Define categories controller functions
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Project Categories";

  res.render("categories", { title, categories });
};

// Define category details controller functions
const showCategoryDetailsPage = async (req, res) => {
  const categoryId = req.params.id;

  const category = await getCategoryDetails(categoryId);

  if (!category) {
    return res.status(404).send("Category not found!");
  }

  const projects = await getProjectsByCategoryId(categoryId);

  res.render("category", {
    title: category.name,
    category,
    projects,
  });
};

const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);

  const title = "Assign Categories to Project";

  res.render("assign-categories", {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  // Ensure selectedCategoryIds is an array
  const categoryIdsArray = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];
  await updateCategoryAssignments(projectId, categoryIdsArray);
  req.flash("success", "Categories updated successfully.");
  res.redirect(`/project/${projectId}`);
};

//-------------------------------------------------------------------------------------

const showNewCategoryForm = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Add New Category";

  res.render("new-category", { title, categories });
};

const processNewCategoryForm = async (req, res) => {
  //check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //Loop through validation errors and flash them
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    //Redirect back to the new project form
    return res.redirect("/new-category");
  }

  // Extract form data from req.body
  const { name } = req.body;

  try {
    // Create the new Category in the database
    const newCategoryId = await createCategory(name);

    // Set a success flash message
    req.flash("success", "New category created successfully!");
    res.redirect(`/category/${newCategoryId}`);
  } catch (error) {
    console.error("Error creating category:", error);
    req.flash("error", "There was an error creating the category.");
    res.redirect("/new-category");
  }
};

//---------------------------------------------------------------
const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;

  const categoryDetails = await getCategoryDetails(categoryId);

  if (!categoryDetails) {
    return res.status(404).render("errors/404", {
      title: "Category Not Found",
    });
  }

  const title = "Update Category Name";

  res.render("edit-category", {
    title,
    categoryDetails,
  });
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect(`/edit-category/${categoryId}`);
  }

  // Extract the editable fields from the form
  const { name } = req.body;

  try {
    await updateCategory(categoryId, name);

    req.flash("success", "Category Name updated successfully!");

    return res.redirect(`/category/${categoryId}`);
  } catch (error) {
    console.error("Error updating project:", error);

    req.flash("error", "There was an error updating the category name.");

    return res.redirect(`/edit-category/${categoryId}`);
  }
  
};

// Export categories controller functions
export {
  categoryValidation,
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showEditCategoryForm,
  processEditCategoryForm,
  processNewCategoryForm,
  showNewCategoryForm,
};
