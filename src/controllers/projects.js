import express from "express";
import { body, validationResult } from "express-validator";
// Import projects model functions
import {
  getAllProjects,
  getUpcomingProjects,
  getProjectDetails,
  getProjectsByOrganizationId,
  createProject,
  updateProject
} from "../models/projects.js";

import { getCategoriesByProjectId, getCategoryDetails } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";
import { isUserVolunteering } from "../models/users.js";

const app = express();

const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage("Location must be less than 200 characters"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date format"),
  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt()
    .withMessage("Organization must be a valid integer"),
];


const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define projects controller functions
const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  const title = "Upcoming Service Projects";

  res.render("projects", { title, projects });
};

app.get("/", async (req, res) => {
  const upcomingProjects = await getUpcomingProjects();

  res.render("home", {
    title: "Home",
    upcomingProjects,
  });
});

const showProjectDetailsPage = async (req, res) => {
  const projectId = req.params.id;

  const project = await getProjectDetails(projectId);
  const categories = await getCategoriesByProjectId(projectId);

  
  if (!project) { return res.status(404).send('Service project not found!'); }
  let isVolunteering = false;

  if (req.session?.user) {
    isVolunteering = await isUserVolunteering(
      project.project_id,
      req.session.user.user_id,
    );
  }
  res.render("project", {
    title: project.title,
    project,
    categories,
    isVolunteering,
    
  });
  
};

const showNewProjectForm = async (req, res) => {
  
  const organizations = await getAllOrganizations();
  const title = 'Add New Service Project'; 
  

  res.render('new-project', { title, organizations });

}

const processNewProjectForm = async (req, res) => {
  //check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //Loop through validation errors and flash them
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    //Redirect back to the new project form
    return res.redirect("/new-project");
  }

  // Extract form data from req.body
  const { title, description, location, date, organizationId } = req.body;

  try {
    // Create the new project in the database
    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId,
    );
    // Set a success flash message
    req.flash("success", "New service project created successfully!");
    res.redirect(`/project/${newProjectId}`);

  } catch (error) {
    console.error("Error creating new project:", error);
    req.flash("error", "There was an error creating the service project.");
    res.redirect("/new-project");
  }
};

//---------------------------------------------------------------
const showEditProjectForm = async (req, res) => {
  const projectId = req.params.id;

  const projectDetails = await getProjectDetails(projectId);
  const organizations = await getAllOrganizations();

  if (!projectDetails) {
    return res.status(404).render("errors/404", {
      title: "Project Not Found",
    });
  }

  const title = "Update Service Project";

  res.render("edit-project", {
    title,
    projectDetails,
    organizations,
  });
};

const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    return res.redirect(`/edit-project/${projectId}`);
  }

  
  // Extract the editable fields from the form
  const { title, description, location, date, organizationId } = req.body;

  try {
    await updateProject(
      projectId,
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "Service project updated successfully!");

    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error updating project:", error);

    req.flash("error", "There was an error updating the service project.");

    return res.redirect(`/edit-project/${projectId}`);
  }
};


// Export organizations controller functions
export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm
};
