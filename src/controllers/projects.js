import express from "express";
// Import projects model functions
import { getAllProjects } from "../models/projects.js";
import { getUpcomingProjects } from "../models/projects.js";
import { getProjectDetails } from "../models/projects.js";
import { getProjectsByOrganizationId } from "../models/projects.js";

const app = express();

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define projects controller functions
const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects();
  const title = "Upcoming Service Projects";

  res.render("projects", { title, projects });
};

app.get("/", async (req, res) => {
  const upcomingProjects = await getUpcomingProjects(
    NUMBER_OF_UPCOMING_PROJECTS,
  );

  res.render("home", {
    title: "Home",
    upcomingProjects,
  });
});

const showProjectDetailsPage = async (req, res) => {
  const projectId = req.params.id;

  const project = await getProjectDetails(projectId);

  res.render("project", {
    title: project.title,
    project,
  });
};

// Export organizations controller functions
export { showProjectsPage, showProjectDetailsPage };
