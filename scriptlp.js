// Estado de la aplicación
let currentStatus = "fuera"; // 'fuera' o 'dentro'
let todayRecords = [];

// Elementos del DOM
const currentTimeElement = document.getElementById("currentTime");
const currentDateElement = document.getElementById("currentDate");
const statusBadge = document.getElementById("statusBadge");
const facultySelect = document.getElementById("facultySelect");
const entradaBtn = document.getElementById("entradaBtn");
const salidaBtn = document.getElementById("salidaBtn");
const recordsContainer = document.getElementById("recordsContainer");
const recordsList = document.getElementById("recordsList");

// Función para obtener la hora actual
function getCurrentTime() {
  return new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
  });
}

// Función para obtener la fecha actual
function getCurrentDate() {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Actualizar el reloj cada segundo
function updateClock() {
  if (currentTimeElement) {
    currentTimeElement.textContent = getCurrentTime();
  }
}

// Inicializar la fecha
function initializeDate() {
  if (currentDateElement) {
    // Capitalizar la primera letra
    const date = getCurrentDate();
    currentDateElement.textContent =
      date.charAt(0).toUpperCase() + date.slice(1);
  }
}

// Actualizar el estado del badge
function updateStatusBadge() {
  if (statusBadge) {
    if (currentStatus === "dentro") {
      statusBadge.textContent = "En el campus";
      statusBadge.classList.add("active");
    } else {
      statusBadge.textContent = "Fuera del campus";
      statusBadge.classList.remove("active");
    }
  }
}

// Actualizar estado de los botones
function updateButtons() {
  if (entradaBtn && salidaBtn) {
    if (currentStatus === "dentro") {
      entradaBtn.disabled = true;
      salidaBtn.disabled = false;
    } else {
      entradaBtn.disabled = false;
      salidaBtn.disabled = true;
    }
  }
}

// // ...existing code...

// Renderizar registros del día
function renderRecords() {
  if (!recordsList || !recordsContainer) return;

  if (todayRecords.length === 0) {
    recordsContainer.style.display = "none";
    return;
  }

  recordsContainer.style.display = "block";
  recordsList.innerHTML = "";

  todayRecords.forEach(function (record) {
    const recordItem = document.createElement("div");
    recordItem.className = "record-item";

    const iconColor =
      record.type === "entrada" ? "record-icon-entrada" : "record-icon-salida";
    const iconPath =
      record.type === "entrada"
        ? '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>'
        : '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>';

    recordItem.innerHTML =
      '<span class="record-type">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="' +
      iconColor +
      '">' +
      iconPath +
      "</svg>" +
      "<span>" +
      record.type +
      "</span>" +
      "</span>" +
      "<span>" +
      record.time +
      "</span>";

    recordsList.appendChild(recordItem);
  });
}

// Agrega una entrada a "Actividad Reciente"
function addActivityToRecent(record) {
  const activityList = document.querySelector(".activity-list");
  if (!activityList) return;
//Aqui simulamos el LocalStorage del navegador con un nombre por defecto
  const userName =
    sessionStorage.getItem("userName") ||
    sessionStorage.getItem("userEmail") ||
    "Ing. Johandry Viles";

  const badgeClass =
    record.type === "entrada" ? "badge badge-primary" : "badge badge-outline";
  const badgeText = record.type === "entrada" ? "Entrada" : "Salida";

  const item = document.createElement("div");
  item.className = "activity-item";
  item.innerHTML = `
    <div class="activity-info">
      <p class="activity-name">${userName}</p>
      <p class="activity-faculty">${record.faculty}</p>
    </div>
    <div class="activity-actions">
      <span class="${badgeClass}">${badgeText}</span>
      <span class="activity-time">${record.time}</span>
    </div>
  `;

  // Prepend para que la más reciente quede arriba
  activityList.insertBefore(item, activityList.firstChild);

  // Opcional: mantener solo las últimas 10 entradas
  while (activityList.children.length > 10) {
    activityList.removeChild(activityList.lastChild);
  }
}

// Manejar registro de asistencia
function handleAttendance(type) {
  if (!facultySelect.value) {
    alert("Por favor selecciona tu facultad");
    return;
  }

  const now = new Date();
  const hour = now.getHours();

  // Permitir registros desde las 6:00 AM hasta las 11:59 PM
  if (hour < 6 || hour >= 24) {
    alert("El registro está disponible de 6:00 AM a 11:59 PM");
    return;
  }

  const currentTime = getCurrentTime();

  // Crear nuevo registro
  const newRecord = {
    type: type,
    time: currentTime,
    faculty: facultySelect.value,
  };

  // Agregar al array de registros
  todayRecords.push(newRecord);

  // Actualizar estado
  currentStatus = type === "entrada" ? "dentro" : "fuera";

  // Actualizar UI
  updateStatusBadge();
  updateButtons();
  renderRecords();

  // Agregar a actividad reciente
  addActivityToRecent(newRecord);

  // Log para debugging
  console.log(
    (type === "entrada" ? "Entrada" : "Salida") +
      " registrada a las " +
      currentTime +
      " - " +
      facultySelect.value
  );
}

// ...existing code

// Event Listeners
if (entradaBtn) {
  entradaBtn.addEventListener("click", function () {
    handleAttendance("entrada");
  });
}

if (salidaBtn) {
  salidaBtn.addEventListener("click", function () {
    handleAttendance("salida");
  });
}

// Agregar listener para cerrar sesión -> redirige al login
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    // Si usas sessionStorage/localStorage para la sesión, puedes limpiarla aquí:
    // sessionStorage.clear();
    // localStorage.removeItem('token');
    window.location.href = "index.html";
  });
}
// Agregar listener para el botón Mi Perfil
const profileBtn = document.getElementById("myuser");
if (profileBtn) {
  profileBtn.addEventListener("click", function () {
    window.location.href = "appuser.html";
  });
}
// Smooth scroll para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Inicialización
function init() {
  // Actualizar fecha
  initializeDate();

  // Actualizar reloj inmediatamente
  updateClock();

  // Actualizar reloj cada segundo
  setInterval(updateClock, 1000);

  // Inicializar estado de botones
  updateButtons();

  // Inicializar badge
  updateStatusBadge();
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
