const rol = localStorage.getItem("rol");
if (rol !== "VENDEDOR") {
    window.location.href = "index.html";
}