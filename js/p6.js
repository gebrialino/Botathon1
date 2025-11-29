// ===== AUTENTICACIÓN =====
const ADMIN_USER = 'admin';
const ADMIN_PASS = '1234';

let currentView = 'inicio';
let isAuthenticated = false;

function login() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        // Mostrar verificación 2FA
        document.getElementById('login-card').classList.add('hidden');
        document.getElementById('verification-card').classList.remove('hidden');
    } else {
        alert('❌ Usuario o contraseña incorrectos');
    }
}

function verify2FA() {
    const code = document.getElementById('verification-code').value;

    if (code.length === 6 && /^\d{6}$/.test(code)) {
        isAuthenticated = true;
        loadDashboard();
    } else {
        alert('❌ Código inválido. Debe ser de 6 dígitos');
    }
}

function backToLogin() {
    document.getElementById('verification-card').classList.add('hidden');
    document.getElementById('login-card').classList.remove('hidden');
    document.getElementById('login-pass').value = '';
    document.getElementById('verification-code').value = '';
}

function logout() {
    isAuthenticated = false;
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('auth-view').classList.remove('hidden');
    document.getElementById('login-card').classList.remove('hidden');
    document.getElementById('verification-card').classList.add('hidden');
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    document.getElementById('verification-code').value = '';
}

function loadDashboard() {
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    switchView('inicio');
}

// ===== NAVEGACIÓN =====
function switchView(viewName) {
    currentView = viewName;

    // Actualizar menú activo
    const menuItems = document.querySelectorAll('.sidebar nav .menu-item');
    menuItems.forEach(item => item.classList.remove('active'));

    const menuIndex = {
        'inicio': 0,
        'agenda': 1,
        'pacientes': 2,
        'equipo': 3,
        'inventario': 4,
        'reportes': 5,
        'configuracion': 6
    };

    if (menuIndex[viewName] !== undefined) {
        menuItems[menuIndex[viewName]].classList.add('active');
    }

    renderContent();
}

function renderContent() {
    const contentDiv = document.getElementById('dynamic-content');
    const dashTitle = document.getElementById('dash-title');
    const dashSubtitle = document.getElementById('dash-subtitle');

    let html = '';

    switch (currentView) {
        case 'inicio':
            dashTitle.innerText = 'Panel de Control';
            dashSubtitle.innerText = 'Resumen General del Sistema';
            html = renderInicio();
            break;
        case 'agenda':
            dashTitle.innerText = 'Gestión de Agenda';
            dashSubtitle.innerText = 'Coordinación de Actividades y Horarios';
            html = renderAgenda();
            break;
        case 'pacientes':
            dashTitle.innerText = 'Gestión de Pacientes';
            dashSubtitle.innerText = 'Documentación y Seguimiento';
            html = renderPacientes();
            break;
        case 'equipo':
            dashTitle.innerText = 'Supervisión de Equipo';
            dashSubtitle.innerText = 'Control de Personal y Profesionales';
            html = renderEquipo();
            break;
        case 'inventario':
            dashTitle.innerText = 'Gestión de Recursos';
            dashSubtitle.innerText = 'Inventario de Materiales y Equipos';
            html = renderInventario();
            break;
        case 'reportes':
            dashTitle.innerText = 'Reportes y Metas';
            dashSubtitle.innerText = 'Control de Cumplimiento y Estadísticas';
            html = renderReportes();
            break;
        case 'configuracion':
            dashTitle.innerText = 'Configuración';
            dashSubtitle.innerText = 'Ajustes del Sistema';
            html = renderConfiguracion();
            break;
    }

    contentDiv.innerHTML = html;
}

// ===== VISTAS =====

