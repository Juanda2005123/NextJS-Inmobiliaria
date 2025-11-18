# 🏠 Sistema de Gestión Inmobiliaria

<div align="center">

**Aplicación web moderna para la gestión integral de propiedades inmobiliarias**

### 👨‍💻 Equipo de Desarrollo

| **Juan Esteban Ruiz** | **Juan David Quintero** | **Juan Andrés Cano** |
|:---------------------:|:-----------------------:|:--------------------:|
| [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/JRuiz1601) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Juanda2005123) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/juanandrescano) |

**Universidad ICESI - Computación en Internet III**  
Noviembre 2025

---

[![Deployment Status](https://img.shields.io/badge/Deployment-Active-success?style=for-the-badge&logo=vercel)](https://nextjs-inmobiliaria-afxau9fgf-jruiz1601s-projects.vercel.app)
[![Test Coverage](https://img.shields.io/badge/Coverage-99.51%25-brightgreen?style=for-the-badge&logo=jest)](./coverage)
[![E2E Tests](https://img.shields.io/badge/E2E-10%2F10-brightgreen?style=for-the-badge&logo=playwright)](./playwright-report)

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Jest](https://img.shields.io/badge/Jest-30.2.0-C21325?style=for-the-badge&logo=jest)
![Playwright](https://img.shields.io/badge/Playwright-1.56.1-2EAD33?style=for-the-badge&logo=playwright)

</div>

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Demostración](#-demostración)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Arquitectura](#-arquitectura)
- [Autenticación y Autorización](#-autenticación-y-autorización)
- [Equipo](#-equipo)
- [Licencia](#-licencia)

---

## 🎯 Acerca del Proyecto

Sistema integral de gestión inmobiliaria desarrollado con **Next.js 16** y **React 19**, diseñado para facilitar la administración de propiedades, usuarios y tareas relacionadas con procesos de venta y alquiler de inmuebles.

### ✨ Características Principales

#### 🔐 **Autenticación y Autorización**
- Sistema de autenticación JWT con tokens seguros
- Control de acceso basado en roles (RBAC)
- 2 roles: `agent` (agente inmobiliario) y `superadmin` (administrador)
- Protección de rutas con redirección automática
- Persistencia de sesión entre recargas

#### 🏢 **Gestión de Propiedades**
- **Catálogo público** - Vista sin autenticación de todas las propiedades
- **CRUD completo** para agentes y administradores
- Filtrado automático por owner (agentes solo ven las suyas)
- Información detallada: precio, ubicación, habitaciones, baños, área
- Asignación automática de propiedades a agentes

#### 👥 **Gestión de Usuarios** (Solo Superadmin)
- Crear, editar y eliminar usuarios
- Asignar roles (agent/superadmin)
- Validación de email único
- Gestión de contraseñas segura

#### ✅ **Gestión de Tareas**
- Asignación automática de tareas por propiedad
- Estados: Pendiente/Completada
- Vista diferenciada por rol (agent/superadmin)
- Filtrado por propiedad y agente

#### 📊 **Dashboard Personalizado**
- Estadísticas según rol del usuario
- Resumen de propiedades y tareas
- Accesos rápidos a funciones principales

#### 🎨 **UI/UX Moderna**
- Diseño responsive y profesional con Tailwind CSS
- Componentes reutilizables (Button, Card, Input, Table, Badge)
- Estados de carga y mensajes de error claros
- Sin uso de `window.alert()` - validaciones inline
- Breadcrumbs de navegación
- Hero sections con gradientes

---

## 🛠 Tecnologías

### **Frontend**
- **[Next.js 16.0.1](https://nextjs.org)** - Framework React con App Router
- **[React 19.2.0](https://react.dev)** - Biblioteca para interfaces de usuario
- **[TypeScript 5.x](https://www.typescriptlang.org)** - JavaScript con tipado estático
- **[Tailwind CSS 4](https://tailwindcss.com)** - Framework de utilidades CSS
- **[Lucide React](https://lucide.dev)** - Biblioteca de íconos moderna

### **Testing**
- **[Jest 30.2.0](https://jestjs.io)** - Framework de testing unitario
- **[React Testing Library 16.3.0](https://testing-library.com/react)** - Testing de componentes React
- **[Playwright 1.56.1](https://playwright.dev)** - Testing E2E
- **Coverage:** 99.51% (244 tests, 11 suites)
- **E2E Tests:** 10/10 passing

### **Backend (API)**
- **[NestJS](https://nestjs.com)** - Framework Node.js para APIs REST
- **[PostgreSQL](https://www.postgresql.org)** - Base de datos relacional
- **[JWT](https://jwt.io)** - Autenticación con tokens
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Encriptación de contraseñas

### **DevOps & CI/CD**
- **[Vercel](https://vercel.com)** - Hosting y deployment
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipeline
- **[ESLint](https://eslint.org)** - Linting de código
- **[Prettier](https://prettier.io)** - Formateo de código

---

## 🚀 Demostración

### 🌐 **URL de Producción**
**[https://nextjs-inmobiliaria-afxau9fgf-jruiz1601s-projects.vercel.app](https://nextjs-inmobiliaria-afxau9fgf-jruiz1601s-projects.vercel.app)**

### 🔑 **Credenciales de Prueba**

#### Superadmin
```
Email: admin@example.com
Password: admin1234
```

#### Agente
```
Email: james.bond@icesi.edu
Password: shaken_not_stirred
```

---

## 📦 Instalación

### **Prerrequisitos**
- Node.js >= 18.x
- npm, yarn, pnpm o bun
- Git

### **Pasos de Instalación**

1. **Clonar el repositorio**
```bash
git clone https://github.com/Juanda2005123/NextJS-Inmobiliaria.git
cd NextJS-Inmobiliaria
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus valores:
```env
NEXT_PUBLIC_API_URL=https://real-estate-api-jek0.onrender.com/api
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en navegador**
```
http://localhost:3000
```

---

## 🔧 Variables de Entorno

| Variable              | Descripción                          | Ejemplo                                        |
|-----------------------|--------------------------------------|------------------------------------------------|
| `NEXT_PUBLIC_API_URL` | URL del backend NestJS               | `https://real-estate-api-jek0.onrender.com/api` |

---

## 📜 Scripts Disponibles

| Comando             | Descripción                                      |
|---------------------|--------------------------------------------------|
| `npm run dev`       | Inicia servidor de desarrollo (puerto 3000)      |
| `npm run build`     | Genera build de producción                       |
| `npm start`         | Inicia servidor de producción                    |
| `npm run lint`      | Ejecuta ESLint para verificar código            |
| `npm test`          | Ejecuta tests unitarios con Jest                 |
| `npm run test:watch`| Ejecuta tests en modo watch                      |
| `npm run test:coverage` | Genera reporte de cobertura                  |
| `npm run e2e`       | Ejecuta tests E2E con Playwright                 |
| `npm run e2e:ui`    | Abre UI interactiva de Playwright                |

---

## 🧪 Testing

### **Tests Unitarios (Jest + React Testing Library)**

**Cobertura:** 99.51%
- **Tests:** 244 passing
- **Suites:** 11
- **Archivos cubiertos:**
  - Componentes UI (Button, Card, Input, Table, Badge)
  - Features (Auth, Users, Properties, Tasks)
  - Services y Hooks
  - Context API

**Ejecutar tests:**
```bash
npm test
```

**Ver reporte de cobertura:**
```bash
npm run test:coverage
```

### **Tests E2E (Playwright)**

**Resultados:** 10/10 tests passing
- ✅ Login exitoso
- ✅ Login con credenciales inválidas
- ✅ Registro de usuario
- ✅ Redirección automática cuando está autenticado
- ✅ Logout desde dashboard
- ✅ Navegación a perfil
- ✅ Navegación a propiedades
- ✅ Navegación a usuarios (superadmin)
- ✅ Protección de rutas - dashboard
- ✅ Protección de rutas - users

**Ejecutar tests E2E:**
```bash
npm run e2e
```

**Ver reporte:**
```bash
npx playwright show-report
```

---

## 🚢 Deployment

### **Vercel (Producción)**

El proyecto está desplegado automáticamente en **Vercel** con CI/CD.

**URL:** [https://nextjs-inmobiliaria-afxau9fgf-jruiz1601s-projects.vercel.app](https://nextjs-inmobiliaria-afxau9fgf-jruiz1601s-projects.vercel.app)

#### **Deployment Automático**
Cada push a `main` dispara:
1. ✅ Tests unitarios (Jest)
2. ✅ Tests E2E (Playwright)
3. ✅ Build de Next.js
4. 🚀 Deployment a Vercel

#### **Configuración en Vercel Dashboard**
```env
NEXT_PUBLIC_API_URL=https://real-estate-api-jek0.onrender.com/api
```

### **Deployment Manual**
```bash
# 1. Build local
npm run build

# 2. Preview local del build
npm start

# 3. Deploy con Vercel CLI
npx vercel --prod
```

---

## 🏗 Arquitectura

### **Estructura de Carpetas**
```
src/
├── app/                      # Pages (App Router)
│   ├── (protected)/          # Rutas protegidas
│   │   ├── dashboard/
│   │   ├── properties/
│   │   ├── users/
│   │   └── profile/
│   ├── auth/                 # Login/Register
│   └── catalog/              # Catálogo público
│
├── features/                 # Módulos por dominio
│   ├── auth/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── users/
│   ├── properties/
│   └── tasks/
│
├── shared/                   # Código compartido
│   ├── components/ui/        # Button, Card, Input, Table...
│   ├── lib/                  # apiClient, authStorage
│   └── types/
│
└── components/               # Navbar, Footer
```

### **Patrones de Diseño**
- ✅ **Feature-Based Architecture** - Módulos autocontenidos
- ✅ **Custom Hooks Pattern** - Lógica reutilizable
- ✅ **Service Layer Pattern** - Separación de API calls
- ✅ **Protected Routes Pattern** - HOC para autenticación
- ✅ **Context API** - Estado global (auth)

---

## 🔐 Autenticación y Autorización

### **Flujo de Autenticación**
1. Usuario envía credenciales → `authService.login()`
2. Backend valida y retorna JWT
3. Token se guarda en `localStorage`
4. `AuthContext` actualiza estado global
5. Usuario accede a rutas protegidas

### **Roles y Permisos**

| Rol          | Permisos                                              |
|--------------|-------------------------------------------------------|
| **agent**    | - Ver/editar sus propias propiedades                  |
|              | - Ver/editar sus tareas asignadas                     |
|              | - Ver/editar su perfil                                |
| **superadmin** | - Gestión completa de usuarios (CRUD)               |
|              | - Gestión completa de propiedades (CRUD)              |
|              | - Gestión completa de tareas (CRUD)                   |
|              | - Asignar tareas a cualquier agente                   |

---

## 📄 Licencia

Este proyecto es un trabajo académico desarrollado para el curso de Computación en Internet III en la Universidad ICESI.

---

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

- 🐛 [Reportar Bug](https://github.com/Juanda2005123/NextJS-Inmobiliaria/issues)
- 💡 [Solicitar Feature](https://github.com/Juanda2005123/NextJS-Inmobiliaria/issues)
- 📧 Contacto: [juanruiz@example.com](mailto:juanruiz@example.com)

---

<div align="center">

**Hecho con ❤️ por el equipo de desarrollo**

[![Next.js](https://img.shields.io/badge/Powered%20by-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>
