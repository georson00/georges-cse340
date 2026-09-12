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

export { getAllProjects };