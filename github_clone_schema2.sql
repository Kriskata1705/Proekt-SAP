CREATE DATABASE github;

USE github;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO roles (name) VALUES
('AUTHOR'),
('REVIEWER'),
('READER'),
('ADMIN');

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active_version_id INT NULL,

    CONSTRAINT fk_document_author
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    version_number INT NOT NULL,
    content LONGTEXT NOT NULL,
    status ENUM('DRAFT','PENDING','APPROVED','REJECTED') NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_version_document
        FOREIGN KEY (document_id) REFERENCES documents(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_version_author
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT unique_document_version
        UNIQUE (document_id, version_number)
) ENGINE=InnoDB;

ALTER TABLE documents
ADD CONSTRAINT fk_active_version
FOREIGN KEY (active_version_id)
REFERENCES versions(id)
ON DELETE SET NULL;

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_version
        FOREIGN KEY (version_id) REFERENCES versions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    status ENUM('APPROVED','REJECTED') NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_approval_version
        FOREIGN KEY (version_id) REFERENCES versions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_approval_reviewer
        FOREIGN KEY (reviewer_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type ENUM('DOCUMENT','VERSION','USER') NOT NULL,
    entity_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_versions_document ON versions(document_id);
CREATE INDEX idx_comments_version ON comments(version_id);
CREATE INDEX idx_approvals_version ON approvals(version_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);

SELECT MAX(version_number)
FROM versions
WHERE document_id = ?;

SELECT v.*, u.username
FROM versions v
JOIN users u ON v.created_by = u.id
WHERE v.document_id = ?
ORDER BY v.version_number DESC;