function renderInicio() {
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <h3><i class="fa-solid fa-user-injured"></i> Pacientes Hoy</h3>
                <div class="value">145 / 160</div>
                <p style="font-size:0.8rem; color:var(--text-gray)">91% de ocupación</p>
            </div>
            <div class="stat-card green">
                <h3><i class="fa-solid fa-user-doctor"></i> Personal Activo</h3>
                <div class="value">28 / 32</div>
                <p style="font-size:0.8rem; color:var(--text-gray)">4 ausentes hoy</p>
            </div>
            <div class="stat-card orange">
                <h3><i class="fa-solid fa-triangle-exclamation"></i> Alertas</h3>
                <div class="value">3</div>
                <p style="font-size:0.8rem; color:var(--text-gray)">Requieren atención</p>
            </div>
            <div class="stat-card blue">
                <h3><i class="fa-solid fa-chart-line"></i> Cumplimiento</h3>
                <div class="value">94%</div>
                <p style="font-size:0.8rem; color:var(--text-gray)">Meta mensual</p>
            </div>
        </div>

        <div class="content-card">
            <h3><i class="fa-solid fa-bell"></i> Alertas y Problemas Pendientes</h3>
            <div style="margin-top:15px;">
                <div style="padding:12px; background:rgba(239,68,68,0.1); border-left:3px solid #ef4444; margin-bottom:10px; border-radius:4px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>Stock Bajo: Vendas Elásticas</strong>
                            <p style="font-size:0.85rem; color:var(--text-gray); margin:5px 0 0 0;">Quedan solo 12 unidades. Reorden necesario.</p>
                        </div>
                        <button class="btn-sm" onclick="switchView('inventario')">Revisar</button>
                    </div>
                </div>
                <div style="padding:12px; background:rgba(251,191,36,0.1); border-left:3px solid #fbbf24; margin-bottom:10px; border-radius:4px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>Kinesiólogo Ausente</strong>
                            <p style="font-size:0.85rem; color:var(--text-gray); margin:5px 0 0 0;">Dr. Pedro López - 8 pacientes requieren reagendamiento.</p>
                        </div>
                        <button class="btn-sm" onclick="switchView('agenda')">Resolver</button>
                    </div>
                </div>
                <div style="padding:12px; background:rgba(251,191,36,0.1); border-left:3px solid #fbbf24; border-radius:4px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>Sala de Hidroterapia Ocupada</strong>
                            <p style="font-size:0.85rem; color:var(--text-gray); margin:5px 0 0 0;">Mantenimiento programado excedió el tiempo estimado.</p>
                        </div>
                        <button class="btn-sm" onclick="alert('✅ Notificación enviada al equipo de mantenimiento')">Notificar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-card">
            <h3><i class="fa-solid fa-clock"></i> Actividades de Hoy</h3>
            <table>
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Actividad</th>
                        <th>Responsable</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>09:00</td>
                        <td>Reunión de Coordinación</td>
                        <td>Equipo Médico</td>
                        <td><span style="color:var(--success)">Completado</span></td>
                    </tr>
                    <tr>
                        <td>14:00</td>
                        <td>Revisión de Inventario</td>
                        <td>Administración</td>
                        <td><span style="color:#fbbf24">En Curso</span></td>
                    </tr>
                    <tr>
                        <td>16:00</td>
                        <td>Reporte Semanal</td>
                        <td>Dirección</td>
                        <td><span style="color:var(--text-gray)">Pendiente</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function renderAgenda() {
    return `
        <div class="content-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3><i class="fa-solid fa-calendar-days"></i> Agenda Maestra</h3>
                <button class="btn-primary" onclick="alert('✅ Función: Agregar nueva cita')"><i class="fa-solid fa-plus"></i> Nueva Cita</button>
            </div>
            
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <select style="padding:8px; border-radius:6px; border:1px solid #444; background:rgba(0,0,0,0.2); color:white;">
                    <option>Todas las Especialidades</option>
                    <option>Kinesiología</option>
                    <option>Terapia Ocupacional</option>
                    <option>Fonoaudiología</option>
                    <option>Psicología</option>
                </select>
                <select style="padding:8px; border-radius:6px; border:1px solid #444; background:rgba(0,0,0,0.2); color:white;">
                    <option>Hoy</option>
                    <option>Mañana</option>
                    <option>Esta Semana</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Paciente</th>
                        <th>Profesional</th>
                        <th>Actividad</th>
                        <th>Sala</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>09:00</td>
                        <td>Juan Pérez</td>
                        <td>Dra. Ana Torres</td>
                        <td>Kinesiología Motora</td>
                        <td>Sala 3</td>
                        <td><span style="color:var(--success)">Confirmado</span></td>
                        <td><button class="btn-sm">Editar</button></td>
                    </tr>
                    <tr>
                        <td>09:30</td>
                        <td>María González</td>
                        <td>Lic. Carlos Ruiz</td>
                        <td>Terapia Ocupacional</td>
                        <td>Sala 1</td>
                        <td><span style="color:var(--success)">Confirmado</span></td>
                        <td><button class="btn-sm">Editar</button></td>
                    </tr>
                    <tr style="background:rgba(239,68,68,0.1);">
                        <td>10:00</td>
                        <td>Pedro Sánchez</td>
                        <td>Dr. Pedro López</td>
                        <td>Kinesiología</td>
                        <td>Sala 2</td>
                        <td><span style="color:#ef4444">Cancelado</span></td>
                        <td><button class="btn-sm" onclick="alert('✅ Reagendando cita...')">Reagendar</button></td>
                    </tr>
                    <tr>
                        <td>10:30</td>
                        <td>Ana López</td>
                        <td>Dra. Laura Medina</td>
                        <td>Fonoaudiología</td>
                        <td>Sala 4</td>
                        <td><span style="color:var(--success)">Confirmado</span></td>
                        <td><button class="btn-sm">Editar</button></td>
                    </tr>
                    <tr>
                        <td>11:00</td>
                        <td>Roberto Díaz</td>
                        <td>Psic. Mario Bravo</td>
                        <td>Evaluación Psicológica</td>
                        <td>Sala 5</td>
                        <td><span style="color:#fbbf24">Pendiente</span></td>
                        <td><button class="btn-sm">Confirmar</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="stats-grid" style="margin-top:20px;">
            <div class="stat-card">
                <h3>Citas Hoy</h3>
                <div class="value">42</div>
            </div>
            <div class="stat-card green">
                <h3>Confirmadas</h3>
                <div class="value">38</div>
            </div>
            <div class="stat-card orange">
                <h3>Pendientes</h3>
                <div class="value">3</div>
            </div>
            <div class="stat-card" style="background:rgba(239,68,68,0.1);">
                <h3>Canceladas</h3>
                <div class="value">1</div>
            </div>
        </div>
    `;
}

function renderPacientes() {
    return `
        <div class="content-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3><i class="fa-solid fa-user-group"></i> Registro de Pacientes</h3>
                <div style="display:flex; gap:10px;">
                    <input type="text" placeholder="Buscar paciente..." style="padding:8px; border-radius:6px; border:1px solid #444; background:rgba(0,0,0,0.2); color:white;">
                    <button class="btn-primary"><i class="fa-solid fa-plus"></i> Nuevo Paciente</button>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>RUT</th>
                        <th>Nombre Completo</th>
                        <th>Edad</th>
                        <th>Diagnóstico</th>
                        <th>Última Atención</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>12.345.678-9</td>
                        <td>Juan Pérez Gómez</td>
                        <td>8 años</td>
                        <td>Parálisis Cerebral</td>
                        <td>28/11/2025</td>
                        <td><span style="color:var(--success)">Activo</span></td>
                        <td><button class="btn-sm" onclick="alert('📋 Ficha Médica:\\n\\nPaciente: Juan Pérez\\nDiagnóstico: Parálisis Cerebral\\nTratamientos: Kinesiología, Terapia Ocupacional\\nPróxima cita: 02/12/2025')">Ver Ficha</button></td>
                    </tr>
                    <tr>
                        <td>21.987.654-3</td>
                        <td>María González Silva</td>
                        <td>12 años</td>
                        <td>Lesión Medular</td>
                        <td>27/11/2025</td>
                        <td><span style="color:var(--success)">Activo</span></td>
                        <td><button class="btn-sm" onclick="alert('📋 Ficha Médica:\\n\\nPaciente: María González\\nDiagnóstico: Lesión Medular\\nTratamientos: Rehabilitación Física\\nPróxima cita: 01/12/2025')">Ver Ficha</button></td>
                    </tr>
                    <tr>
                        <td>15.432.198-K</td>
                        <td>Carlos Ruiz Morales</td>
                        <td>6 años</td>
                        <td>Amputación EE.II.</td>
                        <td>15/11/2025</td>
                        <td><span style="color:#fbbf24">Seguimiento</span></td>
                        <td><button class="btn-sm" onclick="alert('📋 Ficha Médica:\\n\\nPaciente: Carlos Ruiz\\nDiagnóstico: Amputación\\nTratamientos: Prótesis, Adaptación\\nPróxima cita: 05/12/2025')">Ver Ficha</button></td>
                    </tr>
                    <tr>
                        <td>18.765.432-1</td>
                        <td>Ana López Torres</td>
                        <td>10 años</td>
                        <td>Síndrome de Down</td>
                        <td>29/11/2025</td>
                        <td><span style="color:var(--success)">Activo</span></td>
                        <td><button class="btn-sm" onclick="alert('📋 Ficha Médica:\\n\\nPaciente: Ana López\\nDiagnóstico: Síndrome de Down\\nTratamientos: Fonoaudiología, Terapia\\nPróxima cita: 03/12/2025')">Ver Ficha</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="stats-grid" style="margin-top:20px;">
            <div class="stat-card">
                <h3>Total Pacientes</h3>
                <div class="value">156</div>
            </div>
            <div class="stat-card green">
                <h3>Activos</h3>
                <div class="value">142</div>
            </div>
            <div class="stat-card orange">
                <h3>En Seguimiento</h3>
                <div class="value">14</div>
            </div>
            <div class="stat-card blue">
                <h3>Nuevos (Este Mes)</h3>
                <div class="value">8</div>
            </div>
        </div>
    `;
}

function renderEquipo() {
    return `
        <div class="content-card">
            <h3><i class="fa-solid fa-users-gear"></i> Personal y Profesionales</h3>
            <table style="margin-top:15px;">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Especialidad</th>
                        <th>Pacientes Hoy</th>
                        <th>Carga Semanal</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Dra. Ana Torres</td>
                        <td>Kinesiología</td>
                        <td>12</td>
                        <td>45 / 50</td>
                        <td><span style="color:var(--success)"><i class="fa-solid fa-circle" style="font-size:8px;"></i> Disponible</span></td>
                        <td><button class="btn-sm" onclick="alert('👤 Perfil Profesional:\\n\\nNombre: Dra. Ana Torres\\nEspecialidad: Kinesiología\\nHorario: Lun-Vie 8:00-17:00\\nPacientes asignados: 45')">Ver Perfil</button></td>
                    </tr>
                    <tr>
                        <td>Lic. Carlos Ruiz</td>
                        <td>Terapia Ocupacional</td>
                        <td>8</td>
                        <td>32 / 40</td>
                        <td><span style="color:#fbbf24"><i class="fa-solid fa-circle" style="font-size:8px;"></i> En Sesión</span></td>
                        <td><button class="btn-sm" onclick="alert('👤 Perfil Profesional:\\n\\nNombre: Lic. Carlos Ruiz\\nEspecialidad: Terapia Ocupacional\\nHorario: Lun-Vie 9:00-18:00\\nPacientes asignados: 32')">Ver Perfil</button></td>
                    </tr>
                    <tr style="background:rgba(239,68,68,0.1);">
                        <td>Dr. Pedro López</td>
                        <td>Kinesiología</td>
                        <td>0</td>
                        <td>38 / 50</td>
                        <td><span style="color:#ef4444"><i class="fa-solid fa-circle" style="font-size:8px;"></i> Ausente</span></td>
                        <td><button class="btn-sm" onclick="alert('⚠️ Profesional ausente hoy.\\n8 pacientes requieren reasignación.')">Gestionar</button></td>
                    </tr>
                    <tr>
                        <td>Dra. Laura Medina</td>
                        <td>Fonoaudiología</td>
                        <td>10</td>
                        <td>42 / 45</td>
                        <td><span style="color:var(--success)"><i class="fa-solid fa-circle" style="font-size:8px;"></i> Disponible</span></td>
                        <td><button class="btn-sm" onclick="alert('👤 Perfil Profesional:\\n\\nNombre: Dra. Laura Medina\\nEspecialidad: Fonoaudiología\\nHorario: Lun-Vie 8:30-17:30\\nPacientes asignados: 42')">Ver Perfil</button></td>
                    </tr>
                    <tr>
                        <td>Psic. Mario Bravo</td>
                        <td>Psicología</td>
                        <td>6</td>
                        <td>25 / 35</td>
                        <td><span style="color:var(--success)"><i class="fa-solid fa-circle" style="font-size:8px;"></i> Disponible</span></td>
                        <td><button class="btn-sm" onclick="alert('👤 Perfil Profesional:\\n\\nNombre: Psic. Mario Bravo\\nEspecialidad: Psicología\\nHorario: Lun-Vie 10:00-19:00\\nPacientes asignados: 25')">Ver Perfil</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="stats-grid" style="margin-top:20px;">
            <div class="stat-card">
                <h3>Total Personal</h3>
                <div class="value">32</div>
            </div>
            <div class="stat-card green">
                <h3>Activos Hoy</h3>
                <div class="value">28</div>
            </div>
            <div class="stat-card" style="background:rgba(239,68,68,0.1);">
                <h3>Ausentes</h3>
                <div class="value">4</div>
            </div>
            <div class="stat-card blue">
                <h3>Carga Promedio</h3>
                <div class="value">87%</div>
            </div>
        </div>
    `;
}

function renderInventario() {
    return `
        <div class="content-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3><i class="fa-solid fa-box"></i> Inventario de Recursos</h3>
                <button class="btn-primary" onclick="alert('✅ Función: Registrar nuevo material')"><i class="fa-solid fa-plus"></i> Agregar Material</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Material/Equipo</th>
                        <th>Stock Actual</th>
                        <th>Stock Mínimo</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Terapia</td>
                        <td>Pelotas de Ejercicio</td>
                        <td>45</td>
                        <td>20</td>
                        <td><span style="color:var(--success)">✓ OK</span></td>
                        <td><button class="btn-sm" onclick="alert('✅ Solicitud de reorden enviada')">Reordenar</button></td>
                    </tr>
                    <tr style="background:rgba(239,68,68,0.1);">
                        <td>Médico</td>
                        <td>Vendas Elásticas</td>
                        <td>12</td>
                        <td>30</td>
                        <td><span style="color:#ef4444">⚠️ Bajo</span></td>
                        <td><button class="btn-sm" onclick="alert('✅ Orden de compra generada')">Comprar</button></td>
                    </tr>
                    <tr>
                        <td>Equipamiento</td>
                        <td>Sillas de Ruedas</td>
                        <td>18</td>
                        <td>10</td>
                        <td><span style="color:var(--success)">✓ OK</span></td>
                        <td><button class="btn-sm" onclick="alert('ℹ️ Mantenimiento programado para 3 unidades')">Mantener</button></td>
                    </tr>
                    <tr style="background:rgba(251,191,36,0.1);">
                        <td>Ortopedia</td>
                        <td>Férulas Ajustables</td>
                        <td>22</td>
                        <td>20</td>
                        <td><span style="color:#fbbf24">⚠️ Crítico</span></td>
                        <td><button class="btn-sm" onclick="alert('✅ Solicitud de reorden enviada')">Reordenar</button></td>
                    </tr>
                    <tr>
                        <td>Oficina</td>
                        <td>Material de Oficina</td>
                        <td>85</td>
                        <td>50</td>
                        <td><span style="color:var(--success)">✓ OK</span></td>
                        <td><button class="btn-sm">Ver Detalle</button></td>
                    </tr>
                    <tr>
                        <td>Hidroterapia</td>
                        <td>Equipos de Piscina</td>
                        <td>8</td>
                        <td>5</td>
                        <td><span style="color:var(--success)">✓ OK</span></td>
                        <td><button class="btn-sm" onclick="alert('ℹ️ Próximo mantenimiento: 05/12/2025')">Mantener</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="stats-grid" style="margin-top:20px;">
            <div class="stat-card">
                <h3>Total Items</h3>
                <div class="value">248</div>
            </div>
            <div class="stat-card green">
                <h3>Stock OK</h3>
                <div class="value">210</div>
            </div>
            <div class="stat-card orange">
                <h3>Stock Crítico</h3>
                <div class="value">18</div>
            </div>
            <div class="stat-card" style="background:rgba(239,68,68,0.1);">
                <h3>Stock Bajo</h3>
                <div class="value">20</div>
            </div>
        </div>
    `;
}

function renderReportes() {
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Meta Mensual</h3>
                <div class="value">450</div>
                <p style="font-size:0.8rem; color:var(--text-gray)">Atenciones objetivo</p>
            </div>
            <div class="stat-card green">
                <h3>Atenciones Reales</h3>
                <div class="value">423</div>
                <p style="font-size:0.8rem; color:var(--text-gray)">94% de cumplimiento</p>
            </div>
            <div class="stat-card blue">
                <h3>Nuevos Ingresos</h3>
                <div class="value">12</div>
                <p style="font-size:0.8rem; color:var(--text-gray)">Este mes</p>
            </div>
            <div class="stat-card orange">
                <h3>Altas Médicas</h3>
                <div class="value">5</div>
                <p style="font-size:0.8rem; color:var(--text-gray)">Este mes</p>
            </div>
        </div>

        <div class="content-card">
            <h3><i class="fa-solid fa-chart-simple"></i> Estadísticas de Atención</h3>
            <p style="color:var(--text-gray); margin-bottom:20px;">Pacientes atendidos por mes (Último Semestre)</p>
            
            <div style="display:flex; align-items:flex-end; height:200px; gap:10px; padding-bottom:10px; border-bottom:1px solid #444;">
                <div style="flex:1; background:var(--primary); height:60%; border-radius:4px 4px 0 0;" title="Jun: 270"></div>
                <div style="flex:1; background:var(--primary); height:75%; border-radius:4px 4px 0 0;" title="Jul: 338"></div>
                <div style="flex:1; background:var(--primary); height:50%; border-radius:4px 4px 0 0;" title="Ago: 225"></div>
                <div style="flex:1; background:var(--primary); height:85%; border-radius:4px 4px 0 0;" title="Sep: 383"></div>
                <div style="flex:1; background:var(--primary); height:70%; border-radius:4px 4px 0 0;" title="Oct: 315"></div>
                <div style="flex:1; background:#eab308; height:94%; border-radius:4px 4px 0 0;" title="Nov: 423 (Actual)"></div>
            </div>
            <div style="display:flex; justify-content:space-between; color:var(--text-gray); font-size:0.8rem; margin-top:5px;">
                <span>Jun</span><span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span>
            </div>
        </div>

        <div class="content-card">
            <h3><i class="fa-solid fa-file-lines"></i> Reportes Disponibles</h3>
            <ul style="list-style:none; padding:0; margin-top:10px;">
                <li style="padding:12px; border-bottom:1px solid #333; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong><i class="fa-solid fa-file-pdf"></i> Resumen Mensual Noviembre 2025</strong>
                        <p style="font-size:0.85rem; color:var(--text-gray); margin:5px 0 0 0;">Generado: 29/11/2025</p>
                    </div>
                    <button class="btn-sm" onclick="alert('📄 Descargando reporte...')">Descargar</button>
                </li>
                <li style="padding:12px; border-bottom:1px solid #333; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong><i class="fa-solid fa-file-excel"></i> Lista de Espera Actualizada</strong>
                        <p style="font-size:0.85rem; color:var(--text-gray); margin:5px 0 0 0;">Generado: 28/11/2025</p>
                    </div>
                    <button class="btn-sm" onclick="alert('📄 Descargando reporte...')">Descargar</button>
                </li>
                <li style="padding:12px; border-bottom:1px solid #333; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong><i class="fa-solid fa-file-pdf"></i> Informe de Cumplimiento Q4</strong>
                        <p style="font-size:0.85rem; color:var(--text-gray); margin:5px 0 0 0;">Generado: 25/11/2025</p>
                    </div>
                    <button class="btn-sm" onclick="alert('📄 Descargando reporte...')">Descargar</button>
                </li>
            </ul>
            <button class="btn-primary" style="margin-top:15px;" onclick="alert('✅ Generando nuevo reporte...')"><i class="fa-solid fa-file-circle-plus"></i> Generar Nuevo Reporte</button>
        </div>
    `;
}

function renderConfiguracion() {
    return `
        <div class="content-card">
            <h3><i class="fa-solid fa-user-gear"></i> Configuración de Usuario</h3>
            <div class="input-group">
                <label>Usuario</label>
                <input type="text" value="admin" disabled style="background:#333; color:#aaa;">
            </div>
            <div class="input-group">
                <label>Rol</label>
                <input type="text" value="Administrador General" disabled style="background:#333; color:#aaa;">
            </div>
            <button class="btn-primary" onclick="alert('✅ Función: Cambiar contraseña')"><i class="fa-solid fa-key"></i> Cambiar Contraseña</button>
        </div>

        <div class="content-card">
            <h3><i class="fa-solid fa-bell"></i> Notificaciones</h3>
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
                <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                    <input type="checkbox" checked> Alertas de stock bajo
                </label>
                <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                    <input type="checkbox" checked> Notificaciones de ausencias
                </label>
                <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                    <input type="checkbox" checked> Recordatorios de mantenimiento
                </label>
                <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                    <input type="checkbox"> Reportes automáticos semanales
                </label>
            </div>
            <button class="btn-primary" style="margin-top:15px;" onclick="alert('✅ Configuración guardada')">Guardar Preferencias</button>
        </div>

        <div class="content-card">
            <h3><i class="fa-solid fa-database"></i> Sistema</h3>
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:15px;">
                <div style="display:flex; justify-content:space-between; padding:10px; background:rgba(255,255,255,0.05); border-radius:6px;">
                    <span>Versión del Sistema</span>
                    <strong>v2.5.1</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:10px; background:rgba(255,255,255,0.05); border-radius:6px;">
                    <span>Última Actualización</span>
                    <strong>15/11/2025</strong>
                </div>
                <div style="display:flex; justify-content:space-between; padding:10px; background:rgba(255,255,255,0.05); border-radius:6px;">
                    <span>Base de Datos</span>
                    <strong style="color:var(--success)">Conectada</strong>
                </div>
            </div>
        </div>
    `;
}
