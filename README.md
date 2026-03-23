# 🏦 Banking KYC Process Automation System
> Automate · Digitalize · Secure — Know Your Customer verification for modern banks.

## 📖 About the Project

Traditional KYC processes in banks are slow, paper-heavy, and error-prone.
This system replaces manual verification with a fully automated digital workflow.

- Customers register, submit identity documents online, and track verification status in real time.
- Bank Officers log in to a dedicated dashboard, preview documents, and approve or reject submissions.
- Admins manage users and monitor all activity through a secure admin panel.

All actions are secured with JWT authentication, role-based access control,
and a complete audit trail of every officer decision.

## ✨ Features

### 👤 Customer
- Register and login with role-based access
- Multi-step KYC form — Personal Info → Document Upload → Review & Submit
- Drag-and-drop file upload (PDF, JPG, PNG — max 10 MB)
- Real-time KYC status tracking with timeline view
- Status chips: PENDING · APPROVED · REJECTED
- Re-upload option for rejected documents
- Email notification on submission, approval, and rejection

### 🏛️ Officer
- Paginated pending KYC queue with search and filter
- Document preview panel (PDF / Image viewer)
- One-click Approve / Reject with mandatory remarks on rejection
- Weekly verification statistics chart (Recharts)
- Bulk review with Previous / Next navigation

### 🔐 System-Wide
- JWT authentication (HS256 · 24-hour expiry)
- Role-based access control — CUSTOMER / OFFICER / ADMIN
- Full audit log of every officer action with timestamp
- Global exception handling — no stack trace exposure
- Input validation — Yup (frontend) + @Valid (backend)
- Pagination on all listing APIs (?page=0&size=10)

## 🛠️ Tech Stack

### Frontend
| Technology       | Purpose                        |
|------------------|-------------------------------|
| React 18         | UI framework                  |
| Tailwind CSS 3   | Styling                       |
| React Router DOM | Client-side routing           |
| Axios            | HTTP client + interceptors    |
| React Hook Form  | Form state management         |
| Yup              | Schema validation             |
| Recharts         | Dashboard charts              |
| Context API      | Global auth state (JWT/user)  |

### Backend
| Technology       | Purpose                        |
|------------------|-------------------------------|
| Spring Boot 3    | Application framework         |
| Spring Security 6| Auth & role-based access      |
| Spring Data JPA  | ORM and repository layer      |
| Spring Mail      | Email notifications (SMTP)    |
| Hibernate 6      | ORM implementation            |
| Lombok           | Boilerplate reduction         |
| ModelMapper      | DTO ↔ Entity mapping          |
| jjwt             | JWT token generation          |
| BCrypt           | Password hashing (strength 10)|
| Maven            | Build tool                    |
| Java 17          | Runtime                       |

### Database
| Technology       | Purpose                        |
|------------------|-------------------------------|
| MySQL 8.0        | Primary relational database   |
| Hibernate DDL    | Schema auto-management        |
| /uploads dir     | Document file storage         |

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────┐
│         React Frontend  (Port 3000)             │
│  Login · Dashboard · Submit KYC · Review        │
└───────────────────┬─────────────────────────────┘
                    │  HTTPS + JWT Bearer Token
┌───────────────────▼─────────────────────────────┐
│        Spring Security — API Gateway            │
│   JWT Filter · Role Check · CORS · Validation  │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│            Controller Layer                     │
│  AuthController · CustomerController ·          │
│  OfficerController                              │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│             Service Layer                       │
│  AuthService · CustomerService ·                │
│  OfficerService · EmailService                  │
└────────┬──────────────────────┬─────────────────┘
         │                      │
  ┌──────▼──────┐       ┌───────▼──────┐
  │ Repository  │       │ File Storage │
  │ Layer (JPA) │       │ /uploads dir │
  └──────┬──────┘       └──────────────┘
         │
  ┌──────▼──────┐
  │  MySQL DB   │
  │   kyc_db    │
  └─────────────┘
```

## 📁 Project Structure
```
banking-kyc-system/
├── backend/
│   └── src/main/java/com/kyc/
│       ├── BankingKycApplication.java
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   └── JwtConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── CustomerController.java
│       │   └── OfficerController.java
│       ├── model/
│       │   ├── User.java
│       │   ├── KycDocument.java
│       │   └── VerificationStatus.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   └── KycDocumentRepository.java
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── CustomerService.java
│       │   └── OfficerService.java
│       ├── dto/
│       │   ├── LoginRequest.java
│       │   ├── RegisterRequest.java
│       │   └── KycSubmissionDTO.java
│       └── exception/
│           └── GlobalExceptionHandler.java
│
└── frontend/
    └── src/
        ├── App.jsx
        ├── api/axiosConfig.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── ProtectedRoute.jsx
        │   └── StatusBadge.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── CustomerDashboard.jsx
        │   ├── SubmitKyc.jsx
        │   ├── TrackStatus.jsx
        │   ├── OfficerDashboard.jsx
        │   └── ReviewKyc.jsx
        └── context/
            └── AuthContext.jsx
```


## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- MySQL 8.0+

### 1. Clone the repo
```bash
git clone https://github.com/Saikanth009/banking-kyc-system.git
cd banking-kyc-system
```

### 2. Create the database
```sql
CREATE DATABASE kyc_db;
```

### 3. Configure backend
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/kyc_db
spring.datasource.username=root
spring.datasource.password=your_password
jwt.secret=kyc_secret_key_2024
jwt.expiration=86400000
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

### 4. Run the backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### 5. Run the frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```





