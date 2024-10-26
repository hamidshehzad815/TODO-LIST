-- Drop existing database if it exists
DROP DATABASE IF EXISTS task_management;

-- Create new database
CREATE DATABASE task_management;

-- Use the newly created database
USE task_management;

-- Create User table
CREATE TABLE User (
    userId int NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    UNIQUE (username),
    UNIQUE (email),
    PRIMARY KEY (userId)
);

-- Create Review table
CREATE TABLE Review (
    reviewId int NOT NULL AUTO_INCREMENT,
    userId int NOT NULL,
    reviewBody TEXT NOT NULL,
    PRIMARY KEY (reviewId),
    FOREIGN KEY (userId) REFERENCES User (userId) ON DELETE CASCADE
);

-- Create Task table
CREATE TABLE Task (
    taskId int NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500) DEFAULT NULL,
    dueDate DATE DEFAULT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'low',
    status ENUM('pending', 'completed') DEFAULT 'pending',
    createdBy int NOT NULL,
    updatedBy int DEFAULT NULL,
    assignedTo int DEFAULT NULL,  -- Changed to int
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (taskId),
    FOREIGN KEY (createdBy) REFERENCES User (userId) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES User (userId) ON DELETE SET NULL,  -- Updated reference
    FOREIGN KEY (updatedBy) REFERENCES User (userId) ON DELETE SET NULL
);

-- Create Comment table
CREATE TABLE Comment (
    commentId INT NOT NULL AUTO_INCREMENT,
    taskId INT NOT NULL,
    userId INT NOT NULL,
    commentBody TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (commentId),
    FOREIGN KEY (taskId) REFERENCES Task (taskId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES User (userId) ON DELETE CASCADE
);

-- Sample select queries
SELECT * FROM User;
SELECT * FROM Task ORDER BY priority;
