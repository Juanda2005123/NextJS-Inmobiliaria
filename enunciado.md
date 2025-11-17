**Objetivo:**

Desarrollar una aplicación frontend utilizando Next.js que consuma los servicios de una API REST desarrollada en NestJS. La aplicación debe cumplir con altos estándares de calidad de código.

**Requisitos Mínimos:**

**1. Autenticación (10%):**
*   Implementar un sistema de autenticación basado en JSON Web Tokens (JWT).
*   Los usuarios deben poder iniciar y cerrar sesión.
*   Implementar rutas protegidas que requieran autenticación para ser accedidas.

**2. Autorización (10%):**
*   Definir un mínimo de dos roles de usuario (ej: "admin", "usuario").
*   Establecer permisos basados en roles para restringir el acceso a rutas o funcionalidades específicas.
*   Implementar un mecanismo para la asignación y gestión de roles.
*   La interfaz de usuario debe adaptarse dinámicamente al rol del usuario, mostrando u ocultando elementos según sus permisos.

**3. Interfaz de Usuario (15%):**
*   Diseñar una interfaz de usuario atractiva y funcional con componentes de React.
*   Crear páginas para las operaciones CRUD (listar, crear, editar y eliminar) de los recursos principales.
*   Implementar paginación en las listas de datos.
*   Añadir validaciones en los formularios y mostrar mensajes de error claros al usuario (evitar el uso de `window.alert()`).
*   Desarrollar un sistema de navegación intuitivo y fácil de usar.

**4. Gestión del Estado (10%):**
*   Utilizar una solución para la gestión del estado global de la aplicación (como Context API, Redux o Zustand).
*   Manejar de forma centralizada el estado de autenticación y autorización del usuario.
*   Gestionar el estado de los datos principales que consume la aplicación (por ejemplo, listas de productos, historias de usuario, etc.).

**5. Funcionalidades (20%):**
*   Implementar todas las funcionalidades del frontend necesarias para la aplicación que se está desarrollando.

**6. Informe de Funcionalidades (10%):**
*   Redactar un informe detallado que describa las funcionalidades implementadas.
*   Explicar cómo se implementaron específicamente las características de autenticación, autorización y gestión del estado.

**7. Despliegue (10%):**
*   Desplegar la aplicación en un servicio en la nube (como Vercel, Netlify, AWS, etc.).
*   Configurar pipelines de CI/CD para la ejecución automática de pruebas y el despliegue de la aplicación.

**8. Pruebas (15%):**
*   Implementar pruebas unitarias para los componentes y funciones clave.
*   Desarrollar pruebas End-to-End (E2E) para los flujos de usuario más importantes.

**Entrega:**

*   El código fuente completo del proyecto.
*   Un archivo `README.md` con instrucciones claras para ejecutar la aplicación en un entorno local y probar cada una de las funcionalidades implementadas.