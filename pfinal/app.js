/**
 * ====================================================================
 * SECCIÓN 1: CONFIGURACIÓN Y ESTADO
 * ====================================================================
 */
let state = {
    view: 'auth', 
    user: null, 
    isLoggedIn: false
};

const ROLES = {
    COORD: 'Coordinador(a)',
    JEFE_SOCIAL: 'Jefe de Gestión Social',
    ADMIN_PROG: 'Equipo Admin. Programas',
    ORG_TURNOS: 'Profesional Org. Turnos',
    COMMS: 'Gestión de Comunicaciones',
    RETENCION: 'Equipo Retención e Integración'
};

// Base de datos simulada (En memoria)
const registeredUsers = [
    { username: 'admin', password: '1234', name: 'Vanessa', lastname: 'Román', role: ROLES.COORD, email: 'adm.roman@teleton.cl', personalEmail: 'admin@teleton.cl' }
];

// Dummy data para simular los gráficos del dashboard
const dashboardData = {
    donaciones: [1200000, 1500000, 1800000, 1600000, 2000000, 2500000, 2200000],
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    voluntarios: 8520,
    asistencia: 92.5,
    matchTasa: 78
};

/**
 * ====================================================================
 * SECCIÓN 2: RENDERIZADORES DE VISTAS (HTML Templates)
 * ====================================================================
 */

function renderLogin() {
    return `
        <div class="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-700 fade-in relative overflow-hidden">
            <div class="text-center mb-6">
                <div class="inline-flex bg-red-600 text-white p-3 rounded-2xl shadow-lg shadow-red-600/30 mb-4">
                    <i class="ph-fill ph-fingerprint text-3xl"></i>
                </div>
                <h1 class="text-2xl font-bold text-white tracking-tight">Iniciar Sesión</h1>
                <p class="text-gray-400 text-xs mt-1">Acceso seguro a Teletón Control Center</p>
            </div>

            <form onsubmit="event.preventDefault(); preLogin()" class="space-y-4">
                <div class="space-y-1">
                    <label class="text-xs font-bold text-gray-500 uppercase ml-1">Usuario o Correo</label>
                    <div class="relative">
                        <span class="absolute left-3 top-3 text-gray-400"><i class="ph-bold ph-user"></i></span>
                        <input id="login-user" type="text" placeholder="Ej: val.roman@teleton.cl" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 focus:border-red-500 outline-none text-white text-sm" required>
                    </div>
                </div>
                <div class="space-y-1">
                    <label class="text-xs font-bold text-gray-500 uppercase ml-1">Contraseña</label>
                    <div class="relative">
                        <span class="absolute left-3 top-3 text-gray-400"><i class="ph-bold ph-lock-key"></i></span>
                        <input id="login-pass" type="password" placeholder="••••" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 focus:border-red-500 outline-none text-white text-sm" required>
                    </div>
                </div>
                
                <div id="login-error" class="hidden text-red-400 text-xs font-bold text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                    Credenciales incorrectas
                </div>

                <button type="submit" class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-lg transition text-sm">
                    Ingresar
                </button>
            </form>

            <div class="mt-6 pt-4 border-t border-gray-700">
                <button onclick="renderView('qr')" class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 mb-3">
                    <i class="ph-bold ph-qr-code"></i> Ingresar con Credencial
                </button>
                <p class="text-center text-xs text-gray-500">
                    ¿No tienes cuenta? <button onclick="renderView('register')" class="text-red-500 font-bold hover:underline">Obtener Cuenta</button>
                </p>
            </div>
        </div>
    `;
}

