// Import projects model functions
import { getAllProjects } from "../models/projects.js";

// Define projects controller functions
const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = "Service Projects";

  res.render("projects", { title, projects });
};

// Export organizations controller functions
export { showProjectsPage };
