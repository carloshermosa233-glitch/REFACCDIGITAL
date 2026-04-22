document.addEventListener("DOMContentLoaded", () => {
    const rol = localStorage.getItem("rol");
    if (rol === "ADMIN") {
        window.location.href = "vistaAdmin.html";
    } else if (rol === "VENDEDOR") {
        window.location.href = "vistaVendedor.html";
    }
});

async function login() {
    let user = document.getElementById("usuario").value;
    let pass = document.getElementById("password").value;
    let errorEl = document.getElementById("error");

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: user, password: pass })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("rol", data.usuario.rol);
            localStorage.setItem("usuario", data.usuario.nombre);
            localStorage.setItem("id_usuario", data.usuario.id_usuario);

            if (data.usuario.rol === "ADMIN") {
                window.location.href = "vistaAdmin.html";
            } else if (data.usuario.rol === "VENDEDOR") {
                window.location.href = "vistaVendedor.html";
            }
        } else {
            errorEl.style.display = "block";
            errorEl.innerText = data.message;
        }
    } catch (error) {
        console.error("Error en login:", error);
        errorEl.style.display = "block";
        errorEl.innerText = "Error al conectar con el servidor";
    }
}

function abrirModalRecuperar(event) {
    event.preventDefault();
    document.getElementById("recuperarEmail").value = "";
    const feedbackEl = document.getElementById("feedbackModal");
    feedbackEl.style.display = "none";
    feedbackEl.textContent = "";
    document.getElementById("modalRecuperar").classList.add("active");
}

function cerrarModalRecuperar() {
    document.getElementById("modalRecuperar").classList.remove("active");
}

async function enviarRecuperacion() {
    const email = document.getElementById("recuperarEmail").value;
    const feedbackEl = document.getElementById("feedbackModal");
    feedbackEl.style.display = "none";

    if (!email) {
        feedbackEl.textContent = "Por favor, ingresa un correo electrónico.";
        feedbackEl.className = "feedback-modal error";
        feedbackEl.style.display = "block";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/recuperar-contrasena", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (response.ok) {
            feedbackEl.textContent = data.message;
            feedbackEl.className = "feedback-modal success";
        } else {
            feedbackEl.textContent = data.message || "Ocurrió un error.";
            feedbackEl.className = "feedback-modal error";
        }
        feedbackEl.style.display = "block";

    } catch (error) {
        feedbackEl.textContent = "Error al conectar con el servidor.";
        feedbackEl.className = "feedback-modal error";
        feedbackEl.style.display = "block";
    }
}