function renderRegister() {
    // Asignación de rol aleatorio al renderizar
    const roleValues = Object.values(ROLES);
    const randomRole = roleValues[Math.floor(Math.random() * roleValues.length)];

    return `
        <div class="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700 fade-in relative overflow-hidden my-4">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold text-white">Obtener Cuenta</h1>
                <p class="text-gray-400 text-xs">Registro de personal administrativo</p>
            </div>

            <form onsubmit="event.preventDefault(); handleRegister('${randomRole}')" class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-gray-500 uppercase ml-1">Nombre</label>
                        <input id="reg-name" type="text" class="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm" required oninput="updateInstitutionalEmail()">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-bold text-gray-500 uppercase ml-1">Apellido</label>
                        <input id="reg-lastname" type="text" class="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm" required oninput="updateInstitutionalEmail()">
                    </div>
                </div>

                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase ml-1">Número de Teléfono</label>
                    <input id="reg-phone" type="tel" placeholder="+56 9 1234 5678" class="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm" required>
                </div>

                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase ml-1">Correo Personal</label>
                    <input id="reg-email" type="email" class="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm" required>
                </div>

                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase ml-1">Correo Institucional (Auto)</label>
                    <input id="reg-inst-email" type="text" placeholder="val.roman@teleton.cl" class="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-400 text-sm cursor-not-allowed select-none" disabled>
                </div>

                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase ml-1">Rol Asignado por Sistema</label>
                    <div class="relative group">
                        <input id="reg-role-display" type="text" value="${randomRole}" disabled class="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-brand-red font-bold text-sm cursor-not-allowed select-none shadow-inner">
                        <i class="ph-fill ph-lock-key absolute right-3 top-2.5 text-gray-500"></i>
                    </div>
                </div>

                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-500 uppercase ml-1">Contraseña</label>
                    <input id="reg-pass" type="password" class="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm" required>
                </div>

                <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg mt-4 text-sm transition">
                    Obtener Acceso
                </button>
            </form>

               <p class="text-center text-xs text-gray-500 mt-4">
                    <button onclick="renderView('login')" class="text-gray-400 hover:text-white">Volver al Login</button>
                </p>
        </div>
    `;
}

function renderRoleReveal(role) {
    return `
        <div class="bg-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-700 animate-pop-in relative overflow-hidden text-center">
            <div class="absolute inset-0 bg-gradient-to-br from-red-600/10 to-blue-600/10 pointer-events-none"></div>
            <div class="mb-6">
                <div class="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-yellow-500/20 animate-bounce">
                    <i class="ph-fill ph-crown text-4xl text-white"></i>
                </div>
                <h2 class="text-2xl font-bold text-white mb-1">¡Cuenta Creada!</h2>
                <p class="text-gray-400 text-xs">Confirmando tu perfil operativo:</p>
            </div>
            <div class="bg-gray-900/80 p-6 rounded-2xl border border-gray-600 mb-8 relative group">
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-700 text-[10px] text-gray-300 px-3 py-1 rounded-full uppercase font-bold tracking-wider border border-gray-600">
                    Rol Activo
                </div>
                <h3 class="text-xl font-bold text-brand-red leading-tight mt-2">${role}</h3>
                <div class="mt-3 text-xs text-gray-500">Interfaz personalizada cargada.</div>
            </div>
            <button onclick="renderView('login')" class="w-full bg-white hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-xl shadow-lg transition text-sm">
                Ir a Iniciar Sesión
            </button>
        </div>
    `;
}

function render2FA() {
    return `
        <div class="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-700 fade-in text-center">
            <div class="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <i class="ph-bold ph-shield-check text-3xl text-green-500"></i>
            </div>
            <h1 class="text-xl font-bold text-white mb-2">Seguridad</h1>
            <p class="text-gray-400 text-xs mb-6">Hemos enviado un código a su dispositivo.</p>
            <div class="flex justify-center gap-2 mb-6">
                <input type="text" value="4" class="w-10 h-12 text-center text-xl font-bold rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-red-500 outline-none">
                <input type="text" value="2" class="w-10 h-12 text-center text-xl font-bold rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-red-500 outline-none">
                <input type="text" value="9" class="w-10 h-12 text-center text-xl font-bold rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-red-500 outline-none">
                <span class="text-2xl text-gray-500 self-center">-</span>
                <input type="text" class="w-10 h-12 text-center text-xl font-bold rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-red-500 outline-none animate-pulse border-red-500">
                <input type="text" class="w-10 h-12 text-center text-xl font-bold rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-red-500 outline-none">
                <input type="text" class="w-10 h-12 text-center text-xl font-bold rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-red-500 outline-none">
            </div>
            <button onclick="completeLogin()" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition text-sm mb-4">
                Validar Ingreso
            </button>
        </div>
    `;
}

