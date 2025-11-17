
## 📖 Descripción

Sistema completo de gestión inmobiliaria que permite a agentes y superadministradores gestionar propiedades y tareas asociadas. El sistema incluye:

- **Autenticación JWT** con roles diferenciados
- **Autorización basada en roles** (superadmin, agent)
- **Soft deletes** en todas las entidades
- **Relaciones complejas** entre usuarios, propiedades y tareas
- **Testing completo** (94.34% de cobertura)
- **Documentación interactiva** con Swagger


---

## ✨ Características

### Funcionalidades Principales

- ✅ **Autenticación y Autorización**
  - Registro de nuevos agentes
  - Login con JWT
  - Roles diferenciados (superadmin, agent)
  - Guards personalizados para protección de rutas

- ✅ **Gestión de Usuarios**
  - CRUD completo de usuarios
  - Perfil de usuario autenticado
  - Soft delete de cuentas
  - Solo superadmin puede gestionar usuarios

- ✅ **Gestión de Propiedades**
  - Endpoints públicos (sin autenticación)
  - Agentes crean propiedades (auto-asignación como owner)
  - Agentes solo modifican sus propias propiedades
  - Superadmin gestiona todas las propiedades
  - Soft delete con cascada a tareas

- ✅ **Gestión de Tareas**
  - Tareas asociadas a propiedades
  - Agentes solo ven/modifican tareas de sus propiedades
  - Superadmin gestiona todas las tareas
  - Asignación automática de tareas

### Características Técnicas

- ✅ **Base de Datos PostgreSQL** con TypeORM
- ✅ **Seed automático** con datos iniciales
- ✅ **Validación de datos** con class-validator
- ✅ **Documentación Swagger** completa con ejemplos
- ✅ **Soft deletes** en todas las entidades


---

## 📚 Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registrar nuevo agente | No |
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/logout` | Cerrar sesión | Sí |

### Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/users/me` | Obtener perfil actual | agent, superadmin |
| PUT | `/users/me` | Actualizar perfil | agent, superadmin |
| DELETE | `/users/me` | Eliminar cuenta | agent, superadmin |
| POST | `/users` | Crear usuario | superadmin |
| GET | `/users` | Listar usuarios | superadmin |
| GET | `/users/:id` | Obtener usuario | superadmin |
| PUT | `/users/:id` | Actualizar usuario | superadmin |
| DELETE | `/users/:id` | Eliminar usuario | superadmin |

### Propiedades (`/api/properties`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/properties` | Listar propiedades | No |
| GET | `/properties/:id` | Obtener propiedad | No |
| POST | `/properties/agent` | Crear propiedad (agente) | agent |
| PUT | `/properties/agent/:id` | Actualizar propia propiedad | agent |
| DELETE | `/properties/agent/:id` | Eliminar propia propiedad | agent |
| POST | `/properties/admin` | Crear propiedad (admin) | superadmin |
| PUT | `/properties/admin/:id` | Actualizar cualquier propiedad | superadmin |
| DELETE | `/properties/admin/:id` | Eliminar cualquier propiedad | superadmin |

### Tareas (`/api/tasks`)

| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/tasks/agent` | Listar tareas propias | agent |
| POST | `/tasks/agent` | Crear tarea | agent |
| GET | `/tasks/agent/:id` | Obtener tarea propia | agent |
| GET | `/tasks/agent/property/:propertyId` | Tareas por propiedad | agent |
| PUT | `/tasks/agent/:id` | Actualizar tarea propia | agent |
| DELETE | `/tasks/agent/:id` | Eliminar tarea propia | agent |
| GET | `/tasks/admin` | Listar todas las tareas | superadmin |
| POST | `/tasks/admin` | Crear tarea | superadmin |
| GET | `/tasks/admin/:id` | Obtener cualquier tarea | superadmin |
| GET | `/tasks/admin/property/:propertyId` | Tareas por propiedad | superadmin |
| PUT | `/tasks/admin/:id` | Actualizar cualquier tarea | superadmin |
| DELETE | `/tasks/admin/:id` | Eliminar cualquier tarea | superadmin |