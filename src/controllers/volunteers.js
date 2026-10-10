import {
  addVolunteersToProjects,
  removeVolunteersFromProjects,
} from "../models/users.js";

import { getProjectDetails } from "../models/projects.js";

const addVolunteer = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    const userId = req.session.user.user_id;

    if (!Number.isSafeInteger(projectId) || projectId < 1) {
      return res.status(400).send("Invalid project ID.");
    }

    const project = await getProjectDetails(projectId);

    if (!project) {
      return res.status(404).send("Project not found.");
    }

    await addVolunteersToProjects(projectId, userId);

    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

const removeVolunteer = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    const userId = req.session.user.user_id;

    if (!Number.isSafeInteger(projectId) || projectId < 1) {
      return res.status(400).send("Invalid project ID.");
    }

    await removeVolunteersFromProjects(projectId, userId);

    // Both pages can use this controller.
    const destination =
      req.body.returnTo === "dashboard"
        ? "/dashboard"
        : `/project/${projectId}`;
    req.flash("success", "You have removed yourself from this project!");
    return res.redirect(destination);
  } catch (error) {
    next(error);
  }
};

export { addVolunteer, removeVolunteer };
