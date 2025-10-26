DELETE FROM job_skills;
DELETE FROM applications;
DELETE FROM enrollments;
DELETE FROM courses;
DELETE FROM jobs;
DELETE FROM users;

INSERT INTO users (id, name, email, password, role, skills, bio, is_mentor)
VALUES
    (1, 'Acme Corp', 'client@skilllink.com', '$2a$10$E1nvnUbMJ1ZkWVeG2YnwsOS0/90q/n/Li/YoRTydM9xWBMlFI4vb2', 'CLIENT', 'project management,communication', 'Trusted client with recurring gigs.', false),
    (2, 'Maya Freelancer', 'maya@skilllink.com', '$2a$10$E1nvnUbMJ1ZkWVeG2YnwsOS0/90q/n/Li/YoRTydM9xWBMlFI4vb2', 'FREELANCER', 'react,spring,teaching', 'Full-stack developer and mentor.', true),
    (3, 'Leo Learner', 'leo@skilllink.com', '$2a$10$E1nvnUbMJ1ZkWVeG2YnwsOS0/90q/n/Li/YoRTydM9xWBMlFI4vb2', 'LEARNER', 'javascript,ui/ux', 'Design enthusiast leveling up dev skills.', false);

ALTER TABLE users ALTER COLUMN id RESTART WITH 4;

INSERT INTO jobs (id, title, description, budget, client_id, freelancer_id, status, created_at)
VALUES
    (1, 'React Landing Page', 'Build a responsive marketing site for our new product launch.', 1200.00, 1, NULL, 'OPEN', CURRENT_TIMESTAMP),
    (2, 'Backend API Hardening', 'Improve security posture for our Spring Boot microservices.', 1800.00, 1, 2, 'IN_PROGRESS', CURRENT_TIMESTAMP);

ALTER TABLE jobs ALTER COLUMN id RESTART WITH 3;

INSERT INTO job_skills (job_id, skill) VALUES
    (1, 'React'),
    (1, 'TailwindCSS'),
    (1, 'SEO'),
    (2, 'Spring Boot'),
    (2, 'Security'),
    (2, 'MySQL');

INSERT INTO courses (id, mentor_id, title, description, video_url, price, created_at)
VALUES
    (1, 2, 'Full-Stack Freelancing Masterclass', 'Accelerate your freelancing career with real-world projects and mentorship.', 'https://videos.skilllink.com/fullstack-freelancing', 99.00, CURRENT_TIMESTAMP),
    (2, 2, 'React UI Essentials', 'Hands-on guide to building polished interfaces with React and MUI.', 'https://videos.skilllink.com/react-ui-essentials', 79.00, CURRENT_TIMESTAMP);

ALTER TABLE courses ALTER COLUMN id RESTART WITH 3;

INSERT INTO enrollments (id, course_id, learner_id, enrolled_at)
VALUES
    (1, 1, 3, CURRENT_TIMESTAMP);

ALTER TABLE enrollments ALTER COLUMN id RESTART WITH 2;

INSERT INTO applications (id, job_id, freelancer_id, status, applied_at)
VALUES
    (1, 1, 2, 'APPLIED', CURRENT_TIMESTAMP);

ALTER TABLE applications ALTER COLUMN id RESTART WITH 2;
