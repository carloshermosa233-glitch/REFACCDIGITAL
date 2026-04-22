DROP DATABASE IF EXISTS RefaccionesDB;
CREATE DATABASE RefaccionesDB;
USE RefaccionesDB;


CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN','VENDEDOR') NOT NULL
);

select * from usuarios;