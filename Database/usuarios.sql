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

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);


CREATE TABLE inventario (
    id_producto INT PRIMARY KEY,
    precio DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL,
    ubicacion VARCHAR(100),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);