function renderQRScan() {
    return `
        <div class="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-gray-700 fade-in text-center relative overflow-hidden">
            <h1 class="text-xl font-bold text-white mb-6">Escaneando Credencial</h1>
            <div class="w-48 h-48 mx-auto bg-black rounded-2xl relative overflow-hidden border-2 border-gray-600 mb-6">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/20 to-transparent w-full h-8 animate-scan top-0 z-10 opacity-50"></div>
                <div class="absolute inset-0 flex items-center justify-center"><i class="ph-fill ph-qr-code text-6xl text-gray-700"></i></div>
                <div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                <div class="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                <div class="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                <div class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
            </div>
            <button onclick="completeLogin()" class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition text-sm mb-2">Simular Escaneo Exitoso</button>
            <button onclick="renderView('login')" class="text-xs text-gray-500 hover:text-white">Volver</button>
        </div>
    `;
}

// Dashboard por defecto (para todos los usuarios)
function renderDashboard() {
    return `
        <h1 class="text-3xl font-extrabold text-gray-200 mb-2 fade-in">Panel Central <span class="text-brand-red">Teletón</span></h1>
        <p class="text-gray-400 mb-8 fade-in">Bienvenido(a), ${state.user.name}. Tu rol es ${state.user.role}.</p>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-700 fade-in">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-white">Donaciones (Últ. 7 Días)</h3>
                    <i class="ph-bold ph-currency-circle-dollar text-brand-green text-2xl"></i>
                </div>
                <p class="text-3xl font-extrabold text-white">$${dashboardData.donaciones[dashboardData.donaciones.length - 1].toLocaleString('es-CL')}</p>
                <canvas id="chart-donaciones" class="mt-4"></canvas>
            </div>

            <div class="bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-700 fade-in">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-white">Voluntarios Activos</h3>
                    <i class="ph-bold ph-users-three text-brand-blue text-2xl"></i>
                </div>
                <p class="text-5xl font-extrabold text-white">${dashboardData.voluntarios}</p>
                <div class="text-sm text-gray-400 mt-2">Un 4.1% más que la semana pasada.</div>
            </div>

            <div class="bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-700 fade-in">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-white">Tasa Match Integración</h3>
                    <i class="ph-bold ph-heartbeat text-brand-red text-2xl"></i>
                </div>
                <p class="text-5xl font-extrabold text-brand-orange">${dashboardData.matchTasa}%</p>
                <div class="text-sm text-gray-400 mt-2">Nivel objetivo: 85%. Requiere atención.</div>
            </div>
        </div>

        <div class="bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-700 mb-8 fade-in">
            <h2 class="text-xl font-bold text-white mb-4">Detalles por Región (Simulación)</h2>
            <table class="min-w-full divide-y divide-gray-700">
                <thead>
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Región</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voluntarios</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asistencia</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700 text-sm">
                    <tr class="hover:bg-gray-700/50">
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-white">Metropolitana</td>
                        <td class="px-6 py-4 whitespace-nowrap text-brand-red">2,510</td>
                        <td class="px-6 py-4 whitespace-nowrap text-brand-green">95.2%</td>
                    </tr>
                    <tr class="hover:bg-gray-700/50">
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-white">Valparaíso</td>
                        <td class="px-6 py-4 whitespace-nowrap text-brand-red">890</td>
                        <td class="px-6 py-4 whitespace-nowrap text-brand-orange">88.9%</td>
                    </tr>
                    <tr class="hover:bg-gray-700/50">
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-white">Biobío</td>
                        <td class="px-6 py-4 whitespace-nowrap text-brand-red">1,150</td>
                        <td class="px-6 py-4 whitespace-nowrap text-brand-green">91.7%</td>
                    </tr>
                    <tr class="hover:bg-gray-700/50">
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-white">Los Lagos</td>
                        <td class="px-6 py-4 whitespace-nowrap text-brand-red">480</td>
                        <td class="px-6 py-4 whitespace-nowrap text-brand-orange">85.5%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

/**
 * ====================================================================
 * SECCIÓN 3: LÓGICA DE CONTROL (Controllers)
 * ====================================================================
 */

function buildSectionHeader(title) {
    return `<p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-6 mb-2">${title}</p>`;
}

function createNavItem(viewId, label, iconClass, extraClasses = '') {
    // Si state.view es 'auth' o nulo, la primera navegación activa será 'dashboard'
    const isActive = (state.view === viewId || (state.view === 'auth' && viewId === 'dashboard'));
    const defaultClasses = 'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition duration-200';
    const activeClasses = isActive ? 'text-white bg-gray-800 shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white';
    
    return `
        <a href="#" onclick="navigate('${viewId}'); return false;" 
            class="${defaultClasses} ${activeClasses} ${extraClasses}">
            <i class="${iconClass} text-xl"></i>
            <span>${label}</span>
        </a>
    `;
}

