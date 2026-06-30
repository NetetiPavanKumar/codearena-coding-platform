# CodeArena - Online Coding Platform 🚀

CodeArena is a full-stack online judge platform inspired by coding platforms like LeetCode.  
It allows users to solve programming problems, write and execute code, submit solutions, track progress, and manage problems through an admin dashboard.

## Features ✨

### 👨‍💻 User Features
- User authentication using JWT and cookies
- Browse programming problems
- Filter problems by difficulty/category
- Solve problems with an online code editor
- Run code against public test cases
- Submit solutions and get verdicts
- Track solved problems
- View submission history
- Auto-save code drafts while solving problems
- User profile with solving statistics

### 🛠️ Admin Features
- Role-based access control
- Add new problems
- Edit existing problems
- Delete problems
- Manage test cases
- Manage problem details
- Configure language-specific function templates and driver codes for code execution

### ⚡ Code Execution

- Supports multiple programming languages:
  - JavaScript
  - Python
  - Java
  - C

- Integrated with Judge0 API for online code execution
- Admin can configure language-specific function templates and driver codes while creating problems
- Combines user submitted code with predefined driver code before execution
- Executes solutions against test cases and validates output

## Tech Stack 🧑‍💻

### Frontend
- React.js
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cookie-based Authentication

### External Services
- Judge0 API for code execution

## Project Structure 📁


CodeArena
│
├── codehere # Frontend (React)
│
└── backend # Backend (Node + Express)


## Authentication 🔐

- JWT based authentication
- HTTP-only cookies
- Protected routes
- Role-based authorization (User/Admin)

## Database Models 🗄️

### User
Stores:
- User information
- Authentication details
- User roles

### Problem
Stores:
- Problem statement
- Examples
- Constraints
- Test cases
- Driver code templates

### Submission
Stores:
- Submitted code
- Language
- Verdict
- Execution details

### Draft
Stores:
- User code drafts
- Language-wise saved code