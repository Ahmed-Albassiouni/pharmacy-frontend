# Pharmacy Frontend

A modern electronic pharmacy storefront interface built with React + Vite, focusing on a fast user experience, flexible order management, and a comprehensive administrative dashboard.

## نظرة عامة

This repository is for the Frontend only and relies on a REST API for backend integration.

## المميزات الرئيسية

- Complete Storefront: Includes Home, Product Browsing, Product Details, Cart, and    Checkout pages.

- Advanced Search & Filters: Filter by category, brand, dosage, price, and stock status with result sorting.

- Dynamic Stock Display: Real-time stock status visibility and alerts for out-of-stock items.

- Rich Product Details: Supports multiple images, ratings, reviews, and related product suggestions.

- Shopping Cart System: Automatic local persistence (localStorage) with instant quantity and total updates.

- Integrated Checkout: Supports multiple payment methods and a clear order confirmation experience.

- Pharmacist Consultation: A dedicated page with support for uploading prescriptions (PDF/Images) via a contact form.

- Authentication System: Login/Signup functionality with Role-Based Access Control (RBAC) for user and admin.

- User Account Page: Manage personal profiles, addresses, order history, and wishlists.

- Admin Dashboard: Full control over orders, products, users, and analytical reports.

- Multi-language Support: Arabic/English support with automatic layout switching (RTL/LTR).

- Theme Support: Dark and Light mode toggle.

- Toast Notifications: Instant feedback system for all user actions.

## التقنيات المستخدمة

- `React 18`
- `Vite 5`
- `React Router DOM 6`
- `Axios`
- `Bootstrap 5` + `Bootstrap Icons`

## تشغيل المشروع محلياً

```bash
npm install
npm run dev
```

أوامر إضافية:

- `npm run build` Build the project for production.
- `npm run start` Preview the production build locally.

## إعدادات البيئة

- `VITE_API_BASE_URL`: Optional variable to define the API base URL.
-If not defined, the application defaults to the local development URL.

## هيكل المشروع (مختصر)

- `src/pages` Application pages (Store / Account / Admin / Auth).
- `src/components` Reusable UI components.
- `src/context` Global state management (User, Cart, Language, Theme, Admin).
- `src/api` API communication layer.
- `src/i18n` Translation files.

## ملاحظة أمنية

This file does not contain any sensitive data (such as passwords, JWT secrets, or database strings). It is always recommended to manage credentials via environment variables outside of the repository.