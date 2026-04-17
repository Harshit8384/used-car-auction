# Used Car Auction - Backend (Spring Boot + MySQL + JWT)

## Tech Stack
- Java 17
- Spring Boot 3.2.4
- Spring Security + JWT (JJWT 0.11.5)
- Spring Data JPA + Hibernate
- MySQL 8
- Lombok
- Maven

---

## Prerequisites — Install These First

| Software        | Version  | Download Link                                      |
|-----------------|----------|----------------------------------------------------|
| JDK 17          | 17+      | https://adoptium.net                               |
| Maven           | 3.8+     | https://maven.apache.org/download.cgi              |
| MySQL           | 8.0+     | https://dev.mysql.com/downloads/mysql/             |
| Postman (test)  | any      | https://www.postman.com/downloads/                 |

---

## Database Setup

Open MySQL and run:
```sql
CREATE DATABASE used_car_auction;
```

In `src/main/resources/application.properties`, set your MySQL credentials:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

Tables are created automatically by Hibernate on first run (`ddl-auto=update`).

---

## Run the Backend

```bash
cd used-car-auction-backend
mvn spring-boot:run
```

Server starts at: **http://localhost:8080**

On first run, the DataSeeder automatically creates:
- Admin user:       admin@auction.com   / admin123
- Demo seller:      seller@auction.com  / seller123
- 5 sample car listings

---

## API Endpoints

### Auth (Public)
| Method | URL                    | Body                                      |
|--------|------------------------|-------------------------------------------|
| POST   | /api/auth/register     | { name, email, password, phoneNumber }    |
| POST   | /api/auth/login        | { email, password }                       |

### Cars (GET = Public, Others = Auth Required)
| Method | URL                        | Description               |
|--------|----------------------------|---------------------------|
| GET    | /api/cars                  | Get all cars              |
| GET    | /api/cars?make=&status=    | Search/filter cars        |
| GET    | /api/cars/active           | Only active auctions      |
| GET    | /api/cars/{id}             | Get single car            |
| POST   | /api/cars                  | List a new car            |
| PUT    | /api/cars/{id}             | Update car listing        |
| DELETE | /api/cars/{id}             | Delete car listing        |
| GET    | /api/cars/my-listings      | My listed cars            |

### Bids (Auth Required)
| Method | URL                        | Description               |
|--------|----------------------------|---------------------------|
| POST   | /api/bids                  | Place a bid               |
| GET    | /api/bids/car/{carId}      | Get all bids for a car    |
| GET    | /api/bids/car/{carId}/highest | Get highest bid        |
| GET    | /api/bids/my-bids          | My bid history            |

### User
| Method | URL                        | Description               |
|--------|----------------------------|---------------------------|
| GET    | /api/users/me              | Get my profile            |
| PUT    | /api/users/me              | Update profile/password   |

### Admin (ADMIN role only)
| Method | URL                        | Description               |
|--------|----------------------------|---------------------------|
| GET    | /api/admin/users           | List all users            |
| DELETE | /api/admin/users/{id}      | Delete a user             |
| PUT    | /api/admin/users/{id}/promote | Promote to admin       |

---

## Using the API (Postman)

1. POST `/api/auth/login` → copy the `token` from response
2. For protected routes, add Header: `Authorization: Bearer <token>`

### Example — Place a Bid
```json
POST /api/bids
{
  "carId": 1,
  "amount": 520000
}
```

### Example — List a Car
```json
POST /api/cars
{
  "make": "Honda",
  "model": "City",
  "year": 2021,
  "color": "White",
  "mileage": 30000,
  "fuelType": "Petrol",
  "transmission": "Automatic",
  "description": "Well maintained, single owner.",
  "startingPrice": 700000,
  "auctionEndTime": "2026-04-25T18:00:00"
}
```

---

## Project Structure

```
src/main/java/com/auction/
├── UsedCarAuctionApplication.java   ← Main class
├── config/
│   ├── SecurityConfig.java          ← JWT + CORS + route protection
│   └── DataSeeder.java              ← Seeds default data on startup
├── controller/
│   ├── AuthController.java          ← /api/auth/*
│   ├── CarController.java           ← /api/cars/*
│   ├── BidController.java           ← /api/bids/*
│   └── UserController.java          ← /api/users/*, /api/admin/*
├── service/
│   ├── AuthService.java             ← Register, login, JWT generation
│   ├── CarService.java              ← Car CRUD + auction status refresh
│   ├── BidService.java              ← Bid placement + validation
│   └── UserService.java             ← Profile, admin management
├── repository/
│   ├── UserRepository.java
│   ├── CarRepository.java
│   └── BidRepository.java
├── entity/
│   ├── User.java                    ← users table
│   ├── Car.java                     ← cars table
│   └── Bid.java                     ← bids table
├── dto/
│   ├── AuthDTO.java                 ← Login/register request+response
│   ├── CarDTO.java                  ← Car request+response
│   └── BidDTO.java                  ← Bid request+response
├── security/
│   ├── JwtUtil.java                 ← Token generate/validate
│   └── JwtAuthFilter.java           ← Request interceptor
└── exception/
    └── GlobalExceptionHandler.java  ← Validation + runtime errors
```

---

## Frontend Integration

React frontend should call:
- Base URL: `http://localhost:8080`
- Set header on every protected call: `Authorization: Bearer <token>`

CORS is pre-configured for `http://localhost:5173` and `http://localhost:3000`.
