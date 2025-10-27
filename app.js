// Estado de la aplicación
const state = {
  activeView: "profile",
  userRole: "docente",
  sidebarOpen: true,
  userInfo: {
    nombre: "Ing. Johandry Viles",
    correo: "e1315641827@live.uleam.edu.ec",
    facultad: "Facultad de Ciencias de la Vida y Tecnología",
    departamento: "Departamento de Software",
    cedula: "1234567890",
    telefono: "+593 99 123 4567",
  },
  notifications: {
    email: true,
    recordatorios: true,
    reportes: false,
  },
  attendanceHistory: [
    {
      fecha: "2025-10-09",
      entrada: "08:05",
      salida: "16:30",
      estado: "Presente",
      horas: "8h 25m",
    },
    {
      fecha: "2025-10-08",
      entrada: "08:10",
      salida: "16:15",
      estado: "Presente",
      horas: "8h 5m",
    },
    {
      fecha: "2025-10-07",
      entrada: "08:00",
      salida: "16:30",
      estado: "Presente",
      horas: "8h 30m",
    },
    {
      fecha: "2025-10-06",
      entrada: "-",
      salida: "-",
      estado: "Ausente",
      horas: "0h",
    },
    {
      fecha: "2025-10-05",
      entrada: "08:15",
      salida: "13:00",
      estado: "Parcial",
      horas: "4h 45m",
    },
    {
      fecha: "2025-10-04",
      entrada: "08:00",
      salida: "16:30",
      estado: "Presente",
      horas: "8h 30m",
    },
  ],
  users: [
    {
      id: 1,
      nombre: "Ing. Johandry Viles",
      correo: "e1315641827@live.uleam.edu.ec",
      facultad: "Ingenieria",
      rol: "Administrador",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Dra. María López",
      correo: "mlopez@uleam.edu.ec",
      facultad: "Ingeniería",
      rol: "Docente",
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Ing. Carlos Vera",
      correo: "cvera@uleam.edu.ec",
      facultad: "Ingeniería",
      rol: "Administrador",
      estado: "Activo",
    },
    {
      id: 4,
      nombre: "Dra. Ana Torres",
      correo: "atorres@uleam.edu.ec",
      facultad: "Medicina",
      rol: "Docente",
      estado: "Inactivo",
    },
  ],
  faculties: [
    {
      id: 1,
      nombre: "Ciencias de la Educación",
      codigo: "EDU",
      docentes: 28,
      descripcion: "Formación pedagógica",
    },
    {
      id: 2,
      nombre: "Ingeniería",
      codigo: "ING",
      docentes: 35,
      descripcion: "Carreras técnicas",
    },
    {
      id: 3,
      nombre: "Ciencias Médicas",
      codigo: "MED",
      docentes: 22,
      descripcion: "Ciencias de la salud",
    },
    {
      id: 4,
      nombre: "Ciencias Administrativas",
      codigo: "ADM",
      docentes: 18,
      descripcion: "Gestión empresarial",
    },
  ],
};

// Utilidades
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon =
    type === "success"
      ? '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

  toast.innerHTML = `
        ${icon}
        <div class="toast-message">${message}</div>
    `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  renderProfileView();
  renderReportsView();
  renderAdminView();
});

function initializeApp() {
  // Menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  menuToggle.addEventListener("click", () => {
    state.sidebarOpen = !state.sidebarOpen;
    sidebar.classList.toggle("closed");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    state.sidebarOpen = false;
    sidebar.classList.add("closed");
    overlay.classList.remove("active");
  });

  // Role selector
  const roleSelect = document.getElementById("role-select");
  roleSelect.addEventListener("change", (e) => {
    state.userRole = e.target.value;
    updateRoleDisplay();
    updateNavigationVisibility();
  });

  // Navigation
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const view = item.getAttribute("data-view");
      switchView(view);

      // Close sidebar on mobile
      if (window.innerWidth < 1024) {
        sidebar.classList.add("closed");
        overlay.classList.remove("active");
      }
    });
  });
}

