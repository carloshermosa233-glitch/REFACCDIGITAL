let usuarios = [];
let editandoId = null;

document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
});

async function cargarUsuarios() {
  try {
    const response = await fetch("http://localhost:3000/api/usuarios");
    if (!response.ok) {
      throw new Error("Error al cargar usuarios");
    }
    usuarios = await response.json();
    renderTabla(usuarios);
  } catch (error) {
    console.error("Error:", error);
    alert("No se pudieron cargar los usuarios.");
  }
}

function renderTabla(listaUsuarios) {
  const tbody = document.getElementById("bodyUsuarios");
  tbody.innerHTML = "";
  listaUsuarios.forEach((u) => {
    const tr = document.createElement("tr");
    const rolClass = u.rol.toLowerCase();
    tr.innerHTML = `
            <td>#${u.id_usuario.toString().padStart(3, "0")}</td>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td><span class="badge badge-${rolClass}">${u.rol}</span></td>
            <td>
                <button class="btn-edit" onclick="editarUsuario(${u.id_usuario})">Editar</button>
                <button class="btn-delete" onclick="eliminarUsuario(${u.id_usuario})">Eliminar</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

async function agregarUsuario() {
  const nombre = document.getElementById("nuevoNombre").value.trim();
  const correo = document.getElementById("nuevoCorreo").value.trim();
  const contraseña = document.getElementById("nuevoPassword").value.trim();
  const rol = document.getElementById("nuevoRol").value;
  const errorEl = document.getElementById("errorForm");
  const successEl = document.getElementById("successForm");
  errorEl.style.display = "none";
  successEl.style.display = "none";

  if (!nombre || !correo) {
    errorEl.textContent = "Por favor completa todos los campos requeridos.";
    errorEl.style.display = "block";
    return;
  }
  if (!editandoId && !contraseña) {
    errorEl.textContent = "Por favor completa todos los campos.";
    errorEl.style.display = "block";
    return;
  }
  if (contraseña && contraseña.length < 4) {
    errorEl.textContent = "La contraseña debe tener al menos 4 caracteres.";
    errorEl.style.display = "block";
    return;
  }

  try {
    let response;
    if (editandoId) {
      const usuarioExistente = usuarios.find(
        (x) => x.id_usuario === editandoId,
      );
      const passFinal = contraseña ? contraseña : usuarioExistente.contraseña;
      response = await fetch(
        `http://localhost:3000/api/usuarios/${editandoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, correo, contraseña: passFinal, rol }),
        },
      );
    } else {
      response = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contraseña, rol }),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || data.error || "Error al procesar la solicitud.",
      );
    }

    successEl.textContent = editandoId
      ? `Usuario "${nombre}" actualizado correctamente.`
      : `Usuario "${nombre}" registrado correctamente.`;
    successEl.style.display = "block";
    setTimeout(() => (successEl.style.display = "none"), 3000);

    document.getElementById("nuevoNombre").value = "";
    document.getElementById("nuevoCorreo").value = "";
    document.getElementById("nuevoPassword").value = "";
    document.getElementById("nuevoRol").value = "VENDEDOR";
    editandoId = null;
    const btn = document.querySelector('button[onclick="agregarUsuario()"]');
    if (btn) btn.textContent = "Registrar";
    cargarUsuarios();
  } catch (error) {
    errorEl.textContent = error.message;
    errorEl.style.display = "block";
  }
}

function editarUsuario(id) {
  const u = usuarios.find((x) => x.id_usuario === id);
  if (!u) return;
  editandoId = id;
  document.getElementById("nuevoNombre").value = u.nombre;
  document.getElementById("nuevoCorreo").value = u.correo;
  document.getElementById("nuevoPassword").value = "";
  document.getElementById("nuevoRol").value = u.rol;
  const btn = document.querySelector('button[onclick="agregarUsuario()"]');
  if (btn) btn.textContent = "Actualizar datos";
}

async function eliminarUsuario(id) {
  const idUsuarioLogueado = localStorage.getItem("id_usuario");
  if (id.toString() === idUsuarioLogueado) {
    alert("No puedes eliminar tu propio usuario.");
    return;
  }

  const usuario = usuarios.find((u) => u.id_usuario === id);
  if (
    confirm(
      `¿Seguro que deseas eliminar al usuario "${usuario ? usuario.nombre : ""}"?`,
    )
  ) {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario.");
      }

      alert("Usuario eliminado correctamente.");
      cargarUsuarios();
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo eliminar el usuario.");
    }
  }
}
