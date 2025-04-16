/* ============================= GESTIÓN DE MENÚ DINÁMICO ============================= */
document.addEventListener("DOMContentLoaded", () => {
    initializeMenu();
});

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

/* ============================= FUNCIONES PRINCIPALES ============================= */
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

/* ============================= FUNCIONES AUXILIARES ============================= */
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

/* ====================== UTILIDADES ====================== */
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
    container.addEventListener('click', () => {
        const category = container.dataset.category;
        // Remover clase activa de todos los contenedores
        document.querySelectorAll('.teamsM, .teamsF').forEach(c => c.classList.remove('active'));
        container.classList.add('active');
        updateContent(category);
    });
});

function updateContent(category) {
    // Actualizar ícono principal
    const icon = document.querySelector('[data-changeable="icon"]');
    if(icon) {
        icon.src = icon.dataset[`${category}Src`];
        icon.alt = `Básquetbol ${category === 'male' ? 'Varonil' : 'Femenil'}`;
        
        // Añadir efecto de transición
        icon.style.opacity = '0';
        setTimeout(() => {
            icon.style.opacity = '1';
        }, 300);
    }

    // Actualizar título
    const title = document.querySelector('[data-changeable="title"]');
    if(title) {
        title.textContent = title.dataset[`${category}Text`];
        
        // Animación de cambio de texto
        title.style.animation = 'fadeIn 0.3s ease';
        title.addEventListener('animationend', () => {
            title.style.animation = '';
        });
    }
}