function updateInstitutionalEmail() {
    const name = document.getElementById('reg-name').value.trim().toLowerCase();
    const lastname = document.getElementById('reg-lastname').value.trim().toLowerCase();
    const emailField = document.getElementById('reg-inst-email');
    
    // Eliminar tildes para el correo
    const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (name && lastname) {
        // 3 primeras letras nombre + punto + apellido completo
        const cleanName = removeAccents(name.split(' ')[0]).substring(0, 3);
        const cleanLastname = removeAccents(lastname.split(' ')[0]);
        emailField.value = `${cleanName}.${cleanLastname}@teleton.cl`;
    } else {
        emailField.value = '';
    }
}

function handleRegister(assignedRole) {
    const name = document.getElementById('reg-name').value;
    const lastname = document.getElementById('reg-lastname').value;
    const phone = document.getElementById('reg-phone').value;
    const personalEmail = document.getElementById('reg-email').value;
    const instEmail = document.getElementById('reg-inst-email').value;
    const password = document.getElementById('reg-pass').value;
    
    // El username es el correo institucional
    const username = instEmail; 
    
    const newUser = { username, password, name, lastname, phone, role: assignedRole, email: instEmail, personalEmail };
    registeredUsers.push(newUser);
    
    // Mostrar pantalla de revelación de rol
    const container = document.getElementById('auth-container');
    container.innerHTML = renderRoleReveal(assignedRole);
}

function preLogin() {
    const userInput = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const errorDisplay = document.getElementById('login-error');
    
    // Buscar por username (correo institucional) o personal email
    const foundUser = registeredUsers.find(u => 
        (u.username === userInput || u.personalEmail === userInput) && u.password === pass
    );
    
    if (foundUser) {
        state.user = foundUser;
        errorDisplay.classList.add('hidden');
        renderView('2fa');
    } else {
        errorDisplay.classList.remove('hidden');
    }
}

function completeLogin() {
    if (!state.user) { 
        // Fallback para QR/Simulación si no se pasó por preLogin
        state.user = registeredUsers[0]; 
    } 

    state.isLoggedIn = true;
    const auth = document.getElementById('auth-container');
    const app = document.getElementById('app-container');
    
    // Ocultar Auth Container con animación
    auth.classList.add('-translate-y-full', 'opacity-0');
    // Mostrar App Container
    app.classList.remove('opacity-0', 'pointer-events-none');
    
    // Esconder auth después de la animación
    setTimeout(() => auth.classList.add('hidden'), 700);
    
    // Cargar la interfaz de usuario y el dashboard
    setupDashboard();
    navigate('dashboard');
}

function renderView(viewName) {
    const container = document.getElementById('auth-container');
    if (viewName === 'login') container.innerHTML = renderLogin();
    if (viewName === 'register') container.innerHTML = renderRegister();
    if (viewName === '2fa') container.innerHTML = render2FA();
    if (viewName === 'qr') container.innerHTML = renderQRScan();
}

function logout() { 
    state.isLoggedIn = false;
    state.user = null;
    const auth = document.getElementById('auth-container');
    const app = document.getElementById('app-container');
    auth.classList.remove('hidden');
    requestAnimationFrame(() => {
        auth.classList.remove('-translate-y-full', 'opacity-0');
        app.classList.add('opacity-0', 'pointer-events-none');
    });
    renderView('login');
}

/**
 * ====================================================================
 * SECCIÓN 4: GESTOR DE DASHBOARD (UI Logic)
 * ====================================================================
 */

function initDashboardCharts() {
    const ctx = document.getElementById('chart-donaciones');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dashboardData.labels,
                datasets: [{
                    label: 'Monto Donado ($)',
                    data: dashboardData.donaciones,
                    borderColor: 'rgb(218, 41, 28)', // brand-red
                    backgroundColor: 'rgba(218, 41, 28, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: 'rgb(156, 163, 175)' }, grid: { color: 'rgb(55, 65, 81)' } },
                    x: { ticks: { color: 'rgb(156, 163, 175)' }, grid: { display: false } }
                }
            }
        });
    }
}

