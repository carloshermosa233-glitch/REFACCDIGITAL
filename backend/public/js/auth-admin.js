const rol = localStorage.getItem("rol");
if (rol !== "ADMIN") {
    window.location.href = "index.html";
}