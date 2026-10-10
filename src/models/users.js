import db from "./db.js";
import bcrypt from "bcrypt";
import { Result } from "pg";


const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
    INSERT INTO users (name, email, password_hash, role_id)
    VALUES ($1, $2, $3, ( SELECT role_id FROM roles WHERE role_name = $4))
    RETURNING user_id
    
    `;

    const queryParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) { 
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id)
    }

    return result.rows[0].user_id;
}

const findUserByEmail = async (email) => {
  const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_id, r.role_name 
        FROM users u
        JOIN roles r
        ON u.role_id = r.role_id
        WHERE email = $1
    `;
  const queryParams = [email];

  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    return null; // User not found
  }

  return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const passwordIsCorrect = await verifyPassword(password, user.password_hash);

  if (!passwordIsCorrect) {
    return null;
  }

  delete user.password_hash;

  return user;
};



const getAllUsers = async () => {
  const query = `
  SELECT u.name, u.email, r.role_name
  FROM users u
  JOIN roles r
  ON u.role_id = r.role_id
  WHERE r.role_id = '1'
  ORDER BY u.name
  `;
  
  const result = await db.query(query);

  return result.rows;
};


const addVolunteersToProjects = async (projectId, userId) => {
  const query = `
    INSERT INTO service_project_volunteer(project_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (project_id, user_id) DO NOTHING
    
    `;

  await db.query(query, [projectId, userId]);

}
const removeVolunteersFromProjects = async (projectId, userId) => {
  const query = `
  DELETE FROM service_project_volunteer
  WHERE project_id = $1 AND user_id = $2;
  `;

  await db.query(query, [projectId, userId]);
}

const getAllVolunteeredProjects = async (userId) => {
  const query = `
  SELECT
    sp.project_id,
    sp.title,
    sp.project_date,
    sp.location
  FROM service_project sp
  JOIN service_project_volunteer spv
  ON sp.project_id = spv.project_id
  WHERE spv.user_id = $1
  ORDER BY sp.project_date ASC, sp.project_id ASC
  `;
  const result = await db.query(query, [userId]);

  return result.rows;

};

const isUserVolunteering = async (projectId, userId) => {
  const query = `
  SELECT EXISTS(
  SELECT 1
  FROM service_project_volunteer
  WHERE project_id =$1 AND user_id = $2
  ) AS is_voluntering
  
  `;
  
  const result = await db.query(query, [projectId, userId]);

  return result.rows[0].isUserVolunteering;
}




export {
  createUser,
  authenticateUser,
  getAllUsers,
  addVolunteersToProjects,
  removeVolunteersFromProjects,
  getAllVolunteeredProjects,
  isUserVolunteering
};