function navigate(view) {
    state.view = view;
    const contentContainer = document.getElementById('admin-content');
    contentContainer.innerHTML = ''; // Limpiar contenido anterior
    
    // 1. Limpiar y renderizar la navegación para reflejar el estado activo
    setupDashboard(); 

    // 2. Lógica de renderizado de vistas
    if (view === 'dashboard') {
        contentContainer.innerHTML = renderDashboard();
        // Esperar un tick de JS para asegurar que el canvas existe antes de inicializar el gráfico
        setTimeout(initDashboardCharts, 50); 
    } else {
        // Contenido de ejemplo para otras vistas
        contentContainer.innerHTML = `
            <div class="bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-700 fade-in">
                <h1 class="text-3xl font-bold text-brand-red mb-4">Vista de ${view.charAt(0).toUpperCase() + view.slice(1)}</h1>
                <p class="text-gray-400">Esta es la página para la gestión de **${view}** con el rol de **${state.user.role}**.</p>
                <p class="text-xs text-gray-600 mt-4">Contenido dinámico en desarrollo. <i class="ph-bold ph-code"></i></p>
            </div>
        `;
    }
}

function setupDashboard() {
    // 1. Actualizar info de usuario en la sidebar
    document.getElementById('user-name-display').innerText = `${state.user.name} ${state.user.lastname}`;
    document.getElementById('user-role-display').innerText = state.user.role;
    document.getElementById('user-avatar').innerText = (state.user.name[0] + state.user.lastname[0]).toUpperCase();

    // 2. Construir la navegación según el rol
    const navContainer = document.getElementById('sidebar-nav');
    // Asegurar que el dashboard siempre es la primera opción
    let navHTML = createNavItem('dashboard', 'Inicio', 'ph-squares-four'); 
    const role = state.user.role;

    if (role === ROLES.COORD) {
        navHTML += buildSectionHeader('Gestión Global');
        navHTML += createNavItem('voluntai', 'Voluntai AI', 'ph-robot');
        navHTML += createNavItem('continuai', 'Continuai', 'ph-chart-line-up');
        navHTML += createNavItem('campus', 'Campus', 'ph-graduation-cap');
        navHTML += buildSectionHeader('Administración');
        navHTML += createNavItem('usuarios', 'Gestión de Usuarios', 'ph-users');
    } else if (role === ROLES.JEFE_SOCIAL) {
        navHTML += buildSectionHeader('Social');
        navHTML += createNavItem('match', 'Match Integración', 'ph-users-three');
        navHTML += createNavItem('continuai', 'Retención', 'ph-chart-line-up');
        navHTML += createNavItem('reportes', 'Reportes Sociales', 'ph-file-text');
    } else if (role === ROLES.ADMIN_PROG) {
        navHTML += buildSectionHeader('Operaciones');
        navHTML += createNavItem('campus', 'Capacitación', 'ph-graduation-cap');
        navHTML += createNavItem('voluntai', 'Asistencia', 'ph-clipboard-text');
        navHTML += createNavItem('logs', 'Registro de Actividad', 'ph-terminal');
    } else if (role === ROLES.ORG_TURNOS) {
        navHTML += buildSectionHeader('Logística');
        navHTML += createNavItem('turnos', 'Gestión de Turnos', 'ph-calendar-check');
        navHTML += createNavItem('sede', 'Mapa de Sede', 'ph-map-pin');
        navHTML += createNavItem('comunicacion', 'Comunicaciones Rápidas', 'ph-chat-circle-dots');
    } else if (role === ROLES.COMMS) {
        navHTML += buildSectionHeader('Comunicaciones');
        navHTML += createNavItem('campanas', 'Gestión de Campañas', 'ph-megaphone');
        navHTML += createNavItem('media', 'Activos Multimedia', 'ph-images');
        navHTML += createNavItem('impacto', 'Métricas de Impacto', 'ph-gauge');
    } else if (role === ROLES.RETENCION) {
        navHTML += buildSectionHeader('Retención');
        navHTML += createNavItem('seguimiento', 'Seguimiento de Voluntarios', 'ph-heart-straight');
        navHTML += createNavItem('encuestas', 'Encuestas de Satisfacción', 'ph-clipboard');
        navHTML += createNavItem('formacion', 'Formación y Desarrollo', 'ph-books');
    }

    navContainer.innerHTML = navHTML;
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderView('login');
});