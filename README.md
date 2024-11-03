# Xelsem

## Overview
Xelsem is a web application known as **Xelsem Books** that allows users to upload, view, and read books online. This platform provides an easy-to-use interface for book lovers to access a diverse collection of books, share their own, and enjoy reading from anywhere.

## Features
- **User Registration and Authentication**: Users can create accounts and log in securely.
- **Upload Books**: Registered users can upload their books in various formats (PDF, EPUB, etc.).
- **Browse and Search**: Users can browse through a collection of books or search for specific titles or authors.
- **Read Online**: Users can read books directly in their browser without the need for downloads.
- **User Reviews and Ratings**: Users can leave reviews and ratings for books they have read.
- **Responsive Design**: The application is designed to be responsive, ensuring a great experience on both desktop and mobile devices.

## Tech Stack
- **Frontend**: React.js
- **Backend**: PHP
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT) or session-based authentication
- **File Storage**: Local storage or cloud storage (e.g., AWS S3)

## Installation

### Prerequisites
- Node.js and npm installed on your machine.
- PHP and a local server (like XAMPP or MAMP).
- MySQL database.

### Clone the Repository

git clone https://https://github.com/Kidusan-Teklu/Xelsem
Frontend Setup
Navigate to the frontend directory:
Copy
cd frontend
Install dependencies:
Copy
npm install
Backend Setup
Navigate to the backend directory:
Copy
cd backend
Set up your MySQL database and import the SQL schema provided in the database folder.
Environment Variables
Create a .env file in the backend directory and add the following variables:


DB_HOST="localhost"
DB_USER="root"
DB_PASS=""
DB_NAME="xelsem"

 ### Start the Application
Start the backend server (e.g., using XAMPP for PHP).
Start the React frontend:

npm start
The application will be available at http://localhost:3000.
Usage
Register: Create a new account or log in if you already have one.
Upload Books: Navigate to the upload section to add your books.
Browse Books: Explore the library and find books to read.
Read Online: Click on any book to start reading directly in your browser.
Contributing
Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

### License
This project is licensed under the Apache-2.0 License - see the LICENSE file for details.

### Acknowledgments
Special Thanks to Sorardi plc for providig enternship position at there organization and for making me Work on this Project.
Thanks to the contributors and the open-source community for their support and resources.
