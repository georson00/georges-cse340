--==================================
--Organization Table
--==================================
CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);

--====================================
-- Insert data to Organizations
--====================================
INSERT INTO organization (name, description, contact_email, logo_filename) 
VALUES ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


--=====================================================
-- Service Projects Table
--=====================================================
CREATE TABLE service_project (
    project_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_service_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
--====================================
-- Insert data to Service Projects
--====================================
INSERT INTO service_project (
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES
    -- Projects sponsored by Organization 1
    (
        1,
        'Community Food Drive',
        'Collect and distribute food packages to families in need.',
        'Freeport Community Center',
        DATE '2026-10-03'
    ),
    (
        1,
        'Winter Clothing Collection',
        'Collect coats, gloves, and other winter clothing for local residents.',
        'Freeport Public Library',
        DATE '2026-10-17'
    ),
    (
        1,
        'Senior Grocery Assistance',
        'Help senior residents shop for groceries and deliver their purchases.',
        'Freeport Senior Center',
        DATE '2026-11-07'
    ),
    (
        1,
        'Holiday Meal Distribution',
        'Prepare and distribute holiday meals to underserved families.',
        'Atlantic Avenue Community Hall',
        DATE '2026-11-21'
    ),
    (
        1,
        'Family Resource Fair',
        'Connect families with food, housing, employment, and health resources.',
        'Freeport Recreation Center',
        DATE '2026-12-05'
    ),

    -- Projects sponsored by Organization 2
    (
        2,
        'Neighborhood Cleanup',
        'Remove litter and improve shared public spaces in the neighborhood.',
        'Main Street Park',
        DATE '2026-10-10'
    ),
    (
        2,
        'Community Garden Restoration',
        'Clean, repair, and prepare a community garden for planting.',
        'Riverside Community Garden',
        DATE '2026-10-24'
    ),
    (
        2,
        'Tree Planting Day',
        'Plant trees to improve neighborhood green spaces and air quality.',
        'Brookside Park',
        DATE '2026-11-14'
    ),
    (
        2,
        'Beach Cleanup Project',
        'Collect waste and recyclable materials along the shoreline.',
        'Jones Beach State Park',
        DATE '2026-11-28'
    ),
    (
        2,
        'Recycling Awareness Workshop',
        'Teach residents how to reduce waste and recycle correctly.',
        'Nassau Community Hall',
        DATE '2026-12-12'
    ),

    -- Projects sponsored by Organization 3
    (
        3,
        'School Supply Donation',
        'Collect notebooks, backpacks, and other supplies for students.',
        'Central Elementary School',
        DATE '2026-10-31'
    ),
    (
        3,
        'Youth Coding Workshop',
        'Introduce local students to basic programming and web development.',
        'Long Island Technology Center',
        DATE '2026-11-08'
    ),
    (
        3,
        'After-School Tutoring Day',
        'Provide academic support in mathematics, reading, and science.',
        'Roosevelt Youth Center',
        DATE '2026-11-15'
    ),
    (
        3,
        'Career Readiness Seminar',
        'Help young adults prepare résumés and practice interview skills.',
        'Hempstead Public Library',
        DATE '2026-12-06'
    ),
    (
        3,
        'Children’s Book Donation',
        'Collect and distribute age-appropriate books to local children.',
        'Uniondale Community Center',
        DATE '2026-12-19'
    );

--==============================================
--Category Table Creation
--===================================================
CREATE TABLE category (
    category_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE service_project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    CONSTRAINT pk_service_project_category
        PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES service_project (project_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES category (category_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


--==========================================================
--Data Insertion to Category
--==========================================================
INSERT INTO category (name)
VALUES
    ('Community Support'),
    ('Environmental Service'),
    ('Education and Youth Development');
--===================================================
--Check if table exist
--===================================================
SELECT category_id, name
FROM category
ORDER BY category_id;

--======================================================
--Associate each project in your database with at least one category
--=====================================================
INSERT INTO service_project_category (
    project_id,
    category_id
)
SELECT
    sp.project_id,
    c.category_id
FROM (
    VALUES
        ('Community Food Drive', 'Community Support'),
        ('Winter Clothing Collection', 'Community Support'),
        ('Senior Grocery Assistance', 'Community Support'),
        ('Holiday Meal Distribution', 'Community Support'),
        ('Family Resource Fair', 'Community Support'),

        ('Neighborhood Cleanup', 'Environmental Service'),
        ('Community Garden Restoration', 'Environmental Service'),
        ('Tree Planting Day', 'Environmental Service'),
        ('Beach Cleanup Project', 'Environmental Service'),
        ('Recycling Awareness Workshop', 'Environmental Service'),

        ('School Supply Donation', 'Education and Youth Development'),
        ('Youth Coding Workshop', 'Education and Youth Development'),
        ('After-School Tutoring Day', 'Education and Youth Development'),
        ('Career Readiness Seminar', 'Education and Youth Development'),
        ('Children’s Book Donation', 'Education and Youth Development')
) AS assignments(project_title, category_name)
INNER JOIN service_project AS sp
    ON sp.title = assignments.project_title
INNER JOIN category AS c
    ON c.name = assignments.category_name
ON CONFLICT (project_id, category_id) DO NOTHING;

--====================================================
--Verify that every project has at least one category
--======================================================
SELECT
    sp.project_id,
    sp.title,
    COUNT(spc.category_id) AS category_count
FROM service_project AS sp
LEFT JOIN service_project_category AS spc
    ON sp.project_id = spc.project_id
GROUP BY sp.project_id, sp.title
ORDER BY sp.project_id;