CREATE DATABASE IF NOT EXISTS github_clone;
USE github_clone;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(255),
    location VARCHAR(100),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE repositories (
    repo_id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    repo_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    default_branch VARCHAR(50) DEFAULT 'main',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_repo_per_user (owner_id, repo_name)
);

CREATE TABLE branches (
    branch_id INT PRIMARY KEY AUTO_INCREMENT,
    repo_id INT NOT NULL,
    branch_name VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (repo_id) REFERENCES repositories(repo_id) ON DELETE CASCADE,
    UNIQUE KEY unique_branch_per_repo (repo_id, branch_name)
);

CREATE TABLE commits (
    commit_id INT PRIMARY KEY AUTO_INCREMENT,
    commit_hash VARCHAR(40) NOT NULL UNIQUE,
    repo_id INT NOT NULL,
    branch_id INT NOT NULL,
    author_id INT NOT NULL,
    parent_commit_id INT,
    commit_message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (repo_id) REFERENCES repositories(repo_id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_commit_id) REFERENCES commits(commit_id) ON DELETE SET NULL
);
CREATE TABLE files (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    repo_id INT NOT NULL,
    branch_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (repo_id) REFERENCES repositories(repo_id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE CASCADE,
    UNIQUE KEY unique_file_path (repo_id, branch_id, file_path)
);

CREATE TABLE file_contents (
    content_id INT PRIMARY KEY AUTO_INCREMENT,
    file_id INT NOT NULL,
    commit_id INT NOT NULL,
    content LONGTEXT,
    content_hash VARCHAR(40),

    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE,
    FOREIGN KEY (commit_id) REFERENCES commits(commit_id) ON DELETE CASCADE
);

CREATE TABLE pull_requests (
    pr_id INT PRIMARY KEY AUTO_INCREMENT,
    repo_id INT NOT NULL,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source_branch_id INT NOT NULL,
    target_branch_id INT NOT NULL,
    status ENUM('open', 'closed', 'merged') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    merged_at TIMESTAMP NULL,
    merged_by INT,

    FOREIGN KEY (repo_id) REFERENCES repositories(repo_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (source_branch_id) REFERENCES branches(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (target_branch_id) REFERENCES branches(branch_id) ON DELETE CASCADE,
    FOREIGN KEY (merged_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE issues (
    issue_id INT PRIMARY KEY AUTO_INCREMENT,
    repo_id INT NOT NULL,
    author_id INT NOT NULL,
    issue_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('open', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,

    FOREIGN KEY (repo_id) REFERENCES repositories(repo_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_issue_number (repo_id, issue_number)
);

CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    author_id INT NOT NULL,
    content TEXT NOT NULL,
    issue_id INT,
    pr_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (issue_id) REFERENCES issues(issue_id) ON DELETE CASCADE,
    FOREIGN KEY (pr_id) REFERENCES pull_requests(pr_id) ON DELETE CASCADE
);

CREATE TABLE labels (
    label_id INT PRIMARY KEY AUTO_INCREMENT,
    repo_id INT NOT NULL,
    label_name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#000000',
    description VARCHAR(255),

    FOREIGN KEY (repo_id) REFERENCES repositories(repo_id) ON DELETE CASCADE,
    UNIQUE KEY unique_label_per_repo (repo_id, label_name)
);

CREATE TABLE issue_labels (
    issue_id INT NOT NULL,
    label_id INT NOT NULL,

    PRIMARY KEY (issue_id, label_id),
    FOREIGN KEY (issue_id) REFERENCES issues(issue_id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels(label_id) ON DELETE CASCADE
);

CREATE TABLE pr_labels (
    pr_id INT NOT NULL,
    label_id INT NOT NULL,

    PRIMARY KEY (pr_id, label_id),
    FOREIGN KEY (pr_id) REFERENCES pull_requests(pr_id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels(label_id) ON DELETE CASCADE
);

CREATE TABLE stars (
    star_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    repo_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (repo_id) REFERENCES repositories(repo_id) ON DELETE CASCADE,
    UNIQUE KEY unique_star (user_id, repo_id)
);

CREATE TABLE forks (
    fork_id INT PRIMARY KEY AUTO_INCREMENT,
    original_repo_id INT NOT NULL,
    forked_repo_id INT NOT NULL,
    forked_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (original_repo_id) REFERENCES repositories(repo_id) ON DELETE CASCADE,
    FOREIGN KEY (forked_repo_id) REFERENCES repositories(repo_id) ON DELETE CASCADE,
    FOREIGN KEY (forked_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE followers (
    follow_id INT PRIMARY KEY AUTO_INCREMENT,
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (follower_id, following_id)
);

CREATE TABLE collaborators (
    collab_id INT PRIMARY KEY AUTO_INCREMENT,
    repo_id INT NOT NULL,
    user_id INT NOT NULL,
    permission_level ENUM('read', 'write', 'admin') DEFAULT 'read',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (repo_id) REFERENCES repositories(repo_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_collaborator (repo_id, user_id)
);

CREATE TABLE commit_files (
    commit_id INT NOT NULL,
    file_id INT NOT NULL,
    change_type ENUM('added', 'modified', 'deleted') NOT NULL,
    lines_added INT DEFAULT 0,
    lines_deleted INT DEFAULT 0,

    PRIMARY KEY (commit_id, file_id),
    FOREIGN KEY (commit_id) REFERENCES commits(commit_id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE CASCADE
);

CREATE INDEX idx_repos_owner ON repositories(owner_id);
CREATE INDEX idx_commits_repo ON commits(repo_id);
CREATE INDEX idx_commits_author ON commits(author_id);
CREATE INDEX idx_commits_branch ON commits(branch_id);
CREATE INDEX idx_prs_repo ON pull_requests(repo_id);
CREATE INDEX idx_prs_status ON pull_requests(status);
CREATE INDEX idx_issues_repo ON issues(repo_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_comments_issue ON comments(issue_id);
CREATE INDEX idx_comments_pr ON comments(pr_id);
CREATE INDEX idx_files_repo ON files(repo_id);
