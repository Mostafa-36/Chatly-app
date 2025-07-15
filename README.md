# 💬 Chatly App – Full-Stack Real-Time Chat Application

🔗 **Live Demo:** _Coming Soon_

Welcome to **Chatly App**, a powerful and modern full-stack real-time chat application built from scratch using the **MERN stack** and **WebSockets**.

This app allows users to sign up, log in, send messages and images in real-time, customize themes, update profiles, and much more — all with a beautiful and fully responsive UI.

---

## ✨ Overview

Chatly App is a personal project I built to master full-stack development with real-time communication. The focus was on:

- 🧩 Clean, reusable components with **compound component pattern**
- 📦 Modular backend with **centralized error handling**
- ⚡ Real-time communication using **Socket.IO**
- 🎨 30+ theme options with full responsiveness
- ✅ Scalable architecture and best practices

---

## ✨ Features

- ✅ Signup & login with JWT authentication
- 📷 Upload & share images using Cloudinary
- 🟢 Show online/offline user status instantly
- 🎭 Update profile photo from the UI
- 🎨 Choose from 30+ customizable themes
- 📱 Fully responsive for mobile, tablet, and desktop
- 🦴 Message skeletons for loading states
- 🔐 Authentication (Signup / Login) using **JWT**
- 💬 Real-time messaging with **WebSockets**
- 🧠 Clean architecture using **compound component pattern**
- ♻️ Reusable and maintainable code (frontend & backend)
- ⚠️ Toast notifications & global error handling
- 🦴 Loading skeletons for better UX

---

## 🛠️ Tech Stack

### 🧠 Backend:

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT (jsonwebtoken)
- bcryptjs
- Cloudinary
- cookie-parser

### 🎨 Frontend:

- React (with Vite)
- Tailwind CSS
- DaisyUI
- Zustand (state management)
- React Hook Form
- React Hot Toast
- React Router DOM
- Axios
- Lucide React (icons)
- Socket.IO Client

---

## 📁 Project Structure

```
chatly-app/
├── client/ # Frontend (React)
│ ├── components/
│ ├── constants/
│ ├── lib/
│ ├── pages/
│ ├── store/
│ └── ...
├── server/ # Backend (Express)
│ ├── controllers/
│ ├── errors/
│ ├── lib/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── seeds/
│ ├── utils/
│ └── ...
```

---

## 🧪 Security Highlights

- Passwords are hashed using **bcryptjs**
- JWT tokens are securely signed and stored
- Cookies are parsed and managed safely
- User input is validated and sanitized

---

### Setup .env file

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run this app locally

```shell
npm run build
```

### Start the app

```shell
npm run start
```
