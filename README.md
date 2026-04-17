# 🚗 Used Car Auction System

A full-stack web application that allows users to list cars for auction, place bids, and manage car listings securely.

Built using **Spring Boot (Backend)** and **React (Frontend)** following modern full-stack architecture.

---

## 📌 Features

### 👤 User Features
- User registration and login
- Browse available cars for auction
- Place bids on cars
- View bid history
- Secure authentication using JWT

### 🛠️ Admin Features
- Add car listings
- Manage auctions
- View users and bids
- Control auction status

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- JavaScript
- CSS
- Axios

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- JPA / Hibernate
- REST APIs

### Database
- MySQL / H2 (based on your configuration)

---

## 📂 Project Structure

```
used-car-auction
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── .env.example
│
├── backend
│   ├── src/main/java/com/auction
│   │   ├── config
│   │   ├── controller
│   │   ├── dto
│   │   ├── entity
│   │   ├── exception
│   │   ├── repository
│   │   ├── security
│   │   ├── service
│   │   └── UsedCarAuctionApplication.java
│   │
│   ├── src/main/resources
│   │   └── application.properties
│   │
│   ├── pom.xml
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### 1️⃣ Clone repository


git clone https://github.com/your-username/used-car-auction.git

cd used-car-auction


---

### 2️⃣ Setup Backend (Spring Boot)

Navigate to backend folder:


cd backend


Run application:


mvn spring-boot:run


Backend runs on:

http://localhost:8080


---

### 3️⃣ Setup Frontend (React)

Navigate to frontend folder:


cd frontend


Install dependencies:


npm install


Run frontend:


npm run dev


Frontend runs on:

http://localhost:5173


---

## 🔐 Environment Variables

Create `.env` file in frontend:


VITE_API_URL=http://localhost:8080


---

## 📡 API Endpoints (Sample)

| Method | Endpoint | Description |
|-------|---------|------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login |
| GET | /cars | Get all cars |
| POST | /bids | Place bid |

---

## 🚀 Future Improvements

- Payment integration
- Real-time bidding using WebSockets
- Email notifications
- Image upload to cloud storage
- Admin dashboard improvements

---

## 👨‍💻 Author

Harsh

---

## 📄 License

This project is for educational purposes.
