Refacc-Digital: Sistema de Control de Inventario y Ventas

Refacc-Digital es una plataforma integral diseñada para optimizar la administración de una refaccionaria automotriz, facilitando el control de stock, la compatibilidad de piezas y la gestión de personal. Este proyecto aplica principios de ingeniería de software para digitalizar los procesos de ventas y suministros en una interfaz moderna y eficiente.

Actualmente, el repositorio refleja la Fase 1 del desarrollo, centrada en una arquitectura sólida que separa el núcleo lógico del servidor (Backend) de la interfaz de usuario (Frontend).

Características Principales:
- Autenticación Multi-rol: Inicio de sesión diferenciado para Administradores y Vendedores.

-Control de Acceso: Protección de rutas en el frontend según el nivel de privilegios.

- Gestión de Empleados (CRUD): Listado, creación y eliminación de usuarios desde el panel de administración.

- Recuperación de Acceso: Funcionalidad para restablecer contraseñas olvidadas.

Módulos Implementados
1. Sistema de Autenticación y Seguridad
Gestiona la entrada protegida al sistema mediante la validación de credenciales contra la base de datos.

Seguridad por Roles: Diferencia entre privilegios de administrador y vendedor, redirigiendo a vistaAdmin.html o vistaVendedor.html.

Persistencia de Sesión: Implementado con lógica de localStorage para mantener la identidad del usuario durante la navegación.

2. Gestión de Usuarios (Administración)
Módulo exclusivo para el administrador encargado de la organización del capital humano.

Interfaz Dinámica: Tabla interactiva en GestionUsuario.html que consume datos en tiempo real desde la API.

Validación de Datos: Control de errores para evitar duplicidad de correos electrónicos y asegurar la integridad de los registros.

Tecnologías Utilizadas:

- Backend: Node.js y Express.

- Base de Datos: MySQL (utilizando la librería mysql2).

- Frontend: HTML5, CSS3 y JavaScript vanilla (sin frameworks externos).

- Seguridad: Variables de entorno mediante dotenv y manejo de sesiones locales.

Estructura del Proyecto:

- El sistema sigue un patrón de arquitectura MVC (Modelo-Vista-Controlador) para asegurar la escalabilidad:

Backend
- /config: Conexión a la base de datos MySQL.

- /controllers: Lógica de negocio (Auth y Usuarios).

- /models: Consultas directas a la base de datos.

- /routes: Definición de endpoints de la API.

- server.js: Punto de entrada principal del servidor.



Frontend (Carpeta public & frontend):

- index.html: Formulario de login principal.

- vistaAdmin.html / vistaVendedor.html: Paneles de control por rol.

- GestionUsuario.html: Interfaz de administración de personal.

- /js: Scripts de validación, protección de rutas y comunicación con la API.

Instalación y Configuración
1.-Clonar el repositorio y entrar a la carpeta del proyecto.

2.-Instalar dependencias: npm install

3.-Configurar base de datos: Importar el archivo usuarios.sql ubicado en la carpeta /Database.

4.- Variables de entorno: Configurar el archivo .env con las credenciales de tu base de datos local:

PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=punto_venta

5.-Iniciar el servidor:
npm start

Autor: Hermosa Praxedis Carlos Rafael Hermosa Praxedis 
