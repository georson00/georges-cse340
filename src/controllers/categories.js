// Import categories model functions
import { getAllCategories } from "../models/categories.js";
import { getCategoryDetails, getProjectsByCategoryId, getCategoriesByProjectId } from "../models/categories.js";


// Define categories controller functions
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Categories";

  res.render("categories", { title, categories });
};

// Define category details controller functions
const showCategoryDetailsPage = async (req, res) => {
  const categoryId = req.params.id;

  const category = await getCategoryDetails(categoryId);
  const projects = await getProjectsByCategoryId(categoryId);

  if (!category) { return res.status(404).send('Category not found!'); }

  res.render("category", {
    title: category.name,
    category,
    projects

  });
};





// Export categories controller functions
export { showCategoriesPage, showCategoryDetailsPage };
