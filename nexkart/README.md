# 🛒 NexKart — Full Stack E-Commerce Application

> **NexKart** is a modern, production-ready e-commerce platform built with Java Spring Boot backend and React frontend. Inspired by platforms like Flipkart and Amazon, it delivers a complete online shopping experience.

---

## 📸 Features

### 🛍️ Customer Features
- Browse products with advanced search, filtering, and sorting
- Product detail pages with image gallery, reviews & ratings
- Shopping cart with quantity management
- Multi-step checkout with address selection
- Multiple payment methods (COD, UPI, Card, Net Banking)
- Order tracking and history
- User profile and address management
- Product reviews and ratings

### ⚙️ Admin Features
- Admin dashboard with key metrics
- Full product CRUD (Add, Edit, Delete, Feature)
- Order management with status updates
- Category management
- Sales overview

### 🔐 Security
- JWT-based authentication
- Role-based access control (ADMIN / CUSTOMER)
- Password encryption with BCrypt

---

## 🧰 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18, Bootstrap 5, React Router |
| Backend     | Spring Boot 3.2, Spring Security    |
| Database    | MySQL 8+                            |
| Auth        | JWT (jjwt 0.12)                     |
| ORM         | Spring Data JPA / Hibernate         |
| API Testing | Postman                             |
| Build       | Maven (Backend), npm (Frontend)     |

---

## 📁 Project Structure

```
nexkart/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/com/nexkart/
│   │   ├── NexKartApplication.java
│   │   ├── config/             # Security & Web configs
│   │   ├── controller/         # REST Controllers
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── exception/          # Global exception handler
│   │   ├── model/              # JPA Entity classes
│   │   ├── repository/         # Spring Data JPA Repos
│   │   ├── security/           # JWT utilities & filters
│   │   └── service/            # Business logic
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                   # React Application
│   ├── public/index.html
│   └── src/
│       ├── App.js              # Main app with routing
│       ├── App.css             # Global styles
│       ├── components/         # Reusable components
│       │   ├── Navbar/
│       │   ├── Footer/
│       │   └── Product/
│       ├── context/            # Auth & Cart context
│       ├── pages/              # Page components
│       │   ├── HomePage.js
│       │   ├── ProductsPage.js
│       │   ├── ProductDetailPage.js
│       │   ├── CartPage.js
│       │   ├── CheckoutPage.js
│       │   ├── OrdersPage.js
│       │   ├── ProfilePage.js
│       │   ├── LoginPage.js
│       │   ├── RegisterPage.js
│       │   └── admin/
│       │       ├── AdminDashboardPage.js
│       │       ├── AdminProductsPage.js
│       │       └── AdminOrdersPage.js
│       └── services/
│           └── api.js          # Axios API service
│
├── database/
│   └── seed_data.sql           # DB seed script
└── postman/
    └── NexKart_API_Collection.json
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Java 17+** — [Download JDK](https://adoptium.net/)
- **Maven 3.8+** — [Download Maven](https://maven.apache.org/download.cgi)
- **Node.js 18+** — [Download Node.js](https://nodejs.org/)
- **MySQL 8+** — [Download MySQL](https://dev.mysql.com/downloads/)

---

### Step 1: Database Setup

```bash
# Log into MySQL
mysql -u root -p

# Run seed script
source /path/to/nexkart/database/seed_data.sql
```

Or manually:
```sql
CREATE DATABASE nexkart_db;
USE nexkart_db;
```

---

### Step 2: Backend Setup

```bash
cd nexkart/backend

# Update application.properties if needed
# Edit: src/main/resources/application.properties
# Change: spring.datasource.username and spring.datasource.password

# Build & Run
mvn clean install
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080/api**

---

### Step 3: Frontend Setup

```bash
cd nexkart/frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend starts at: **http://localhost:3000**

---

### Step 4: Seed Demo Data

After the backend starts (tables auto-created), run:

```bash
mysql -u root -p nexkart_db < database/seed_data.sql
```

---

## 🔑 Default Credentials

| Role    | Email                    | Password   |
|---------|--------------------------|------------|
| Admin   | admin@nexkart.com        | `password` |
| Customer| Register via /register   | Any 6+ chars |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint           | Description        | Auth Required |
|--------|--------------------|--------------------|---------------|
| POST   | /auth/register     | Register new user  | No            |
| POST   | /auth/login        | Login (get JWT)    | No            |
| GET    | /auth/me           | Get current user   | Yes           |

### Products
| Method | Endpoint                      | Description         | Auth Required |
|--------|-------------------------------|---------------------|---------------|
| GET    | /products                     | List/search products| No            |
| GET    | /products/{id}                | Get product detail  | No            |
| GET    | /products/featured            | Get featured items  | No            |
| GET    | /products/{id}/related        | Get related products| No            |
| POST   | /products                     | Create product      | ADMIN         |
| PUT    | /products/{id}                | Update product      | ADMIN         |
| DELETE | /products/{id}                | Delete product      | ADMIN         |

### Cart
| Method | Endpoint             | Description        | Auth Required |
|--------|----------------------|--------------------|---------------|
| GET    | /cart                | View cart          | Yes           |
| POST   | /cart/add            | Add item to cart   | Yes           |
| PUT    | /cart/update         | Update item qty    | Yes           |
| DELETE | /cart/remove/{id}    | Remove cart item   | Yes           |
| DELETE | /cart/clear          | Clear entire cart  | Yes           |

### Orders
| Method | Endpoint                     | Description         | Auth Required |
|--------|------------------------------|---------------------|---------------|
| POST   | /orders/place                | Place new order     | Yes           |
| GET    | /orders                      | My orders           | Yes           |
| GET    | /orders/{id}                 | Order detail        | Yes           |
| POST   | /orders/{id}/cancel          | Cancel order        | Yes           |
| GET    | /orders/admin/all            | All orders          | ADMIN         |
| PUT    | /orders/admin/{id}/status    | Update status       | ADMIN         |

### Reviews
| Method | Endpoint                      | Description       | Auth Required |
|--------|-------------------------------|-------------------|---------------|
| GET    | /reviews/product/{productId}  | Get reviews       | No            |
| POST   | /reviews/product/{productId}  | Add review        | Yes           |
| DELETE | /reviews/{id}                 | Delete review     | Yes           |

---

## 🧪 Testing with Postman

1. Open Postman
2. Import `postman/NexKart_API_Collection.json`
3. Run **"Login as Admin"** request first (auto-saves token)
4. All authenticated requests use `{{token}}` variable automatically

---

## 🎨 Customization

### Change Brand Colors
Edit `frontend/src/App.css`:
```css
:root {
  --nk-primary: #FF4500;      /* Main accent color */
  --nk-secondary: #1a1a2e;    /* Dark navbar/sidebar */
  --nk-accent: #FFB800;       /* Stars/ratings */
}
```

### Change Database Credentials
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/nexkart_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

## 🏗️ Building for Production

### Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/nexkart-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Build output in frontend/build/
```

---

## 📦 Entity Relationship Overview

```
User ──────── Cart ──── CartItems ──── Product
  │                                      │
  │                                   Category
  │
  └──────── Orders ─── OrderItems ─── Product
  │
  └──────── Addresses
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <strong>Built with ❤️ using Java Spring Boot + React</strong><br/>
  <em>NexKart — Shop Smarter, Live Better</em>
</div>
