# BidDrive — Used Car Auction Frontend

React + Vite + Tailwind frontend for a Spring Boot used-car auction backend.

## Stack
- React 18, React Router v6
- Axios (with JWT interceptor + auto-logout on 401)
- Tailwind CSS (dark premium theme: charcoal + amber)
- Vite

## Setup

```bash
npm install
cp .env.example .env   # then edit VITE_API_BASE_URL if your backend isn't on localhost:8080
npm run dev
```

Open http://localhost:5173

## Backend requirements

Your Spring Boot backend must:

1. Run on the URL set in `.env` (`VITE_API_BASE_URL`, default `http://localhost:8080`)
2. **Enable CORS** for the frontend origin. Add a `WebMvcConfigurer` bean:

   ```java
   @Configuration
   public class CorsConfig implements WebMvcConfigurer {
     @Override
     public void addCorsMappings(CorsRegistry registry) {
       registry.addMapping("/api/**")
         .allowedOrigins("http://localhost:5173")
         .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
         .allowedHeaders("*");
     }
   }
   ```

3. Expose these endpoints (already in your spec):
   - `POST /api/auth/register`, `POST /api/auth/login`
   - `GET /api/cars`, `GET /api/cars/{id}`, `POST /api/cars`
   - `POST /api/bids`, `GET /api/bids/car/{id}`
   - `GET /api/users/profile`, `PUT /api/users/profile`

## Roles

The UI supports three roles: `USER`, `SELLER`, `ADMIN`.
- USER: bid, dashboard, profile
- SELLER: USER + list cars (`/sell/new`, `/sell/listings`)
- ADMIN: all of the above

The role comes from the login response (`role` field).

## Folder structure

```
src/
 ├── components/   Navbar, CarCard, BidForm, ProtectedRoute
 ├── pages/        Home, CarDetails, Login, Register, Dashboard, AddCar, MyListings, Profile, NotFound
 ├── services/     api (axios instance), authService, carService, bidService, userService
 ├── context/      AuthContext
 ├── utils/        format helpers (INR, dates, time-left)
 ├── App.jsx
 └── main.jsx
```

## Notes

- JWT is stored in `localStorage` under key `token`; user info under `user`.
- Bid history auto-refreshes every 10 seconds on the Car Details page (real-time-ish).
- "My Listings" filters by `sellerName === user.name` since the spec doesn't include a per-seller endpoint. If you add one (e.g. `GET /api/cars/mine`), update `MyListings.jsx`.
