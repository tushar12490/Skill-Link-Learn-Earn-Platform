SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS job_skills;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    skills TEXT,
    bio TEXT,
    is_mentor TINYINT(1) NOT NULL DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(15, 2) NOT NULL,
    client_id BIGINT NOT NULL,
    freelancer_id BIGINT,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_jobs_client FOREIGN KEY (client_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_jobs_freelancer FOREIGN KEY (freelancer_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_jobs_status ON jobs (status);
CREATE INDEX idx_jobs_client ON jobs (client_id);
CREATE INDEX idx_jobs_freelancer ON jobs (freelancer_id);

CREATE TABLE job_skills (
    job_id BIGINT NOT NULL,
    skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (job_id, skill),
    CONSTRAINT fk_job_skills_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    mentor_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    video_url VARCHAR(512),
    price DECIMAL(15, 2) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_courses_mentor FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_courses_mentor ON courses (mentor_id);

CREATE TABLE enrollments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    learner_id BIGINT NOT NULL,
    enrolled_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_enrollments_learner FOREIGN KEY (learner_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_enrollments UNIQUE (course_id, learner_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_enrollments_course ON enrollments (course_id);
CREATE INDEX idx_enrollments_learner ON enrollments (learner_id);

CREATE TABLE applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    job_id BIGINT NOT NULL,
    freelancer_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_applications_freelancer FOREIGN KEY (freelancer_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_applications UNIQUE (job_id, freelancer_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_applications_status ON applications (status);
CREATE INDEX idx_applications_job ON applications (job_id);
CREATE INDEX idx_applications_freelancer ON applications (freelancer_id);
