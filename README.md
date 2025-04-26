# 💪 GymHive - E-Commerce Fitness Supplements Store

A comprehensive e-commerce platform for fitness supplements built with Spring Boot backend and Angular frontend. GymHive offers a seamless shopping experience with real-time notifications, user profiles, wishlist functionality, and a powerful admin dashboard.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-19.2.0-red.svg)](https://angular.io/)
[![Firebase](https://img.shields.io/badge/Firebase-13.0.0-orange.svg)](https://firebase.google.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Key Features in Detail](#-key-features-in-detail)
- [Database Structure](#-database-structure)
- [Security Implementation](#-security-implementation)
- [Future Improvements](#-future-improvements)

## ✨ Features

- **User Authentication** 🔐 - Secure login/signup with Firebase Auth
- **Product Browsing** 🔍 - Browse, filter, and search products by categories
- **Shopping Cart** 🛒 - Add products, update quantities, and view totals
- **Wishlist** ❤️ - Save favorite products for later
- **Checkout Process** 💳 - Streamlined checkout with address and payment forms
- **User Profiles** 👤 - Manage personal information and view order history
- **Order Management** 📦 - View orders and download invoices in XML or PDF format
- **Real-time Notifications** 🔔 - WebSocket-based price drop alerts for wishlist items
- **Email Notifications** 📧 - Order confirmation emails via MailHog
- **Admin Dashboard** 📊 - Comprehensive management of products, categories, and user activity
- **Responsive Design** 📱 - Optimized for all device sizes
- **Smart Caching System** ⚡ - Local storage-based caching to reduce unnecessary API calls

## 🛠️ Tech Stack

### Backend
- **Spring Boot** - Java-based framework for building robust applications
- **Spring Security** - Authentication and authorization
- **Spring WebSocket** - Real-time communication
- **Spring Mail** - Email services
- **Firebase Admin SDK** - Firebase integration
- **Firestore** - NoSQL database
- **Mustache** - Email template engine
- **Lombok** - Reduces boilerplate code
- **Bean Validation** - DTO validation
- **Spring Cache** - Server-side caching

### Frontend
- **Angular** - TypeScript-based web application framework
- **Angular Material** - UI component library
- **RxJS** - Reactive programming
- **STOMP.js** - WebSocket client
- **SockJS** - WebSocket fallback options
- **jsPDF** - PDF generation
- **html2canvas** - HTML to canvas conversion for PDF
- **Firebase SDK** - Authentication and Firestore integration
- **LocalStorage** - Client-side caching system

### DevOps & Tools
- **MailHog** - Email testing tool
- **Git** - Version control
- **Maven** - Dependency management for backend
- **npm** - Dependency management for frontend

## 🚀 Installation & Setup

### Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- npm 8 or higher
- Firebase account
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gymhive.git
   cd gymhive/backend
   ```
2. **Configure Firebase**
- Create a Firebase project at the Firebase Console.
- Generate a service‐account key and save it as **firebase-service-account.json** in **src/main/resources/**.
- Update your **src/main/resources/application.properties** with your Firebase project ID and any other properties.

3. **Configure Email (MailHog)**
- Install MailHog.
- Run MailHog (SMTP on port 1025, web UI on 8025).
- No extra config needed—Spring’s already set to use MailHog by default.

4. **Build & run the backend**
    ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on http://localhost:8080.

### Frontend Setup

1. **Navigate to the frontend directory**
    ```bash
    cd ../frontend
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Run the development server**
    ```bash
    ng serve
    ```
The frontend will be up at http://localhost:4200.


## 🔍 Key Features in Detail
### User Authentication 🔐
- Email/password sign-up & login with validation
- Secure password handling via Firebase
- JWT token management for protected routes
- Activity logging for audit

### Product Browsing 🔍
- Category & subcategory tree navigation
- Price‐range, category, keyword filtering
- Instant search suggestions
- Detailed product pages with specs

### Wishlist ❤️
- Add/remove favorites
- Move wishlist items to cart
- Live price-drop alerts via WebSocket

### Checkout Process 💳
- Multi-step: shipping → payment → review
- Address form with profile auto-fill
- Credit-card validation & type detection
- Detailed order summary
- Order confirmation email

### User Profiles 👤
- Manage personal info & addresses
- View order history & statuses
- Download invoices (PDF/XML)

### Real-time Notifications 🔔
- WebSocket (STOMP) price-drop alerts
- Notification center with read/unread

### Smart Caching System ⚡
- LocalStorage‐backed cache to cut API calls
- Automatic invalidation on data changes
- Configurable expiry & eviction policies
- Offline fallback to cached data
- Improved performance & reduced server load

### Admin Dashboard 📊
- Analytics overview & charts
- Full CRUD for products
- Category & subcategory management
- Order processing & status updates
- User activity monitoring
- Responsive UI

## 🗄️ Database Structure
GymHive uses Firebase Firestore, a NoSQL document DB. Collections:
```bash
    /category/{categoryId}
    /products/{productId}
    /orders/{orderId}
    /subCategory/{subCategoryId}
    /orders/{orderId}
    /wishLists/{wishListId}
    /userActivity/{activityId}
    /userProfiles/{wishListId}
```
Each document holds fields and nested lists/objects.

## 🔒 Security Implementation

### Authentication
- Firebase Auth for secure user management
- JWT tokens for session handling
- HTTPS enforced

### Authorization
- Role-based access control (User vs Admin)
- Firestore security rules
- Backend checks on every request

### Data Validation
- Spring Bean Validation (DTOs)
- Custom validators for complex rules

### WebSocket Security
- Auth required on WS handshake
- User-specific subscription channels
- Message payload validation

## 🚧 Future Improvements

### Short-term
- Payment Gateway 💳 – Stripe/PayPal integration
- Personalized Recommendations 🎯 – ML-driven
- Multi-language 🌐 – i18n support
- Advanced Search 🔎 – Elasticsearch filtered by nutrition
- Performance Tuning ⚡ – Lazy-load images, CDN caching

### Long-term
- Mobile App 📱 – Angular Native or Flutter
- Social Login & Sharing 🤝 – OAuth social login, share links
- Reviews & Ratings ⭐ – Customer feedback + moderation
- Subscription Service 📅 – Recurring orders
- Loyalty Program 🏆 – Points & rewards
