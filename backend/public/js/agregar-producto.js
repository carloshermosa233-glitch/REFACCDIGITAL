async function guardarProducto() {
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = document.getElementById("precio").value;
    const cantidad = document.getElementById("cantidad").value;
    const ubicacion = document.getElementById("ubicacion").value.trim();

    if (!nombre || !precio || !cantidad) {
        mostrarMensaje("Por favor, completa los campos obligatorios (*).", "error");
        return;
    }

    if (parseFloat(precio) <= 0) {
        mostrarMensaje("El precio debe ser un valor positivo.", "error");
        return;
    }

    if (parseInt(cantidad) <= 0) {
        mostrarMensaje("La cantidad inicial debe ser al menos 1.", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                descripcion,
                precio: parseFloat(precio),
                cantidad: parseInt(cantidad),
                ubicacion
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            mostrarMensaje("Producto agregado exitosamente al inventario.", "success");
            // Limpiar formulario después de guardar
            document.querySelectorAll("input, textarea").forEach(el => el.value = "");
        } else {
            mostrarMensaje(data.message || "Ocurrió un error al guardar el producto.", "error");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarMensaje("Error de conexión con el servidor.", "error");
    }
}

function mostrarMensaje(texto, tipo) {
    const mensajeEl = document.getElementById("mensaje");
    mensajeEl.textContent = texto;
    mensajeEl.className = `feedback ${tipo}`;
    setTimeout(() => { mensajeEl.style.display = "none"; }, 4000);
}