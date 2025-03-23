# Invigilator Management System (IMS)

## Project Overview
The **Invigilator Management System (IMS)** is a web-based application designed to streamline the management of invigilators in a college or university setting. This system is built using a modern tech stack, including **React** for the frontend, **Express** for the backend, **Tailwind CSS** for styling, and **MySQL** as the database. It provides an intuitive interface for both **admins** and **invigilators** to manage their tasks, ensuring efficient exam invigilation processes.

## Features
- **Admin Dashboard**: Admin users can manage invigilators, assign tasks, create exams, and filter invigilators based on various parameters (e.g., gender, address, etc.).
- **Invigilator Dashboard**: Invigilators can view their assigned tasks, accept or reject them, and track their work.
- **Exam Management**: Admins can create and assign exams to specific invigilators and classrooms.
- **Classroom Management**: Admins can add and manage classrooms, ensuring the availability of invigilators for every exam.
- **Audit Logs**: Track all activities and changes made by users within the system, ensuring transparency and accountability.
- **Search & Filtering**: Admins can search and filter invigilators and exams based on criteria such as gender, address, and more.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Express.js, Sequelize (for ORM)
- **Database**: MySQL
- **Authentication**: JWT-based authentication for secure login
- **Deployment**: Can be deployed to cloud services like Heroku or AWS

## Database Schema
The database consists of the following key entities:
- **Users**: Represents the users of the system (admins and invigilators).
- **Exams**: Stores details about the exams.
- **Classrooms**: Represents the available classrooms for exam invigilation.
- **Assignments**: Stores the assignment of invigilators to exams.
- **AuditLogs**: Tracks all user actions within the system.
- **ExamClassrooms**: Represents the relationship between exams and classrooms, including the number of required invigilators.

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Invigilator-Management-System.git


