// --- BASE DE DATOS LOCAL SIMULADA ---
let users = [];
let currentUser = null;

// Estado Simulado para las "Acciones Funcionales"
let appState = {
    programSlots: { rehab: 5, school: 2, stim: 10 },
    smsSent: 150,
    pendingCases: 8
};

// --- FUNCIONES AUXILIARES ---

function updateEmailPreview() {
    const name = document.getElementById('reg-name').value.trim();
    const surname = document.getElementById('reg-surname').value.trim();
    const emailField = document.getElementById('reg-generated-email');

    if (name.length >= 3 && surname.length >= 1) {
        const namePart = name.substring(0, 3).toLowerCase();
        const surnamePart = surname.split(' ')[0].toLowerCase();
        emailField.value = `${namePart}.${surnamePart}@teleton.cl`;
    } else {
        emailField.value = "Complete nombre y apellido...";
    }
}

function randomizeRole() {
    const select = document.getElementById('reg-role');
    const options = Array.from(select.options).filter(opt => !opt.disabled);
    const randomOption = options[Math.floor(Math.random() * options.length)];

    select.value = randomOption.value;

    // Animación sutil para que el usuario note que se asignó
    select.style.transition = "background-color 0.5s";
    select.style.backgroundColor = "rgba(213, 43, 30, 0.2)"; // Flash rojo suave
    setTimeout(() => {
        select.style.backgroundColor = "rgba(15, 23, 42, 0.6)"; // Volver a normal
    }, 800);
}

// --- SISTEMA DE AUTENTICACIÓN ---

function toggleAuth(view) {
    const loginCard = document.getElementById('login-card');
    const regCard = document.getElementById('register-card');

    if (view === 'register') {
        loginCard.classList.add('hidden');
        regCard.classList.remove('hidden');
        regCard.classList.add('fade-in');

        // === AQUÍ ESTÁ EL CAMBIO ===
        // Se ejecuta automáticamente al mostrar la pantalla
        randomizeRole();

    } else {
        regCard.classList.add('hidden');
        loginCard.classList.remove('hidden');
        loginCard.classList.add('fade-in');
    }
}

function register() {
    const name = document.getElementById('reg-name').value.trim();
    const surname = document.getElementById('reg-surname').value.trim();
    const personalEmail = document.getElementById('reg-personal-email').value.trim();
    const phone = document.getElementById('reg-phone').value;
    const role = document.getElementById('reg-role').value;
    const pass = document.getElementById('reg-pass').value;

    let institutionalEmail = document.getElementById('reg-generated-email').value;

    if (!institutionalEmail || institutionalEmail.includes("Complete")) {
        const namePart = name.substring(0, 3).toLowerCase();
        const surnamePart = surname.split(' ')[0].toLowerCase();
        institutionalEmail = `${namePart}.${surnamePart}@teleton.cl`;
    }

    const newUser = {
        name, surname, personalEmail, phone, role, pass,
        email: institutionalEmail
    };
    users.push(newUser);

    alert(`✅ ¡Registro Exitoso para la Botathon!\n\n📧 TU USUARIO ES: ${institutionalEmail}\n(También puedes entrar con ${personalEmail})`);

    document.getElementById('register-form').reset();
    document.getElementById('reg-generated-email').value = "";
    toggleAuth('login');
    document.getElementById('login-email').value = institutionalEmail;
}

function login() {
    const emailInput = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;

    const foundUser = users.find(u => (u.email === emailInput || u.personalEmail === emailInput) && u.pass === pass);

    if (foundUser) {
        currentUser = foundUser;
        loadDashboard();
    } else {
        alert("❌ Credenciales incorrectas o usuario no registrado.");
    }
}

function logout() {
    currentUser = null;
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('auth-view').classList.remove('hidden');
    document.getElementById('login-pass').value = '';
}

// --- FUNCIONES ESPECÍFICAS DE ROLES (FUNCIONALIDAD) ---

// 1. Coordinador: Reasignar
function performReassign() {
    const patient = document.getElementById('coord-patient').value;
    const prof = document.getElementById('coord-prof').value;
    alert(`✅ REASIGNACIÓN EXITOSA\n\nPaciente: ${patient}\nNuevo Profesional: ${prof}\n\nSe ha notificado al equipo.`);
}

