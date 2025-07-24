# 🎬 Movie Ticket Booking System

A full-stack **Movie Ticket Booking System** designed as part of the DBMS Mini Project at PES University (5th Semester, 2024). This application allows users to browse movies, book tickets, select seats, and view showtimes — with admin support for managing theatres, movies, and showtimes.

---

## 📚 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributors](#contributors)

---

## 📖 Project Overview

This system allows users to:
- Register and log in
- Browse movies and theatres
- Select showtimes and seats
- Book and pay for tickets
- View their booking history

Admins can:
- Manage theatres and screens
- Add movies and showtimes
- View all bookings

The backend is built using **Node.js**, **Express**, and **MySQL**, while the frontend uses **ReactJS**.

---

## 🚀 Features

### 🔐 User Functionality
- Account registration, login, password reset
- Search movies by title, genre, or showtime
- Visual seat selection and real-time availability
- Secure booking and payment system
- Booking history with cancellation option

### 🛠️ Admin Features
- Add/edit/delete movies, showtimes, and theatres
- Auto-generate screens and seats on theatre creation

### 🧠 Database Triggers and Procedures
- Triggers auto-generate screens and seats
- Stored procedures for user booking data
- JSON-returning SQL function for booking info

---

## 🧰 Tech Stack

### 👨‍💻 Frontend
- ReactJS
- HTML/CSS

### 🔧 Backend
- Node.js
- Express

### 🗄️ Database
- MySQL
- Sequelize ORM

### 🧪 Tools and Packages
- `jsonwebtoken`, `bcryptjs` – Auth & Security
- `cors`, `nodemon`, `mysql2`, `insomnia`

---

## 🗂️ Database Schema

Includes the following tables:
- `User`, `Theater`, `Screen`, `Movie`, `Showtime`, `Seat`, `Booking`, `Booking_Seat`

Triggers:
- Auto-insert 5 screens on new theatre creation
- Auto-insert 50 seats per screen

Stored Procedures & Functions:
- `GetUserBookings(userName)`
- `GetBookingDetails(bookingID)` → returns JSON

##🎮 Usage
Register as a user
Browse and search movies
Select showtime and seats
Book and pay
View/cancel your bookings
Admin login to manage entities

