/* ============================= CARGA DE PÁGINA ============================= */
let currentGroups = [];
let currentGroupIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    initializeMenu();
    initializeGroups();
    setupNavigationControls();
});


/* ============================= GESTIÓN DE MENÚ DINÁMICO ============================= */
async function initializeMenu() {
    try {
        // Cargar disciplinas desde la API
        const disciplines = await fetchDisciplines();
        
        // Procesar y mostrar en el menu
        disciplinesMenu(disciplines);

        // Configurar interactividad
        setupMenuInteractions();
    } 
    catch(error) {
        handleMenuError(error);
    }
}

/* ============================= funciones principales ============================= */
async function fetchDisciplines() {
    const response = await fetch('http://localhost:3000/api/disciplinas');

    if(!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    return response.json();
}

// Procesar y mostrar disciplinas
function disciplinesMenu(disciplines) {
    const menuContainer = document.querySelector('.subdiscipline');
    const uniqueDisciplines = getUniqueDisciplines(disciplines);

    menuContainer.innerHTML = uniqueDisciplines
        .map(discipline => createDisciplineItem(discipline))
        .join('');
}

// Configurar eventos del menú
function setupMenuInteractions() {
    setupSubmenus('.navigation > li');
    setupSubmenus('.subdiscipline > li');
    setupSubmenus('.options > li');
    setupGlobalClickHandler();
}

/* ============================= funciones auxiliares ============================= */
// Filtrar disciplinas únicas por nombre
function getUniqueDisciplines(disciplines) {
    const seen = new Set();
    return disciplines.filter(discipline => {
        const normalized = discipline.nombre.toLowerCase().trim();
        return seen.has(normalized) ? false : seen.add(normalized);
    });
}

// Crear elemento HTML para una disciplina
function createDisciplineItem(discipline) {
    return `
    <li data-discipline-id="${discipline.id_diciplinas}" 
        data-category="${discipline.categoria}">
        <a href="#" class="menu-link">
            ${discipline.nombre.toUpperCase()}
            <ion-icon name="caret-forward" class="submenu-icon"></ion-icon>
        </a>
        ${createSubmenuItems(discipline)}
    </li>
    `;
}

// Generar subitems del menú
function createSubmenuItems(discipline) {
    const basePath = `/disciplinas/${discipline.id_diciplinas}`;
    
    return `
    <ul class="options">
        <li><a href="${basePath}/grupos">GRUPOS</a></li>
        <li><a href="${basePath}/sedes">SEDES</a></li>
        <li><a href="${basePath}/equipos">EQUIPOS</a></li>
        <li><a href="${basePath}/semifinales">SEMIFINALES</a></li>
        <li><a href="${basePath}/finales">FINALES</a></li>
        <li><a href="${basePath}/posiciones">POSICIONES</a></li>
    </ul>
    `;
}

// Configurar submenús
function setupSubmenus(selector) {
    document.querySelectorAll(selector).forEach(item => {
        const submenu = item.querySelector('ul');
        if (!submenu) return;

        item.addEventListener('click', function(e) {
            if (shouldHandleClick(e, this)) {
                handleSubmenuClick(e, this);
            }
        });
    });
}

// Manejar clicks en submenús
function handleSubmenuClick(event, menuItem) {
    event.preventDefault();
    event.stopPropagation();
    
    closeSiblingSubmenus(menuItem);
    toggleSubmenu(menuItem);
}

// Cerrar otros submenús del mismo nivel
function closeSiblingSubmenus(currentItem) {
    const parentList = currentItem.closest('ul');
    if (parentList) {
        parentList.querySelectorAll('li').forEach(item => {
            if (item !== currentItem) {
                item.classList.remove('active');
            }
        });
    }
}

// Alternar estado del submenú
function toggleSubmenu(menuItem) {
    menuItem.classList.toggle('active');
}

// Cerrar todos los menús al hacer click fuera
function setupGlobalClickHandler() {
    document.addEventListener('click', () => {
        document.querySelectorAll('.navigation li').forEach(item => {
            item.classList.remove('active');
        });
    });
}

// Manejo de errores
function handleMenuError(error) {
    console.error('Error en el menú:', error);
    document.querySelector('.subdiscience').innerHTML = `
        <li class="error-message">
            <ion-icon name="warning-outline"></ion-icon>
            Error cargando disciplinas
        </li>
    `;
}

/* ====================== utilidades ====================== */
function shouldHandleClick(event, element) {
    return event.target.closest('a') || 
           event.target.tagName === 'ION-ICON' ||
           element.contains(event.target);
}

/* ============================= CAMUFLAJE DEL NAV ============================= */
const navBar = document.querySelector('.navigation');
let lastScrollY = window.pageYOffset;
const scrollThreshold = 10;     // Scroll para activar el efecto

window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;

    // Ocultar al bajar
    if(currentScrollY > lastScrollY && currentScrollY > scrollThreshold)
        navBar.classList.add('scrolled');
    else
        navBar.classList.remove('scrolled');

    // Asegurar visibilidad en el top
    if(currentScrollY <= 0)
        navBar.classList.remove('scrolled');

    lastScrollY = currentScrollY;
});