// 2. Social: Registrar Caso
let selectedNeed = null;
function selectNeed(type, btn) {
    selectedNeed = type;
    // Visual feedback
    const buttons = btn.parentElement.querySelectorAll('button');
    buttons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function registerSocialNeed() {
    const search = document.getElementById('social-search').value;
    const note = document.getElementById('social-note').value;

    if (!search || !selectedNeed) {
        alert("⚠️ Por favor busca un paciente y selecciona un tipo de necesidad.");
        return;
    }

    alert(`✅ CASO REGISTRADO\n\nFamilia: ${search}\nNecesidad: ${selectedNeed}\nEstado: Asignado a Trabajador Social`);
    document.getElementById('social-search').value = "";
    document.getElementById('social-note').value = "";
}

// 3. Admin Programas: Inscribir (Actualiza contadores)
function enrollProgram(programType) {
    let countId, currentCount;

    if (programType === 'Arte') {
        if (appState.programSlots.rehab > 0) {
            appState.programSlots.rehab--;
            document.getElementById('slots-rehab').innerText = `${appState.programSlots.rehab} Cupos`;
            alert("✅ Paciente inscrito exitosamente en Taller de Arte.");
        } else {
            alert("⚠️ No quedan cupos disponibles en este programa.");
        }
    } else {
        alert("✅ Lista de espera consultada.");
    }
}

// 4. Turnos: Reagendar
function startReschedule() {
    const confirmAction = confirm("¿Desea iniciar el asistente automático para los 8 pacientes afectados?");
    if (confirmAction) {
        alert("🤖 Iniciando proceso...\n\nSe enviarán propuestas de nueva hora a los pacientes vía WhatsApp.");
    }
}

// 5. Comunicaciones: Enviar (Actualiza contador)
function sendMessage() {
    const msg = document.getElementById('comm-msg').value;
    if (!msg) {
        alert("⚠️ Escriba un mensaje antes de enviar.");
        return;
    }

    appState.smsSent += 1; // Simula que se envió a 1 grupo
    document.getElementById('comm-count').innerText = appState.smsSent;

    alert("🚀 COMUNICADO ENVIADO\n\nEl mensaje está en cola de salida para los destinatarios seleccionados.");
    document.getElementById('comm-msg').value = "";
}

// 6. Retención: Llamar (Cambia estado del botón)
function callPatient(btn, patientName) {
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando...';
    btn.style.background = '#eab308'; // Yellowish

    setTimeout(() => {
        const outcome = confirm(`📞 Llamada con ${patientName} en curso...\n\n¿Contestó la llamada?`);
        if (outcome) {
            btn.innerText = 'Contactado';
            btn.style.background = 'var(--success)';
            btn.disabled = true;
            alert("✅ Registro actualizado: Contacto Exitoso");
        } else {
            btn.innerText = 'Sin Respuesta';
            btn.style.background = 'var(--text-gray)';
            btn.innerHTML = '<i class="fa-solid fa-phone-slash"></i> Reintentar';
        }
    }, 2000);
}


// --- RENDERIZADO DEL DASHBOARD POR ROL ---

function loadDashboard() {
    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');

    document.getElementById('nav-name').innerText = `${currentUser.name} ${currentUser.surname}`;
    document.getElementById('nav-avatar').innerText = currentUser.name.charAt(0) + currentUser.surname.charAt(0);

    const roleNames = {
        'coordinador': 'Coordinación General',
        'social': 'Gestión Social',
        'admin_programas': 'Admin. de Programas',
        'turnos': 'Organización de Turnos',
        'comunicaciones': 'Comunicaciones',
        'retencion': 'Retención e Integración'
    };

    const cleanRole = roleNames[currentUser.role] || 'Usuario';
    document.getElementById('nav-role').innerText = cleanRole;
    document.getElementById('dash-badge').innerText = cleanRole.toUpperCase();
    document.getElementById('dash-title').innerText = `Hola, ${currentUser.name}`;

    const contentDiv = document.getElementById('dynamic-content');
    let html = '';

    switch (currentUser.role) {
        case 'coordinador':
            html = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3><i class="fa-solid fa-user-injured"></i> Pacientes Hoy</h3>
                        <div class="value">145 / 160</div>
                    </div>
                    <div class="stat-card orange">
                        <h3><i class="fa-solid fa-triangle-exclamation"></i> Urgencias</h3>
                        <div class="value">2 Alertas</div>
                    </div>
                    <div class="stat-card green">
                        <h3><i class="fa-solid fa-door-open"></i> Salas Libres</h3>
                        <div class="value">3 Disponibles</div>
                    </div>
                </div>

                <div class="content-card">
                    <h3 style="margin-bottom:15px;"><i class="fa-solid fa-shuffle"></i> Reasignación Rápida</h3>
                    <p style="color:var(--text-gray); margin-bottom:15px;">Gestionar ausencia de profesional kinesiólogo.</p>
                    
                    <div class="action-grid">
                        <div class="input-group" style="margin:0">
                            <select id="coord-patient"><option>Paciente: Juan Pérez (Kine)</option><option>Paciente: Maria L.</option></select>
                        </div>
                        <div class="input-group" style="margin:0">
                            <select id="coord-prof"><option>Asignar a: Lic. Ana T.</option><option>Asignar a: Dr. Mario B.</option></select>
                        </div>
                        <button class="btn-primary" style="margin:0" onclick="performReassign()">Confirmar Reasignación</button>
                    </div>
                </div>
            `;
            break;

        case 'social':
            html = `
                <div class="stats-grid">
                    <div class="stat-card orange">
                        <h3>Solicitudes Pendientes</h3>
                        <div class="value">${appState.pendingCases} Familias</div>
                    </div>
                    <div class="stat-card green">
                        <h3>Ayudas este mes</h3>
                        <div class="value">45 Canastas</div>
                    </div>
                </div>

                <div class="content-card">
                    <h3><i class="fa-solid fa-hand-holding-heart"></i> Gestión de Necesidades</h3>
                    <div style="margin-top:20px;">
                        <div class="input-group">
                            <label>Buscar Familia / Paciente</label>
                            <input type="text" id="social-search" placeholder="RUT o Apellido...">
                        </div>
                        <div class="input-group">
                            <label>Tipo de Necesidad (Seleccione una)</label>
                            <div class="action-grid" style="margin-top:5px;">
                                <button class="btn-sm" onclick="selectNeed('Transporte', this)"><i class="fa-solid fa-bus"></i> Transporte</button>
                                <button class="btn-sm" onclick="selectNeed('Alimentos', this)"><i class="fa-solid fa-utensils"></i> Alimentos</button>
                                <button class="btn-sm" onclick="selectNeed('Vivienda', this)"><i class="fa-solid fa-house-chimney"></i> Vivienda</button>
                                <button class="btn-sm" onclick="selectNeed('Apoyo Emocional', this)"><i class="fa-solid fa-heart"></i> Apoyo</button>
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Notas Privadas</label>
                            <input type="text" id="social-note" placeholder="Detalle la situación...">
                        </div>
                        <button class="btn-primary" onclick="registerSocialNeed()">Registrar Caso</button>
                    </div>
                </div>
            `;
            break;

        case 'admin_programas':
            html = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Rehab. Física</h3>
                        <div class="value" id="slots-rehab">${appState.programSlots.rehab} Cupos</div>
                    </div>
                    <div class="stat-card blue">
                        <h3>Integración Escolar</h3>
                        <div class="value">${appState.programSlots.school} Cupos</div>
                    </div>
                    <div class="stat-card green">
                        <h3>Estimulación</h3>
                        <div class="value">${appState.programSlots.stim} Cupos</div>
                    </div>
                </div>

                <div class="content-card">
                    <h3><i class="fa-solid fa-clipboard-list"></i> Inscripción a Programas</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Programa</th>
                                <th>Horario</th>
                                <th>Lista Espera</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Taller de Arte</td>
                                <td>Lun-Mie 15:00</td>
                                <td>12</td>
                                <td><button class="btn-sm" onclick="enrollProgram('Arte')">Inscribir</button></td>
                            </tr>
                            <tr>
                                <td>Piscina Terapéutica</td>
                                <td>Mar-Jue 10:00</td>
                                <td>40</td>
                                <td><button class="btn-sm" onclick="enrollProgram('Lista')">Ver Lista</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            break;

        case 'turnos':
            html = `
                <div class="content-card">
                    <h3><i class="fa-solid fa-clock"></i> Planificación Diaria</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Profesional</th>
                                <th>Especialidad</th>
                                <th>Carga</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Dr. Roberto M.</td>
                                <td>Fisiatra</td>
                                <td>12 pac.</td>
                                <td style="color:var(--success)">Confirmado</td>
                            </tr>
                            <tr>
                                <td>Lic. Pedro P.</td>
                                <td>Kinesiólogo</td>
                                <td>8 pac.</td>
                                <td style="color:var(--danger)">Ausente</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="content-card">
                        <h3>Gestión de Conflictos</h3>
                        <p style="color:var(--text-gray)">Kinesiólogo Pedro P. ausente. 8 pacientes requieren reagendamiento.</p>
                        <br>
                        <button class="btn-primary" onclick="startReschedule()">Iniciar Asistente de Reagendamiento</button>
                </div>
            `;
            break;

        case 'comunicaciones':
            html = `
                <div class="stats-grid">
                    <div class="stat-card green">
                        <h3>SMS Enviados</h3>
                        <div class="value" id="comm-count">${appState.smsSent}</div>
                    </div>
                    <div class="stat-card orange">
                        <h3>Pendientes</h3>
                        <div class="value">5 Avisos</div>
                    </div>
                </div>

                <div class="content-card">
                    <h3><i class="fa-solid fa-paper-plane"></i> Enviar Comunicado Masivo</h3>
                    <div class="input-group">
                        <label>Destinatarios</label>
                        <select id="comm-dest"><option>Cuidadores (Recordatorio)</option><option>Voluntarios</option></select>
                    </div>
                    <div class="input-group">
                        <label>Canales</label>
                        <div style="display:flex; gap:15px; margin-top:5px;">
                            <label><input type="checkbox" checked> WhatsApp</label>
                            <label><input type="checkbox"> Email</label>
                            <label><input type="checkbox"> SMS</label>
                        </div>
                    </div>
                    <div class="input-group">
                        <textarea id="comm-msg" rows="3" style="width:100%; background:rgba(15,23,42,0.6); border:1px solid #444; color:white; padding:10px; border-radius:8px;" placeholder="Escriba su mensaje aquí..."></textarea>
                    </div>
                    <button class="btn-primary" onclick="sendMessage()">Enviar Ahora</button>
                </div>
            `;
            break;

        case 'retencion':
            html = `
                <div class="stats-grid">
                        <div class="stat-card orange">
                        <h3>Riesgo Abandono</h3>
                        <div class="value">15 Pacientes</div>
                    </div>
                    <div class="stat-card green">
                        <h3>Recuperados</h3>
                        <div class="value">4 Familias</div>
                    </div>
                </div>

                <div class="content-card">
                    <h3><i class="fa-solid fa-phone"></i> Gestión de Adherencia</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Paciente</th>
                                <th>Sin Asistir</th>
                                <th>Causa</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Carlos Ruiz</td>
                                <td>40 días</td>
                                <td>Transporte</td>
                                <td><button class="btn-sm" style="background:var(--primary)" onclick="callPatient(this, 'Carlos Ruiz')">Llamar</button></td>
                            </tr>
                            <tr>
                                <td>Maria G.</td>
                                <td>25 días</td>
                                <td>Desmotivación</td>
                                <td><button class="btn-sm">Ver Ficha</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            break;
    }

    html += `
        <div class="content-card" style="margin-top:30px; border-left: 4px solid var(--primary);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h4><i class="fa-solid fa-universal-access"></i> Panel de Accesibilidad Activo</h4>
                    <p style="font-size:0.85rem; color:var(--text-gray)">Modo Lectura Fácil • Alto Contraste • Botones Ampliados</p>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.8rem; color:var(--text-gray)">Contacto Cuidador Principal</div>
                    <div style="font-weight:bold;">+56 9 1234 5678</div>
                </div>
            </div>
        </div>
    `;

    contentDiv.innerHTML = html;
}
