// Import categories model functions
import { getAllCategories } from "../models/categories.js";

// Define categories controller functions
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Categories";

  res.render("categories", { title, categories });
};

// Export categories controller functions
export { showCategoriesPage };