/* ============================= VARONIL / FEMENIL ============================= */
document.querySelectorAll('.teamsM, .teamsF').forEach(container => {
    container.addEventListener('click', async () => {
        const category = container.dataset.category;
        
        // Remover clase activa de todos los contenedores
        document.querySelectorAll('.teamsM, .teamsF').forEach(c => c.classList.remove('active'));
        container.classList.add('active');
        updateContent(category);

        // Obtener ID de la disciplina actual
        const disciplineId = await getDisciplineId(category);           
        console.log('ID de disciplina:', disciplineId);  
        if(!disciplineId) return;

        // Actualizar grupos
        fetchGroups().then(groups => {
            currentGroups = groups.filter(g => g.disciplinaid === disciplineId);
            currentGroupIndex = 0;
            updateGroupNavigation();
        });
    });
});

async function getDisciplineId(category) {
    try {
        // Obtener nombre de la disciplina desde el HTML
        const disciplineName = document.querySelector('.type').textContent.trim();
        
        // Fetch a endpoint de disciplinas
        const response = await fetch('http://localhost:3000/api/disciplinas');
        const disciplines = await response.json();
        
        // Buscar coincidencia exacta
        const discipline = disciplines.find(d => 
            d.nombre === disciplineName && 
            d.categoria.toLowerCase() === (category === 'male' ? 'varonil' : 'femenil')
        );

        return discipline?.id_diciplinas || null;
        
    } catch (error) {
        console.error('Error obteniendo disciplina:', error);
        return null;
    }
}

/* =================== actualización de contenido =================== */
function updateContent(category) {
    // Actualizar ícono y título
    updateCategoryDisplay(category);
    
    // Restablecer animaciones
    resetAnimations();
}

function updateCategoryDisplay(category) {
    const icon = document.querySelector('[data-changeable="icon"]');
    const title = document.querySelector('[data-changeable="title"]');

    if(icon) {
        icon.src = icon.dataset[`${category}Src`];
        icon.alt = `Básquetbol ${category === 'male' ? 'Varonil' : 'Femenil'}`;
    }

    if(title) {
        title.textContent = title.dataset[`${category}Text`];
    }
}

/* =================== NAVEGACIÓN DE GRUPOS =================== */
function setupNavigationControls() {
    document.addEventListener('click', (e) => {
        const nextBtn = e.target.closest('.next');
        const prevBtn = e.target.closest('.prev');
        
        if(nextBtn && currentGroupIndex < currentGroups.length - 1) {
            currentGroupIndex++;
            updateGroupNavigation();
        }
        
        if(prevBtn && currentGroupIndex > 0) {
            currentGroupIndex--;
            updateGroupNavigation();
        }
    });
}

function updateGroupNavigation() {
    const groupName = document.querySelector('.lblGroup h1');
    const prevArrow = document.querySelector('.prev');
    const nextArrow = document.querySelector('.next');

    if(currentGroups.length === 0) {
        groupName.textContent = 'Cargando grupos...';
        return;
    }

    groupName.textContent = currentGroups[currentGroupIndex]?.nombre || 'Sin grupos';
    prevArrow.style.display = currentGroupIndex > 0 ? 'flex' : 'none';
    nextArrow.style.display = currentGroupIndex < currentGroups.length - 1 ? 'flex' : 'none';
}

/* =================== animaciones =================== */
function resetAnimations() {
    const icon = document.querySelector('[data-changeable="icon"]');
    const title = document.querySelector('[data-changeable="title"]');

    if(icon) {
        icon.style.opacity = '0';
        setTimeout(() => icon.style.opacity = '1', 300);
    }

    if(title) {
        title.style.animation = 'fadeIn 0.3s ease';
        title.onanimationend = () => title.style.animation = '';
    }
}

/* =================== api =================== */
async function fetchGroups() {
    try {
        const response = await fetch('http://localhost:3000/api/grupos');
        if(!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
    } catch(error) {
        console.log('Error fetching groups:', error);
        return [];
    }
}

async function initializeGroups() {
    try {
        const initialCategory = document.querySelector('.teamsM.active') ? 'male' : 'female';
        console.log('Categoría inicial detectada:', initialCategory);

        const disciplineId = await getDisciplineId(initialCategory);
        console.log('ID de disciplina inicial:', disciplineId);

        if (!disciplineId) {
            console.log('Disciplina inicial no encontrada');
            return;
        }

        const groups = await fetchGroups();
        console.log('Grupos obtenidos:', groups);

        currentGroups = groups.filter(g => g.disciplinaid === disciplineId);
        console.log('Grupos filtrados:', currentGroups);

        const teams = await getTeamsId(disciplineId, );
        console.log('Equipos obtenidos:', teams);

        currentGroupIndex = 0;
        updateGroupNavigation();
        
    } catch (error) {
        console.error('Error inicializando grupos:', error);
        currentGroups = [];
        updateGroupNavigation();
    }
}

/* =================== EQUIPOS POR GRUPO =================== */
async function fetchTeams() {
    try {
        const response = await fetch('http://localhost:3000/api/equipo');
        if(!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
    } catch(error) {
        console.log('Error fetching groups:', error);
        return [];
    }
}

async function getTeams(disciplinaid, grupoid) {
    try {
        const teams = await fetchTeams();
        
        // Buscar coincidencia exacta
        const team = teams.find(d => 
            d.nombre === disciplineName && 
            d.categoria.toLowerCase() === (category === 'male' ? 'varonil' : 'femenil')
        );

        return team?.id_diciplinas || null;
        
    } catch (error) {
        console.error('Error obteniendo disciplina:', error);
        return null;
    }
}