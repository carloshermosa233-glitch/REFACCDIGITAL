let listaProductos = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarInventario();
});

async function cargarInventario() {
    try {
        const response = await fetch("http://localhost:3000/api/inventario");
        const result = await response.json();
        
        if (result.success) {
            listaProductos = result.data;
            renderTablaInventario(listaProductos);
        } else {
            console.error("Error del servidor:", result.message);
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
}

function renderTablaInventario(productos) {
    const tbody = document.getElementById("bodyInventario");
    if (!tbody) {
        console.error("No se encontró el elemento con ID 'bodyInventario' en el HTML.");
        return;
    }

    tbody.innerHTML = "";
    
    if (productos.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4' style='text-align: center;'>No hay productos registrados</td></tr>";
        return;
    }

    productos.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.id_producto.toString().padStart(3, '0')}</td>
            <td>${p.nombre}</td>
            <td>${p.cantidad}</td>
            <td>${p.ubicacion || 'N/A'}</td>
            <td>
                <button class="btn-accion btn-editar" onclick="abrirModalEditar(${p.id_producto})">Editar</button>
                <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${p.id_producto})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarProductos() {
    const busqueda = document.getElementById("inputBusqueda").value.toLowerCase().trim();
    
    const productosFiltrados = listaProductos.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(busqueda);
        const coincideId = p.id_producto.toString().padStart(3, '0').includes(busqueda);
        return coincideNombre || coincideId;
    });

    renderTablaInventario(productosFiltrados);
}

function irEntrada() {
    window.location.href = "entrada.html";
}

function irCorte() {
    window.location.href = "corte.html";
}

function regresar() {
    window.location.href = "vistaAdmin.html";
}

async function eliminarProducto(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto del inventario?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
                method: "DELETE"
            });
            const result = await response.json();
            
            if (result.success) {
                alert("Producto eliminado exitosamente.");
                cargarInventario();
            } else {
                alert(result.message || "Error al eliminar el producto.");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Error de conexión con el servidor.");
        }
    }
}

function abrirModalEditar(id) {
    const producto = listaProductos.find(p => p.id_producto === id);
    if (!producto) return;
    
    document.getElementById("editId").value = producto.id_producto;
    document.getElementById("editNombre").value = producto.nombre || '';
    document.getElementById("editDescripcion").value = producto.descripcion || '';
    document.getElementById("editPrecio").value = producto.precio || 0;
    document.getElementById("editCantidad").value = producto.cantidad;
    document.getElementById("editUbicacion").value = producto.ubicacion || '';
    
    document.getElementById("modalEditar").classList.add("active");
}

function cerrarModalEditar() {
    document.getElementById("modalEditar").classList.remove("active");
}

async function guardarEdicion() {
    const id = document.getElementById("editId").value;
    const nombre = document.getElementById("editNombre").value.trim();
    const descripcion = document.getElementById("editDescripcion").value.trim();
    const precio = document.getElementById("editPrecio").value;
    const cantidad = document.getElementById("editCantidad").value;
    const ubicacion = document.getElementById("editUbicacion").value;

    if (parseFloat(precio) <= 0 || parseInt(cantidad) < 0) {
        alert("El precio debe ser mayor a 0 y la cantidad no puede ser negativa.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion, precio, cantidad, ubicacion })
        });
        
        const result = await response.json();
        if (result.success) {
            cerrarModalEditar();
            cargarInventario();
        } else {
            alert(result.message || "Error al actualizar.");
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
        alert("Error de conexión con el servidor.");
    }
}