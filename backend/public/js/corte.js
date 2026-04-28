document.addEventListener("DOMContentLoaded", () => {
    cargarCorteDia();
});

let ventasDelDia = [];

async function cargarCorteDia() {
    try {
        const response = await fetch("http://localhost:3000/api/corte-dia");
        const result = await response.json();
        
        if (result.success) {
            ventasDelDia = result.data;
            renderTablaVentas(ventasDelDia);
            calcularTotal(); // Se calcula de manera automática
        } else {
            console.error("Error del servidor:", result.message);
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
}

function renderTablaVentas(ventas) {
    const tbody = document.getElementById("bodyVentas");
    tbody.innerHTML = "";
    
    if (ventas.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3' style='text-align: center;'>No hay ventas registradas el día de hoy</td></tr>";
        return;
    }

    ventas.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${v.id_venta.toString().padStart(3, '0')}</td>
            <td>${v.producto}</td>
            <td>$${parseFloat(v.total).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function calcularTotal() {
    const total = ventasDelDia.reduce((sum, v) => sum + parseFloat(v.total), 0);
    document.getElementById("total").textContent = total.toFixed(2);
}

function generarReporte() {
    if (ventasDelDia.length === 0) {
        alert("No hay ventas para generar el corte.");
        return;
    }
    alert("Corte del día cerrado exitosamente.");
    window.print(); // Abre el cuadro de diálogo para imprimir o guardar en PDF
}

function volver() {
    window.location.href = "vistaAdmin.html";
}