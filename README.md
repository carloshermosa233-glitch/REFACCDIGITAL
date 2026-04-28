# RefaccDigital - Sistema de Punto de Venta

Este es mi sistema de control de inventario y ventas diseñado para refaccionarias en el cual nos encontramos en la Fase 2. En esta parte agregamos ya la Fase 2 de nuestro proyecto, complementando la fase 1.

## 🚀 Características

- **Gestión de Inventario:** CRUD completo de productos (crear, leer, actualizar y eliminar).
- **Control de Usuarios:** Sistema de autenticación con roles diferenciados.
- **Ventas y Reportes:** Registro de transacciones y visualización del "Corte del Día".
- **Seguridad:** Rutas protegidas por rol en el frontend y recuperación de contraseñas.
- **Base de Datos Autogestionada:** El sistema inicializa automáticamente las tablas y datos de prueba al arrancar.

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** & **Express**
- **MySQL** (Base de datos relacional)
- **mysql2/promise** (Cliente de base de datos)
- **dotenv** (Gestión de variables de entorno)
- **CORS** (Seguridad de peticiones)

### Frontend
- **HTML5** & **CSS3**
- **JavaScript (Vanilla)**
- **Fetch API** para comunicación con el backend.

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (Versión 14 o superior recomendada)
- [MySQL Server](https://www.mysql.com/) funcionando localmente.

## ⚙️ Configuración e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd PuntoDeVentaCr
   ```

2. **Configurar el Backend:**
   Navega a la carpeta del backend e instala las dependencias:
   ```bash
   cd backend
   npm install
   ```

3. **Variables de Entorno:**
   Crea un archivo `.env` en la carpeta `backend/` con los siguientes parámetros:
   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario_mysql
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=RefaccionesDB
   DB_PORT=3306
   ```

4. **Iniciar el Servidor:**
   ```bash
   npm start
   ```
   *Nota: Al iniciar, el script `initDB` creará automáticamente la base de datos y las tablas si no existen.*

## 🔑 Credenciales de Acceso (Prueba)

| Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `carlos@admin.com` | `123456` |
| **Vendedor** | `arlett@vendedor.com` | `123456` |

## 📂 Estructura del Proyecto

- `/backend`: Contiene la API, controladores, rutas y configuración de base de datos.
  - `/controllers`: Lógica de negocio para productos, ventas y usuarios.
  - `/public`: Archivos JavaScript del lado del cliente y lógica de autenticación.
- `/frontend`: Contiene las vistas HTML y estilos CSS del sistema.

## 📄 Licencia
Este proyecto es para uso educativo en el marco de Ingeniería de Software.

## Autor
Hermosa Praxedis Carlos Rafael