function updateRoleDisplay() {
  const roleBadge = document.getElementById("role-badge");
  if (state.userRole === "administrador") {
    roleBadge.textContent = "Modo Administrador";
    roleBadge.className = "badge badge-primary";
  } else {
    roleBadge.textContent = "Modo Docente";
    roleBadge.className = "badge badge-secondary";
  }
}

function updateNavigationVisibility() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const view = item.getAttribute("data-view");
    if (view === "profile") {
      item.classList.remove("hidden");
    } else if (state.userRole === "administrador") {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });

  // Si el usuario es docente y está en vista de admin o reports, cambiar a perfil
  if (
    state.userRole === "docente" &&
    (state.activeView === "admin" || state.activeView === "reports")
  ) {
    switchView("profile");
  }
}

function switchView(view) {
  state.activeView = view;

  // Update navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    if (item.getAttribute("data-view") === view) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update views
  document.querySelectorAll(".view-container").forEach((container) => {
    container.classList.remove("active");
  });
  document.getElementById(`${view}-view`).classList.add("active");
}

// PERFIL DE USUARIO
function renderProfileView() {
  const container = document.getElementById("profile-view");
  container.innerHTML = `
        <div class="space-y-6">
            <!-- Información Personal -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Información Personal
                    </h2>
                    <p class="card-description">Visualiza y edita tu información personal</p>
                </div>
                <div class="card-content">
                    <form id="profile-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="nombre">Nombre Completo</label>
                                <input type="text" id="nombre" value="${
                                  state.userInfo.nombre
                                }">
                            </div>
                            <div class="form-group">
                                <label for="correo">Correo Electrónico</label>
                                <input type="email" id="correo" value="${
                                  state.userInfo.correo
                                }">
                            </div>
                            <div class="form-group">
                                <label for="facultad">Facultad</label>
                                <input type="text" id="facultad" value="${
                                  state.userInfo.facultad
                                }">
                            </div>
                            <div class="form-group">
                                <label for="departamento">Departamento</label>
                                <input type="text" id="departamento" value="${
                                  state.userInfo.departamento
                                }">
                            </div>
                            <div class="form-group">
                                <label for="cedula">Cédula</label>
                                <input type="text" id="cedula" value="${
                                  state.userInfo.cedula
                                }">
                            </div>
                            <div class="form-group">
                                <label for="telefono">Teléfono</label>
                                <input type="tel" id="telefono" value="${
                                  state.userInfo.telefono
                                }">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">Guardar Cambios</button>
                    </form>
                </div>
            </div>

            <!-- Historial de Asistencia -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Historial de Asistencia Personal
                    </h2>
                    <p class="card-description">Últimos registros de asistencia</p>
                </div>
                <div class="card-content">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                    <th>Horas Trabajadas</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.attendanceHistory
                                  .map(
                                    (record) => `
                                    <tr>
                                        <td>${record.fecha}</td>
                                        <td>${record.entrada}</td>
                                        <td>${record.salida}</td>
                                        <td>${record.horas}</td>
                                        <td>${getStatusBadge(
                                          record.estado
                                        )}</td>
                                    </tr>
                                `
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Configuración de Notificaciones -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        Configuración de Notificaciones
                    </h2>
                    <p class="card-description">Gestiona cómo deseas recibir las notificaciones</p>
                </div>
                <div class="card-content">
                    <div class="switch-container">
                        <div class="switch-label-group">
                            <label>Notificaciones por Email</label>
                            <p class="switch-description">Recibir notificaciones en tu correo electrónico</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${
                              state.notifications.email ? "checked" : ""
                            } data-notification="email">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="separator"></div>
                    <div class="switch-container">
                        <div class="switch-label-group">
                            <label>Recordatorios de Asistencia</label>
                            <p class="switch-description">Recordatorios diarios para marcar asistencia</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${
                              state.notifications.recordatorios ? "checked" : ""
                            } data-notification="recordatorios">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="separator"></div>
                    <div class="switch-container">
                        <div class="switch-label-group">
                            <label>Reportes Mensuales</label>
                            <p class="switch-description">Recibir reportes mensuales de asistencia</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" ${
                              state.notifications.reportes ? "checked" : ""
                            } data-notification="reportes">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <button class="btn btn-primary" id="save-notifications" style="margin-top: 1rem;">Guardar Preferencias</button>
                </div>
            </div>

            <!-- Cambiar Contraseña -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Cambiar Contraseña
                    </h2>
                    <p class="card-description">Actualiza tu contraseña de acceso al sistema</p>
                </div>
                <div class="card-content">
                    <form id="password-form">
                        <div class="form-group">
                            <label for="current-password">Contraseña Actual</label>
                            <input type="password" id="current-password">
                        </div>
                        <div class="form-group">
                            <label for="new-password">Nueva Contraseña</label>
                            <input type="password" id="new-password">
                        </div>
                        <div class="form-group">
                            <label for="confirm-password">Confirmar Nueva Contraseña</label>
                            <input type="password" id="confirm-password">
                        </div>
                        <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">Actualizar Contraseña</button>
                    </form>
                </div>
            </div>
        </div>
    `;

  // Event listeners
  document.getElementById("profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    state.userInfo.nombre = document.getElementById("nombre").value;
    state.userInfo.correo = document.getElementById("correo").value;
    state.userInfo.facultad = document.getElementById("facultad").value;
    state.userInfo.departamento = document.getElementById("departamento").value;
    state.userInfo.cedula = document.getElementById("cedula").value;
    state.userInfo.telefono = document.getElementById("telefono").value;
    showToast("Perfil actualizado correctamente");
  });

  document.querySelectorAll("[data-notification]").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-notification");
      state.notifications[key] = e.target.checked;
    });
  });

  document
    .getElementById("save-notifications")
    .addEventListener("click", () => {
      showToast("Preferencias de notificaciones guardadas");
    });

  document.getElementById("password-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    showToast("Contraseña actualizada correctamente");
    document.getElementById("password-form").reset();
  });
}

