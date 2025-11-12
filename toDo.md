# Plan de Desarrollo Inicial

## 1. Crear el Módulo de Auth y Usuarios

**Ubicación:** `app/auth` y `app/users` o `/src/app/auth` y `/src/app/users`

### Páginas en Auth:
- Registro
- Login
- Logout (funcionalidad en hooks y contexto)

### Páginas en Users:
- Perfil propio
- Lista de usuarios (solo superadmin)

---

## 2. Implementar Hooks Personalizados

- Manejar autenticación y autorización (`useAuth`, `useUser`)
- Gestión del token JWT en cookies o localStorage
- Implementar acciones de login, logout, registro y estado de sesión

---

## 3. Protección de Rutas

- Implementar middleware o componentes wrapper para proteger rutas
- Mostrar u ocultar UI según roles (agent, superadmin)

---

## 4. Desarrollo del CRUD de Usuarios

### Perfil Propio (agent y superadmin)
- Ver perfil
- Modificar datos
- Eliminar cuenta

### Gestión de Usuarios (solo superadmin)
- Listar usuarios
- Crear usuarios
- Actualizar usuarios
- Eliminar usuarios

---

## 5. Diseño y Componentes UI

- Añadir estilos usando Tailwind CSS
- Crear componentes reutilizables:
  - Formularios
  - Botones
  - Listas

---

## 6. Siguientes Pasos

- Trabajar en **propiedades** después de tener Auth y Users bien estructurado
- Implementar sistema de **tareas** posteriormente