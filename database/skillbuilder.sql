-- Disable foreign key checks to avoid drop errors
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables in proper order (child → parent)
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `certificates`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `users`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;


-- Create Database
CREATE DATABASE IF NOT EXISTS `skillbridge`;
USE `skillbridge`;


-- Table: users

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','recruiter') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES 
(1,'Ravi Kumar','ravi@student.com','12345','student','2025-09-10 20:47:32'),
(2,'Ananya Singh','ananya@student.com','12345','student','2025-09-10 20:47:32'),
(3,'TechStart Pvt Ltd','hr@techstart.com','12345','recruiter','2025-09-10 20:47:32'),
(4,'Helping Hands NGO','admin@helpinghands.org','12345','recruiter','2025-09-10 20:47:32');


-- Table: tasks

CREATE TABLE `tasks` (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `recruiter_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `skills_required` varchar(255) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `slots` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`),
  KEY `recruiter_id` (`recruiter_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`recruiter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `tasks` VALUES 
(1,3,'Design Event Poster','Poster for hackathon.','Canva, Photoshop','2025-09-20',1,'2025-09-10 20:47:32'),
(2,4,'Write Blog Article','Blog on environment.','Content Writing','2025-09-18',2,'2025-09-10 20:47:32');


-- Table: applications

CREATE TABLE `applications` (
  `app_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `student_id` int NOT NULL,
  `status` enum('applied','selected','rejected','completed') DEFAULT 'applied',
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`app_id`),
  KEY `task_id` (`task_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `applications` VALUES 
(1,1,1,'applied','2025-09-10 20:47:32'),
(2,1,2,'applied','2025-09-10 20:47:32'),
(3,2,1,'selected','2025-09-10 20:47:32');


-- Table: certificates

CREATE TABLE `certificates` (
  `cert_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `task_id` int NOT NULL,
  `issue_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `pdf_link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cert_id`),
  KEY `student_id` (`student_id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `certificates_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `certificates` VALUES 
(1,1,2,'2025-09-10 20:47:32','certificates/ravi_blog_certificate.pdf');


-- Table: submissions

CREATE TABLE `submissions` (
  `submission_id` int NOT NULL AUTO_INCREMENT,
  `app_id` int NOT NULL,
  `file_link` varchar(255) DEFAULT NULL,
  `comments` text,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`submission_id`),
  KEY `app_id` (`app_id`),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `applications` (`app_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `submissions` VALUES 
(1,3,'uploads/ravi_blog.pdf','Completed blog article on environment','2025-09-10 20:47:32');


-- Final checks

SHOW DATABASES;
USE skillbridge;
SHOW TABLES;