function getStatusBadge(status) {
  const badges = {
    Presente: '<span class="badge badge-success">✓ Presente</span>',
    Ausente: '<span class="badge badge-danger">✗ Ausente</span>',
    Parcial: '<span class="badge badge-warning">Parcial</span>',
  };
  return badges[status] || status;
}

// REPORTES Y ESTADÍSTICAS
function renderReportsView() {
  const container = document.getElementById("reports-view");
  container.innerHTML = `
        <div class="space-y-6">
            <!-- Filtros -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        Filtros de Reporte
                    </h2>
                    <p class="card-description">Selecciona el rango de fechas y filtros para generar el reporte</p>
                </div>
                <div class="card-content">
                    <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                        <div class="form-group">
                            <label for="fecha-desde">Fecha Desde</label>
                            <input type="date" id="fecha-desde">
                        </div>
                        <div class="form-group">
                            <label for="fecha-hasta">Fecha Hasta</label>
                            <input type="date" id="fecha-hasta">
                        </div>
                        <div class="form-group">
                            <label for="facultad-filter">Facultad</label>
                            <select id="facultad-filter">
                                <option value="all">Todas las Facultades</option>
                                <option value="educacion">Ciencias de la Educación</option>
                                <option value="ingenieria">Ingeniería</option>
                                <option value="medicas">Ciencias Médicas</option>
                                <option value="administrativas">Ciencias Administrativas</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="departamento-filter">Departamento</label>
                            <select id="departamento-filter">
                                <option value="all">Todos los Departamentos</option>
                                <option value="pedagogia">Pedagogía</option>
                                <option value="sistemas">Sistemas</option>
                                <option value="civil">Civil</option>
                                <option value="medicina">Medicina General</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                        <button class="btn btn-primary" onclick="showToast('Generando reporte en PDF...')">
                            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            Exportar a PDF
                        </button>
                        <button class="btn btn-outline" onclick="showToast('Generando reporte en Excel...')">
                            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Exportar a Excel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Estadísticas -->
            <div class="stats-grid">
                <div class="stat-card">
                    <p class="stat-label">Total Docentes</p>
                    <p class="stat-value">103</p>
                    <p class="stat-change positive">+5 vs mes anterior</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Asistencia Promedio</p>
                    <p class="stat-value">94.2%</p>
                    <p class="stat-change positive">+2.1% vs mes anterior</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Ausencias del Mes</p>
                    <p class="stat-value">23</p>
                    <p class="stat-change negative">-3 vs mes anterior</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Horas Totales</p>
                    <p class="stat-value">8,432</p>
                    <p class="stat-change">Este mes</p>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="charts-grid">
                <!-- Gráfico de Barras - Asistencia Semanal -->
                <div class="chart-container">
                    <h3 style="margin-bottom: 0.5rem;">Asistencia Semanal</h3>
                    <p class="card-description" style="margin-bottom: 1rem;">Distribución de asistencia por día de la semana</p>
                    <div style="height: 300px; padding: 1rem;">
                        <svg viewBox="0 0 500 280" style="width: 100%; height: 100%;">
                            <!-- Eje Y -->
                            <line x1="40" y1="10" x2="40" y2="240" stroke="#e5e7eb" stroke-width="2"/>
                            <!-- Eje X -->
                            <line x1="40" y1="240" x2="480" y2="240" stroke="#e5e7eb" stroke-width="2"/>
                            
                            <!-- Etiquetas Y -->
                            <text x="30" y="15" text-anchor="end" font-size="10" fill="#6b7280">50</text>
                            <text x="30" y="125" text-anchor="end" font-size="10" fill="#6b7280">25</text>
                            <text x="30" y="245" text-anchor="end" font-size="10" fill="#6b7280">0</text>
                            
                            <!-- Barras Presentes (Verde) -->
                            <rect x="60" y="42" width="30" height="198" fill="#10b981" opacity="0.8"/>
                            <rect x="150" y="33" width="30" height="207" fill="#10b981" opacity="0.8"/>
                            <rect x="240" y="38" width="30" height="202" fill="#10b981" opacity="0.8"/>
                            <rect x="330" y="35" width="30" height="205" fill="#10b981" opacity="0.8"/>
                            <rect x="420" y="46" width="30" height="194" fill="#10b981" opacity="0.8"/>
                            
                            <!-- Barras Ausentes (Rojo) -->
                            <rect x="60" y="20" width="30" height="22" fill="#ef4444" opacity="0.8"/>
                            <rect x="150" y="29" width="30" height="4" fill="#ef4444" opacity="0.8"/>
                            <rect x="240" y="30" width="30" height="8" fill="#ef4444" opacity="0.8"/>
                            <rect x="330" y="29" width="30" height="6" fill="#ef4444" opacity="0.8"/>
                            <rect x="420" y="34" width="30" height="12" fill="#ef4444" opacity="0.8"/>
                            
                            <!-- Barras Parcial (Amarillo) -->
                            <rect x="60" y="16" width="30" height="4" fill="#f59e0b" opacity="0.8"/>
                            <rect x="150" y="25" width="30" height="4" fill="#f59e0b" opacity="0.8"/>
                            <rect x="240" y="26" width="30" height="4" fill="#f59e0b" opacity="0.8"/>
                            <rect x="330" y="25" width="30" height="4" fill="#f59e0b" opacity="0.8"/>
                            <rect x="420" y="30" width="30" height="4" fill="#f59e0b" opacity="0.8"/>
                            
                            <!-- Etiquetas X -->
                            <text x="75" y="260" text-anchor="middle" font-size="12" fill="#374151">Lun</text>
                            <text x="165" y="260" text-anchor="middle" font-size="12" fill="#374151">Mar</text>
                            <text x="255" y="260" text-anchor="middle" font-size="12" fill="#374151">Mié</text>
                            <text x="345" y="260" text-anchor="middle" font-size="12" fill="#374151">Jue</text>
                            <text x="435" y="260" text-anchor="middle" font-size="12" fill="#374151">Vie</text>
                        </svg>
                        <!-- Leyenda -->
                        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.25rem;">
                                <div style="width: 12px; height: 12px; background-color: #10b981; border-radius: 2px;"></div>
                                <span style="font-size: 0.75rem; color: #6b7280;">Presentes</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.25rem;">
                                <div style="width: 12px; height: 12px; background-color: #ef4444; border-radius: 2px;"></div>
                                <span style="font-size: 0.75rem; color: #6b7280;">Ausentes</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.25rem;">
                                <div style="width: 12px; height: 12px; background-color: #f59e0b; border-radius: 2px;"></div>
                                <span style="font-size: 0.75rem; color: #6b7280;">Parcial</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Gráfico de Línea - Tendencia -->
                <div class="chart-container">
                    <h3 style="margin-bottom: 0.5rem;">Tendencia de Asistencia</h3>
                    <p class="card-description" style="margin-bottom: 1rem;">Porcentaje de asistencia mensual</p>
                    <div style="height: 300px; padding: 1rem;">
                        <svg viewBox="0 0 500 280" style="width: 100%; height: 100%;">
                            <!-- Eje Y -->
                            <line x1="40" y1="10" x2="40" y2="240" stroke="#e5e7eb" stroke-width="2"/>
                            <!-- Eje X -->
                            <line x1="40" y1="240" x2="480" y2="240" stroke="#e5e7eb" stroke-width="2"/>
                            
                            <!-- Etiquetas Y (80-100%) -->
                            <text x="30" y="15" text-anchor="end" font-size="10" fill="#6b7280">100%</text>
                            <text x="30" y="70" text-anchor="end" font-size="10" fill="#6b7280">95%</text>
                            <text x="30" y="125" text-anchor="end" font-size="10" fill="#6b7280">90%</text>
                            <text x="30" y="180" text-anchor="end" font-size="10" fill="#6b7280">85%</text>
                            <text x="30" y="235" text-anchor="end" font-size="10" fill="#6b7280">80%</text>
                            
                            <!-- Líneas de grid horizontales -->
                            <line x1="40" y1="65" x2="480" y2="65" stroke="#f3f4f6" stroke-width="1"/>
                            <line x1="40" y1="120" x2="480" y2="120" stroke="#f3f4f6" stroke-width="1"/>
                            <line x1="40" y1="175" x2="480" y2="175" stroke="#f3f4f6" stroke-width="1"/>
                            <line x1="40" y1="230" x2="480" y2="230" stroke="#f3f4f6" stroke-width="1"/>
                            
                            <!-- Línea de tendencia (92%, 89%, 94%, 91%, 95%) -->
                            <polyline points="70,98 160,141 250,76 340,120 430,54" fill="none" stroke="#3b82f6" stroke-width="3"/>
                            
                            <!-- Puntos en la línea -->
                            <circle cx="70" cy="98" r="4" fill="#3b82f6"/>
                            <circle cx="160" cy="141" r="4" fill="#3b82f6"/>
                            <circle cx="250" cy="76" r="4" fill="#3b82f6"/>
                            <circle cx="340" cy="120" r="4" fill="#3b82f6"/>
                            <circle cx="430" cy="54" r="4" fill="#3b82f6"/>
                            
                            <!-- Valores en puntos -->
                            <text x="70" y="90" text-anchor="middle" font-size="10" fill="#3b82f6">92%</text>
                            <text x="160" y="133" text-anchor="middle" font-size="10" fill="#3b82f6">89%</text>
                            <text x="250" y="68" text-anchor="middle" font-size="10" fill="#3b82f6">94%</text>
                            <text x="340" y="112" text-anchor="middle" font-size="10" fill="#3b82f6">91%</text>
                            <text x="430" y="46" text-anchor="middle" font-size="10" fill="#3b82f6">95%</text>
                            
                            <!-- Etiquetas X -->
                            <text x="70" y="260" text-anchor="middle" font-size="12" fill="#374151">Jun</text>
                            <text x="160" y="260" text-anchor="middle" font-size="12" fill="#374151">Jul</text>
                            <text x="250" y="260" text-anchor="middle" font-size="12" fill="#374151">Ago</text>
                            <text x="340" y="260" text-anchor="middle" font-size="12" fill="#374151">Sep</text>
                            <text x="430" y="260" text-anchor="middle" font-size="12" fill="#374151">Oct</text>
                        </svg>
                    </div>
                </div>
                
                <!-- Gráfico Circular - Asistencia por Facultad -->
                <div class="chart-container">
                    <h3 style="margin-bottom: 0.5rem;">Asistencia por Facultad</h3>
                    <p class="card-description" style="margin-bottom: 1rem;">Distribución de docentes por facultad</p>
                    <div style="height: 300px; padding: 1rem; display: flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 200 200" style="width: 200px; height: 200px;">
                            <!-- Educación: 28 (27%) -->
                            <circle cx="100" cy="100" r="80" fill="transparent" stroke="#3b82f6" stroke-width="25"
                                    stroke-dasharray="135 500" stroke-dashoffset="0" transform="rotate(-90 100 100)"/>
                            <!-- Ingeniería: 35 (34%) -->
                            <circle cx="100" cy="100" r="80" fill="transparent" stroke="#10b981" stroke-width="25"
                                    stroke-dasharray="170 500" stroke-dashoffset="-135" transform="rotate(-90 100 100)"/>
                            <!-- Médicas: 22 (21%) -->
                            <circle cx="100" cy="100" r="80" fill="transparent" stroke="#f59e0b" stroke-width="25"
                                    stroke-dasharray="105 500" stroke-dashoffset="-305" transform="rotate(-90 100 100)"/>
                            <!-- Administrativas: 18 (18%) -->
                            <circle cx="100" cy="100" r="80" fill="transparent" stroke="#ef4444" stroke-width="25"
                                    stroke-dasharray="90 500" stroke-dashoffset="-410" transform="rotate(-90 100 100)"/>
                            <!-- Centro blanco -->
                            <circle cx="100" cy="100" r="50" fill="white"/>
                        </svg>
                        <div style="margin-left: 1.5rem;">
                            <div style="margin-bottom: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div style="width: 12px; height: 12px; background-color: #3b82f6; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem;">Ciencias Educación (27%)</span>
                                </div>
                            </div>
                            <div style="margin-bottom: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div style="width: 12px; height: 12px; background-color: #10b981; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem;">Ingeniería (34%)</span>
                                </div>
                            </div>
                            <div style="margin-bottom: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div style="width: 12px; height: 12px; background-color: #f59e0b; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem;">Ciencias Médicas (21%)</span>
                                </div>
                            </div>
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <div style="width: 12px; height: 12px; background-color: #ef4444; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem;">Administrativas (18%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Gráfico Circular - Puntualidad -->
                <div class="chart-container">
                    <h3 style="margin-bottom: 0.5rem;">Puntualidad Mensual</h3>
                    <p class="card-description" style="margin-bottom: 1rem;">Llegadas a tiempo vs tardías</p>
                    <div style="height: 300px; padding: 1rem; display: flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 200 200" style="width: 200px; height: 200px;">
                            <!-- A tiempo: 87% -->
                            <circle cx="100" cy="100" r="80" fill="transparent" stroke="#10b981" stroke-width="25"
                                    stroke-dasharray="435 500" stroke-dashoffset="0" transform="rotate(-90 100 100)"/>
                            <!-- Tardías: 13% -->
                            <circle cx="100" cy="100" r="80" fill="transparent" stroke="#f59e0b" stroke-width="25"
                                    stroke-dasharray="65 500" stroke-dashoffset="-435" transform="rotate(-90 100 100)"/>
                            <!-- Centro blanco -->
                            <circle cx="100" cy="100" r="50" fill="white"/>
                            <!-- Porcentaje en el centro -->
                            <text x="100" y="95" text-anchor="middle" font-size="24" font-weight="bold" fill="#10b981">87%</text>
                            <text x="100" y="115" text-anchor="middle" font-size="12" fill="#6b7280">A tiempo</text>
                        </svg>
                        <div style="margin-left: 1.5rem;">
                            <div style="margin-bottom: 1rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                    <div style="width: 12px; height: 12px; background-color: #10b981; border-radius: 2px;"></div>
                                    <span style="font-size: 0.875rem; font-weight: 500;">A tiempo</span>
                                </div>
                                <p style="font-size: 0.75rem; color: #6b7280; margin-left: 1.25rem;">872 registros (87%)</p>
                            </div>
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                    <div style="width: 12px; height: 12px; background-color: #f59e0b; border-radius: 2px;"></div>
                                    <span style="font-size: 0.875rem; font-weight: 500;">Tardías</span>
                                </div>
                                <p style="font-size: 0.75rem; color: #6b7280; margin-left: 1.25rem;">128 registros (13%)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ADMINISTRACIÓN
function renderAdminView() {
  const container = document.getElementById("admin-view");
  container.innerHTML = `
        <div class="tabs">
            <div class="tabs-list">
                <button class="tab-trigger active" data-tab="users">
                    <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Usuarios
                </button>
                <button class="tab-trigger" data-tab="faculties">
                    <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Facultades
                </button>
                <button class="tab-trigger" data-tab="schedule">
                    <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Horarios
                </button>
                <button class="tab-trigger" data-tab="config">
                    <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6"></path>
                    </svg>
                    Configuración
                </button>
            </div>

            ${renderUsersTab()}
            ${renderFacultiesTab()}
            ${renderScheduleTab()}
            ${renderConfigTab()}
        </div>
    `;

  // Tab switching
  document.querySelectorAll(".tab-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      const tab = e.currentTarget.getAttribute("data-tab");
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  document
    .querySelectorAll(".tab-trigger")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.remove("active"));

  document.querySelector(`[data-tab="${tab}"]`).classList.add("active");
  document.getElementById(`tab-${tab}`).classList.add("active");
}

function renderUsersTab() {
  return `
        <div id="tab-users" class="tab-content active">
            <div class="card">
                <div class="card-header">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h2 class="card-title">Gestión de Usuarios</h2>
                            <p class="card-description">Administra los usuarios del sistema</p>
                        </div>
                        <button class="btn btn-primary" onclick="showToast('Funcionalidad de agregar usuario')">
                            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Nuevo Usuario
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div style="position: relative; margin-bottom: 1rem;">
                        <input type="text" placeholder="Buscar usuarios..." id="user-search" style="padding-left: 2.5rem;">
                        <svg style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: #9ca3af;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Facultad</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="users-tbody">
                                ${renderUsersTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderUsersTable(searchTerm = "") {
  const filteredUsers = state.users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return filteredUsers
    .map(
      (user) => `
        <tr>
            <td>${user.nombre}</td>
            <td>${user.correo}</td>
            <td>${user.facultad}</td>
            <td>
                <span class="badge ${
                  user.rol === "Administrador"
                    ? "badge-primary"
                    : "badge-secondary"
                }">
                    ${user.rol}
                </span>
            </td>
            <td>
                <span class="badge ${
                  user.estado === "Activo" ? "badge-success" : "badge-outline"
                }">
                    ${user.estado}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-outline" onclick="showToast('Editar usuario: ${
                      user.nombre
                    }')">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="showToast('Usuario eliminado correctamente')">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

function renderFacultiesTab() {
  return `
        <div id="tab-faculties" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h2 class="card-title">Gestión de Facultades y Departamentos</h2>
                            <p class="card-description">Administra las facultades y departamentos</p>
                        </div>
                        <button class="btn btn-primary" onclick="showToast('Funcionalidad de agregar facultad')">
                            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Nueva Facultad
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>N° Docentes</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.faculties
                                  .map(
                                    (faculty) => `
                                    <tr>
                                        <td><span class="badge badge-outline">${faculty.codigo}</span></td>
                                        <td>${faculty.nombre}</td>
                                        <td>${faculty.descripcion}</td>
                                        <td>${faculty.docentes}</td>
                                        <td>
                                            <div style="display: flex; gap: 0.5rem;">
                                                <button class="btn btn-sm btn-outline" onclick="showToast('Editar facultad')">
                                                    <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button class="btn btn-sm btn-outline" onclick="showToast('Facultad eliminada')">
                                                    <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderScheduleTab() {
  return `
        <div id="tab-schedule" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Configuración de Horarios Laborales</h2>
                    <p class="card-description">Define los horarios de trabajo y días laborales</p>
                </div>
                <div class="card-content">
                    <div class="form-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 1.5rem;">
                        <div class="form-group">
                            <label for="hora-entrada">Hora de Entrada</label>
                            <input type="time" id="hora-entrada" value="07:00">
                        </div>
                        <div class="form-group">
                            <label for="hora-salida">Hora de Salida</label>
                            <input type="time" id="hora-salida" value="18:30">
                        </div>
                        <div class="form-group">
                            <label for="tiempo-gracia">Tiempo de Gracia (minutos)</label>
                            <input type="number" id="tiempo-gracia" value="15">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="margin-bottom: 1rem; display: block;">Días Laborales</label>
                        ${[
                          "Lunes",
                          "Martes",
                          "Miércoles",
                          "Jueves",
                          "Viernes",
                          "Sábado",
                          "Domingo",
                        ]
                          .map(
                            (dia, i) => `
                            <div class="switch-container">
                                <label style="text-transform: capitalize; margin: 0;">${dia}</label>
                                <label class="switch">
                                    <input type="checkbox" ${
                                      i < 5 ? "checked" : ""
                                    }>
                                    <span class="slider"></span>
                                </label>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                    
                    <button class="btn btn-primary" onclick="showToast('Horarios laborales actualizados')">
                        Guardar Horarios
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderConfigTab() {
  return `
        <div id="tab-config" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Configuración General del Sistema</h2>
                    <p class="card-description">Ajusta las configuraciones generales de la aplicación</p>
                </div>
                <div class="card-content">
                    <div class="form-group">
                        <label for="nombre-institucion">Nombre de la Institución</label>
                        <input type="text" id="nombre-institucion" value="Universidad Laica Eloy Alfaro de Manabí">
                    </div>
                    <div class="form-group">
                        <label for="periodo-academico">Período Académico Actual</label>
                        <select id="periodo-academico">
                            <option value="2025-1">2025 - Primer Semestre</option>
                            <option value="2025-2" selected>2025 - Segundo Semestre</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tolerancia-tardanza">Tolerancia de Tardanza (minutos)</label>
                        <input type="number" id="tolerancia-tardanza" value="15">
                    </div>
                    
                    <div class="switch-container" style="padding: 1rem 0;">
                        <div class="switch-label-group">
                            <label>Permitir Registro Manual</label>
                            <p class="switch-description">Permite que administradores registren asistencia manualmente</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="switch-container" style="padding: 1rem 0;">
                        <div class="switch-label-group">
                            <label>Notificaciones por Email</label>
                            <p class="switch-description">Enviar notificaciones automáticas a los docentes</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="switch-container" style="padding: 1rem 0;">
                        <div class="switch-label-group">
                            <label>Reportes Automáticos</label>
                            <p class="switch-description">Generar reportes mensuales automáticamente</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <button class="btn btn-primary" onclick="showToast('Configuración del sistema guardada')" style="margin-top: 1rem;">
                        Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Búsqueda de usuarios
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const searchInput = document.getElementById("user-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const tbody = document.getElementById("users-tbody");
        if (tbody) {
          tbody.innerHTML = renderUsersTable(e.target.value);
        }
      });
    }
  }, 100);
});
// Agregar listener para cerrar sesión -> redirige al login
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    window.location.href = "index.html";
  });
}
// Agregar listener para regresar -> redirige al landpage
const backtBtn = document.getElementById("back");
if (backtBtn) {
  backtBtn.addEventListener("click", function () {
    window.location.href = "lanpag.html";
  });
}