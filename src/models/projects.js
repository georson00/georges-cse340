import db from './db.js'

const getAllProjects = async () => {
    const query = ` 
    SELECT
        project.project_id,
        project.title,
        project.organization_id,
        project.description,
        project.location,
        project.project_date,
        organization.name AS organization_name
    FROM public.service_project AS project
    INNER JOIN public.organization AS organization
        ON project.organization_id = organization.organization_id
    ORDER BY project.project_date;     
    `;
    const result = await db.query(query);

    return result.rows;
}


const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project.project_id,
          organization_id,
          project.title,
          project.description,
          project.location,
          project.project_date
        FROM public.service_project AS project
        WHERE project.organization_id = $1
        ORDER BY project.project_date;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};



const getUpcomingProjects = async (numberOfProjects) => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.project_date,
      sp.location,
      sp.organization_id,
      o.name AS organization_name
    FROM public.service_project AS sp
    INNER JOIN public.organization AS o
      ON sp.organization_id = o.organization_id
    WHERE sp.project_date >= CURRENT_DATE
    ORDER BY sp.project_date ASC
    LIMIT $1
  `;

  const result = await db.query(query, [numberOfProjects]);

  return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
     SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.project_date,
      sp.location,
      sp.organization_id,
      o.name AS organization_name
    FROM public.service_project AS sp
    INNER JOIN public.organization AS o
      ON sp.organization_id = o.organization_id
    WHERE sp.project_id = $1
    `;
    const result = await db.query(query, [id]);

    return result.rows[0];
    
};

const createProject = async (title, description, location, date, organizationId) => {
  
  const query = `
  INSERT INTO service_project (title, description, location, project_date, organization_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING project_id
  `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;

}
// Export the model functions
export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  createProject
};