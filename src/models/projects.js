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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };