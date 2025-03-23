# Invigilator Management System (IMS)

A web-based application designed to streamline the management of invigilators in a college or university setting.

## Project Overview

The **Invigilator Management System (IMS)** provides an intuitive interface for both **admins** and **invigilators** to manage their tasks, ensuring efficient exam invigilation processes. This system is built using a modern tech stack, including **React** for the frontend, **Express** for the backend, **Tailwind CSS** for styling, and **MySQL** as the database.

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

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL (v5.7 or higher)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Invigilator-Management-System.git
   cd Invigilator-Management-System
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Configure the database:
   - Create a MySQL database
   - Update the database configuration in `server/config/config.js`

4. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASS=your_password
     DB_NAME=ims_database
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

5. Initialize the database:
   ```bash
   cd server
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

6. Start the application:
   ```bash
   # Start backend server
   cd server
   npm start
   
   # In a separate terminal, start frontend
   cd client
   npm start
   ```

7. Access the application:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## Usage

### Admin Access
- Default admin credentials:
  - Email: admin@example.com
  - Password: admin123

### Features
- Use the admin dashboard to manage invigilators, exams, and classrooms
- Assign invigilators to exams based on various criteria
- Monitor exam invigilation status through real-time updates
- Generate reports on invigilator assignments and exam coverage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

