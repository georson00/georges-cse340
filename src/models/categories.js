import db from './db.js'

const getAllCategories = async () => {
    const query = `
    SELECT category_id, name
    FROM public.category
    ORDER BY name
    `;

    const result = await db.query(query);

    return result.rows;
}

// 1. Retrieve a single category by its ID.
const getCategoryDetails = async (id) => {


    const query = `
    SELECT category_id, name
    FROM public.category
    WHERE category_id = $1`
        ;
    
    const result = await db.query(query, [id]);
    return result.rows[0];

};

// 2. Retrieve all categories for a given service project.
const getCategoriesByProjectId = async (projectId) => {
    const query = `
    SELECT
        c.category_id,
        c.name
    FROM public.category AS c
    INNER JOIN public.service_project_category AS spc
        ON c.category_id = spc.category_id
    WHERE spc.project_id = $1
    ORDER BY c.name ASC

    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

// 3. Retrieve all service projects for a given category.
const getProjectsByCategoryId = async (categoryId) => { 
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
    INNER JOIN public.service_project_category AS spc
        ON sp.project_id = spc.project_id
    INNER JOIN public.organization AS o
        ON sp.organization_id = o.organization_id
    WHERE spc.category_id = $1
    ORDER BY sp.project_date ASC

    
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
    INSERT INTO service_project_category(project_id, category_id)
    VALUES ($1, $2);
    
    `;

    await db.query(query, [projectId, categoryId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
    DELETE FROM service_project_category
    WHERE project_id = $1;


    `;

    await db.query(deleteQuery, [projectId]);

    //Next add the category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
}


export {
    getAllCategories,
    getCategoryDetails,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments
};