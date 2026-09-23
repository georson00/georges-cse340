// Import categories model functions
import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments
} from "../models/categories.js";

import { getProjectDetails } from "../models/projects.js";



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
  

  if (!category) { return res.status(404).send('Category not found!'); }

  const projects = await getProjectsByCategoryId(categoryId);
  
  res.render("category", {
    title: category.name,
    category,
    projects

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



// Export categories controller functions
export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm
};
