import { AttendanceService } from "./attendanceService.js";

/* ============================= CARGA DE PÁGINA ============================= */
let currentGroups = [];
let currentTeams = [];
let currentGroupIndex = 0;
let currentTeamIndex = 0;
let currentSede = null;
let allSedes = [];
let currentIndex = 0;
let firstBan = false;

document.addEventListener("DOMContentLoaded", () => {
    initializeMenu();
    getImagenesCarousel();
    initializeGroups();
    setupNavigationControls();
    setupSedesControl();
});


/* ============================= FUNCIONES ============================= */
// Quitar acentos
function removeAccents(str) {
    return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')    // Elimina diacríticos
            .replace(/ñ/g, 'n')
            .replace(/Ñ/g, 'N');
}

// Formatear fecha y hora
function formatearFecha(fechaStr) {
    const [dia, mes, anio] = fechaStr.split('-');
    const fecha = new Date(`${mes}/${dia}/${anio}`);
    
    const opciones = {
        day: '2-digit',     // Día con 2 dígitos
        month: 'long'       // Mes en texto completo
    };
    
    const fechaFormateada = fecha.toLocaleDateString('es-MX', opciones)
        .replace(' de ', ' DE ')
        .toUpperCase();

        return fechaFormateada;        
}

function formatearHora(horaStr) {
    const [horas24, minutos] = horaStr.split(':');
    const horas = parseInt(horas24, 10);
    const sufijo = horas >= 12 ? 'PM' : 'AM';
    const horas12 = horas % 12 || 12;

    const horaFormateada = `${horas12.toString().padStart(2, '0')}:${minutos} ${sufijo}`;

    return horaFormateada;
}

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

        // Actualizar grupos y equipos
        const groups = await fetchGroups();
        currentGroups = groups.filter(g => g.disciplinaid === disciplineId);
        console.log('Grupos filtrados:', currentGroups);
        currentGroupIndex = 0;
        updateGroupNavigation(); // Actualiza la UI inmediatamente
        const teams = await getTeamsByGroup(currentGroups[currentGroupIndex]?.id_grupo);
        console.log('Equipos del grupo: ', teams);
        await renderTeams(teams);

        await updateGroupTeam();
    });
});

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
    document.addEventListener('click', async (e) => {
        const nextBtn = e.target.closest('.next');
        const prevBtn = e.target.closest('.prev');
        
        if(nextBtn && currentGroupIndex < currentGroups.length - 1) {
            currentGroupIndex++;
            updateGroupNavigation();
            const teams = await getTeamsByGroup(currentGroups[currentGroupIndex]?.id_grupo);
            console.log('Equipos del grupo: ', teams);
            await renderTeams(teams);
        }
        
        if(prevBtn && currentGroupIndex > 0) {
            currentGroupIndex--;
            updateGroupNavigation();
            const teams = await getTeamsByGroup(currentGroups[currentGroupIndex]?.id_grupo);
            console.log('Equipos del grupo: ', teams);
            await renderTeams(teams);
        }
    });
}

function updateGroupNavigation() {
    const groupName = document.querySelector('.lblGroup h1');
    const prevArrow = document.querySelector('.prev');
    const nextArrow = document.querySelector('.next');

    if(currentGroups.length === 0) {
        groupName.textContent = 'No hay grupos disponibles';
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'none';
        return;
    }

    const currentGroup = currentGroups[currentGroupIndex];
    groupName.textContent = removeAccents(currentGroup?.nombre) || 'Grupo desconocido';
    
    // Control de flechas
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

/* =================== NAVEGACIÓN DE EQUIPOS =================== */
async function renderTeams(teams) {
    const container = document.querySelector('.points');    
    
    // Limpiar contenido existente
    const existingTeams = container.querySelectorAll('.sections.teams:not(.titlePoints)');
    existingTeams.forEach(team => team.remove());

    for(const team of teams) {
        const logos = await getLogoByTeam(team.tecsid);
        const logo = logos || {};

        const points = await getPointsByTeam(team.id_equipo);
        const point = points || {};

        const ciudad = logo.ciudad;
        let rutaLogo = logo.logo;

        if(ciudad === 'Puruándiro')
            rutaLogo = '/frontend/assets/images/Puruándiro.webp'
        else if(ciudad === 'Purhépecha')
            rutaLogo = '/frontend/assets/images/Purhépecha.webp'

        const teamHTML = `
            <div class="sections teams">
                <div class="team">
                    <div class="teamImg">
                        <img src="${rutaLogo}" alt="${ciudad}" class="teamLogos">
                    </div>                    
                    <p class="tec">${team.nombre ? team.nombre : logo.ciudad}</p>
                </div>

                <div class="numberPoints">
                    <div>${point.partidosJugados ?? ''}</div>
                    <div>${point.partidosGanados ?? ''}</div>
                    <div>${point.partidosPerdidos ?? ''}</div>
                    <div>${point.puntosAFavor ?? ''}</div>
                    <div>${point.puntosEnContra ?? ''}</div>
                    <div>${point.diferenciaPuntos ?? ''}</div>
                    <div class="pts">${point.puntosTotales ?? ''}</div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', teamHTML);
    };

    // Añadir filas vacías si hay menos de 4 equipos
    const remainingSlots = 4 - teams.length;
    for(let i = 0; i < remainingSlots; i++)
        container.insertAdjacentHTML('beforeend', 
            '<div class="sections teams"></div>'
        );

    // Quitar última línea
    const allPts = container.querySelectorAll('.pts');
    if (allPts.length > 0) {
        allPts[allPts.length - 1].classList.add('noline');
    }
}

/* ============================= CARD DE SEDES ============================= */
async function updateCardWithData(sede) {
    const card = document.querySelector('.cardHolder');

    card.querySelector('.cardTitle').textContent = removeAccents(sede.nombre);
    card.querySelector('img').src = sede.imagen;
    card.querySelector('.cardUb p').textContent = sede.ubicacion;

    // Actualizar links con datos reales
    const linksContainer = card.querySelector('.cardLinks');
    linksContainer.innerHTML = '';

    // Link Encontrar
    const mapLink = document.createElement('a');
    mapLink.href = sede.mapa;
    mapLink.innerHTML = '<img src="/frontend/assets/images/Location.webp" alt="Ubicacion">Encontrar';
    linksContainer.appendChild(mapLink);

    // Link Restaurantes
    try {
        const nearbyPoints = await getNearestPoints(sede.id_cancha);
        const restaurants = nearbyPoints.filter(p => p.tipo === 'Restaurante');

        if(restaurants.length > 0) {
            const restaurantLink = document.createElement('a');
            restaurantLink.href = `#`;
            restaurantLink.innerHTML = '<img src="/frontend/assets/images/Rest.webp" alt="Restaurantes">Restaurantes Cercanos';
            linksContainer.appendChild(restaurantLink);
        }
    } catch(error) {
        console.error('Error cargando restaurantes: ', error);
    }
}

async function updateCarousel() {
    const carousel = document.querySelector('.carImg');
    carousel.innerHTML = '';

    // Filtrar sedes excluyendo la actual del card
    const availableSedes = allSedes.filter(sede =>
        sede.tipo === currentSede.tipo &&
        sede.id_cancha !== currentSede.id_cancha
    );
    console.log(availableSedes);

    // Reordenar sedes para efecto circular
    const reorderedSedes = [];
    for(let i = -1; i < availableSedes.length - 1; i++) {
        const adjustedIndex = (currentIndex + i + availableSedes.length) % availableSedes.length;
        reorderedSedes.push(availableSedes[adjustedIndex]);
    }
    console.log(reorderedSedes);

    // Aplicar CSS condicionales
    carousel.classList.remove('only-two');
    if(availableSedes.length <= 3)
        carousel.classList.add('only-two');

    // Crear elementos
    reorderedSedes.forEach((sede, index) => {
        const img = document.createElement('img');
        img.src = sede.imagen;
        img.alt = sede.nombre;
        img.className = `carouselItem${index + 1}`;        

        console.log('Current Index: ', currentIndex);
        img.addEventListener('click', async () => {
            if((index + 1) === 1) {
                // Navegación hacia atrás
                if(!firstBan) {
                    currentIndex = 0;
                    firstBan = true;
                }
                else {
                    currentIndex = (currentIndex - 1 + availableSedes.length) % availableSedes.length;
                    console.log('Current Index atras: ', currentIndex);
                }
            }
            else {
                // Navegación hacia adelante
                if(!firstBan) {
                    currentIndex = 1;
                    firstBan = true;
                }
                else {
                    currentIndex = (currentIndex + 1 + availableSedes.length) % availableSedes.length;
                    console.log('Current Index adelante: ', currentIndex);
                }                
            }
            
            currentSede = sede;
            await updateCardWithData(currentSede);
            await updateCarousel();
        });

        carousel.appendChild(img);
    });
}

async function setupSedesControl() {
    document.querySelectorAll('.sedesOptions p').forEach(option => {
        option.addEventListener('click', async () => {
            const title = document.querySelector('.sedesTitles h3');

            // Guardar textos
            const prevTitle = title.textContent.trim(); 
            const newTitle = option.textContent.trim();
            
            // Agregar clases de animación
            title.classList.add('animating-down');
            option.classList.add('animating-up');

            // Esperar a que termine la animación (coincide con el 'transition' del CSS)
            setTimeout(async () => {
                // Intercambiar textos
                title.textContent = newTitle;
                option.textContent = prevTitle;

                title.classList.remove('animating-down');
                option.classList.remove('animating-up');

                document.querySelectorAll('.sedesOptions p').forEach(p => p.classList.remove('active'));
                option.classList.add('active');

                const sedes = await getSedeByTitle();
                if (sedes.length === 0) {
                    console.log('No hay sedes para esta categoría');
                    return;
                }
                currentSede = sedes[0];
                await updateCardWithData(currentSede);
                await updateCarousel();
            }, 300);
        });
    });
}

/* ============================= LISTA DE ASISTENCIA ============================= */
async function updateGroupTeam() {
    const groupName = document.querySelector('.groupText h1');
    const prevGroup = document.querySelector('.groupPrev');
    const nextGroup = document.querySelector('.groupNext');
    const prevTeam = document.querySelector('.prevPlayer');
    const nextTeam = document.querySelector('.nextPlayer');

    if(currentGroups.length === 0) {
        groupName.textContent = 'No hay grupos disponibles';
        [prevGroup, nextGroup, prevTeam, nextTeam].forEach(btn =>
            btn.classList.add('disabled'));
        return;
    }

    const currentGroup = currentGroups[currentGroupIndex];
    const groupNameText = removeAccents(currentGroup?.nombre) || 'Grupo desconocido';
    const text = groupNameText.split(" ").pop() || 'Desconocido';
    groupName.textContent = text;

    // Grupo
    prevGroup.classList.toggle('disabled', currentGroupIndex === 0);
    nextGroup.classList.toggle('disabled', currentGroupIndex === currentGroups.length - 1); 
    // Equipos del grupo actual
    try {
        currentTeams = await getTeamsByGroup(currentGroup.id_grupo);
        currentTeamIndex = 0;
        console.log('Equipo', currentTeamIndex); 
        await updateTeamLogo();
    } catch(error) {
        console.error('Error cargando equipos: ', error);
        currentTeams = [];
    }    

    // Actualizar estado de los botones
    prevGroup.classList.toggle('disabled', currentGroupIndex === 0);
    nextGroup.classList.toggle('disabled', currentGroupIndex === currentGroups.length - 1);
    updateTeamButtons();
}

async function updateTeamLogo() {
    const teamLogo = document.querySelector('.teamLogo img');

    if(currentTeams.length === 0) {
        teamLogo.src = '';
        teamLogo.alt = 'Logo no disponible';
        return;
    }
    
    const currentTeam = currentTeams[currentTeamIndex];

    try {
        const tec = await getLogoByTeam(currentTeam.tecsid);
        teamLogo.src = tec.logo || "";
        teamLogo.alt = tec.ciudad || 'Logo no disponible';
    } catch(error) {
        console.log('Error cargando logo: ', error);
    }

    if(currentTeam)
        await updateTeamPlayers(currentTeam.id_equipo);        
}

function updateTeamButtons() {
    const prevTeam = document.querySelector('.playersTeam.af');
    const nextTeam = document.querySelector('.playersTeam.bf');
    const isFirst = currentTeamIndex === 0;
    const isLast = currentTeamIndex === currentTeams.length - 1;

    prevTeam.classList.toggle('disabled', isFirst);
    nextTeam.classList.toggle('disabled', isLast);

    document.querySelector('.prevPlayer').classList.toggle('disabled', isFirst);
    document.querySelector('.nextPlayer').classList.toggle('disabled', isLast);

}

function prevGroup() {
    if(currentGroupIndex > 0) {
        currentGroupIndex--;
        updateGroupTeam();
    }
}

function nextGroup() {
    if(currentGroupIndex < currentGroups.length - 1) {
        currentGroupIndex++;
        updateGroupTeam();
    }
}

function prevTeam() {
    if(currentTeamIndex > 0) {
        currentTeamIndex--;
        updateTeamLogo();
        updateTeamButtons();
    }
}

function nextTeam() {
    if(currentTeamIndex < currentTeams.length - 1) {
        currentTeamIndex++;
        updateTeamLogo();
        updateTeamButtons();
    }
}

async function renderPlayerHTML(player, isRight) {
    const team = await getTeamById(player.equipoid);    
    const tec = await getLogoByTeam(team.tecsid);

    return `
        <div class="bgPlayer ${isRight ? 'rgth' : ''}" data-player-id="${player.id_jugador}">
            ${isRight ? `
                <p class="numberPlayer rgth">${player.numero || 'N/A'}</p>

                <div class="namePlayer rgth">
                    <h3>${formatFirstName(player.nombre).toUpperCase()}</h3>
                    <p>${formatLastName(player.nombre)}</p>    
                </div>

                <img src="${tec.logo || ""}" alt="logo" class="logoPlayer rgth">

                <div class="picPlayer rgth">
                    <img src="${player.foto || ""}" alt="foto">
                </div>
            ` : `
                <div class=picPlayer>
                    <img src="${player.foto || ""}" alt="foto">
                </div>

                <img src="${tec.logo || ""}" alt="logo" class="logoPlayer">

                <div class="namePlayer">
                    <h3>${formatFirstName(player.nombre).toUpperCase()}</h3>
                    <p>${formatLastName(player.nombre)}</p>    
                </div>

                <p class="numberPlayer">${player.numero || 'N/A'}</p>
            `}
        </div>
    `;
}

function formatFirstName(fullName) {
    if(!fullName) return 'Jugador';
    const parts = fullName.split(' ');
    return parts.length > 3 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
}

function formatLastName(fullName) {
    if(!fullName) return 'Sin apellido';
    const parts = fullName.split(' ');
    const lastNames = parts.length > 3 ? parts.slice(2) : parts.slice(1);
    return lastNames.join(' ') || 'Sin apellido';
}

async function updateTeamPlayers(equipoId) {
    try {
        const players = await getPlayersByTeam(equipoId);
        console.log('Jugadores: ', players);
        const count = document.querySelector('.countPlayers');
        const playerContLeft = document.querySelector('.col.left .listPlayers');
        const playerContRight = document.querySelector('.col.right .listPlayers');

        playerContLeft.innerHTML = '';
        playerContRight.innerHTML = '';

        // Dividir jugadores
        const middleIndex = Math.ceil(players.length / 2);
        const leftPlayers = players.slice(0, middleIndex);
        const rightPlayers = players.slice(middleIndex);

        // Renderizar jugadores izquierda / derecha
        const leftHTML = await Promise.all(
            leftPlayers.map(player => renderPlayerHTML(player, false))
        );
        playerContLeft.innerHTML = leftHTML.join('');

        const rightHTML = await Promise.all(
            rightPlayers.map(player => renderPlayerHTML(player, true))
        );
        playerContRight.innerHTML = rightHTML.join('');        

        count.innerHTML = `<p>${players.length}</p>`;

        if(players.length === 0) {
            playerContLeft.innerHTML = '<p>No hay jugadores</p>';
            count.innerHTML = '<p>-1</p>';
        }

        // Evento de click
        setupAttendance();
        updateAttendanceCounter();        
    } catch(error) {
        console.log('Error actualizando jugadores: ', error);
    }
}

const setupAttendance = () => {
    document.querySelectorAll('.bgPlayer').forEach(playerElement => {
        const playerId = parseInt(playerElement.dataset.playerId);

        const teamId = currentTeams[currentTeamIndex]?.id_equipo;
        console.log(teamId);

        // Estado inicial
        playerElement.classList.toggle(
            'clicked',
            AttendanceService.getTeamAttendance(teamId).has(playerId)
        );

        // Click handler
        playerElement.addEventListener('click', () => {
            if(!teamId || isNaN(playerId)) return;

            const newState = AttendanceService.markPlayer(teamId, playerId);
            playerElement.classList.toggle('clicked', newState);
           
            console.log('Asistencia actualizada: ', AttendanceService.getTeamAttendance(teamId));
            updateAttendanceCounter();
        });
    });
};

function updateAttendanceCounter() {       
    const complete = document.querySelector('.complete');
    const teamId = currentTeams[currentTeamIndex]?.id_equipo;
    const total = document.querySelector('.countPlayers p');
    const present = teamId ? AttendanceService.getTeamAttendance(teamId).size : 0;
    const players = parseInt(total?.textContent, 10) || 0;

    console.log("Asistentes: ", present, "/", players);

    if(present === players)
        complete.classList.remove('hidden');
    else
        complete.classList.add('hidden');
}

/* ============================= SEMIFINALES ============================= */
async function updateSemifinals(disciplinaId) {
    const container = document.querySelector('.semiContainer');

    try {        
        const partidos = await getSemifinals(disciplinaId);
        container.innerHTML = '';
        
        if(!partidos || partidos.length === 0) {
            container.innerHTML = '<p>No hay partidos programados</p>'
            return;
        }

        for(const partido of partidos) {
            try {
                const [localTeam, guestTeam] = await Promise.all([
                    getTeamById(partido.equipoLocalid),
                    getTeamById(partido.equipoVisitid)
                ]);
                
                const [localLogo, guestLogo] = await Promise.all([
                    getLogoByTeam(localTeam.tecsid),
                    getLogoByTeam(guestTeam.tecsid)
                ]);

                const detail = await getPartidosByRol(partido.id_RolDeJuegos);                            
                const cancha = await getSedeById(detail.canchaid);                

                const partidoHTML = `
                    <div class="infoCont">
                        <img src="/frontend/assets/images/Info.webp" alt="Info">
                        <p>DETALLES</p>
                    </div>

                    <div class="teamsCont">
                        <div class="firstTeam">
                            <div class="imgWrapper">
                                <img src="${localLogo.logo}" alt="${localLogo.ciudad}">
                            </div>

                            <p>${removeAccents(localTeam?.nombre) || removeAccents(localLogo.ciudad)}</p>
                        </div>

                        <div class="dateTime">
                            <p class="date">${formatearFecha(partido.fecha)}</p>
                            <p class="time">${formatearHora(partido.hora)}</p>
                        </div>

                        <div class="secondTeam">
                            <div class="imgWrapper scnd">
                                <img src="${guestLogo.logo}" alt="${guestLogo.ciudad}">
                            </div>

                            <p>${removeAccents(guestTeam?.nombre) || removeAccents(guestLogo.ciudad)}</p>                        
                        </div>
                    </div>

                    <div class="canchaCont">
                        <p>${cancha.nombre}</p>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', partidoHTML);               
            } catch(error) {
                console.log('Error cargando semifinales:', error);
            }
        }
    } catch(error) {
        console.error('Error cargando semifinales:', error);
    }
}


/* ============================= API ============================= */
async function initializeGroups() {
    try {
        // Categoría inicial
        const initialCategory = document.querySelector('.teamsM.active') ? 'male' : 'female';
        console.log('Categoría inicial detectada:', initialCategory);

        const disciplineId = await getDisciplineId(initialCategory);
        console.log('ID de disciplina inicial:', disciplineId);

        if (!disciplineId) {
            console.log('Disciplina inicial no encontrada');
            return;
        }

        // Carga y filtrado de grupos
        const groups = await fetchGroups();
        console.log('Grupos obtenidos:', groups);

        currentGroups = groups.filter(g => g.disciplinaid === disciplineId);
        console.log('Grupos filtrados:', currentGroups);        

        updateGroupNavigation();

        const groupName = document.querySelector('.lblGroup h1').textContent.trim().toLowerCase();
        console.log('Nombre: ', groupName);
        const currentGroup = currentGroups.find(g => g.nombre.toLowerCase() === groupName);
        if (!currentGroup) console.log('Grupo no encontrado');
        else console.log('Grupo: ', currentGroup);

        const teams = await getTeamsByGroup(currentGroup.id_grupo);
        console.log('Equipos del grupo: ', teams);
        await renderTeams(teams);
        
        currentGroupIndex = currentGroups.findIndex(g => g.id_grupo === currentGroup.id_grupo);

        const sedes = await getSedeByTitle();
        console.log('Sedes: ', sedes);        
        currentSede = sedes[0];
        await updateCardWithData(currentSede);
        await updateCarousel();

        document.querySelector('.groupPrev').addEventListener('click', prevGroup);
        document.querySelector('.groupNext').addEventListener('click', nextGroup);
        document.querySelector('.prevPlayer').addEventListener('click', prevTeam);
        document.querySelector('.nextPlayer').addEventListener('click', nextTeam);
        await updateGroupTeam();

        const fase = document.querySelector('.semiLeft h3').textContent.trim();
        console.log('Fase: ', fase);
        await updateSemifinals(disciplineId);

    } catch (error) {
        console.error('Error inicializando grupos:', error);
        currentGroups = [];
        updateGroupNavigation();
    }
}


/* =================== CONSULTAS =================== */
async function getPartidosByRol(rolid) {
    try {
        const partidos = await fetchPartidos();
        return partidos.find(p => p.rolid === rolid);
    } catch(error) {
        console.error('Error obteniendo partidos: ', error);
        return [];
    }
}

async function getSemifinals(disciplinaid) {
    try {
        const semifinals = await fetchRoldeJuegos();
        return semifinals.filter(s => s.disciplinaid === disciplinaid);
    } catch(error) {
        console.error('Error obteniendo semifinales: ', error);
        return [];
    }
}

async function getPlayersByTeam(equipoid) {
    try {
        const players = await fetchJugadores();
        return players.filter(p => p.equipoid === equipoid);
    } catch(error) {
        console.error('Error obteniendo jugadores: ', error);
        return [];
    }
}

async function getNearestPoints(canchaid) {
    try {
        const points = await fetchPuntosdeInteres();
        return points.filter(p => p.canchaid === canchaid);
    } catch(error) {
        console.error('Error obteniendo puntos cercanos:', error);
        return [];
    }
}

async function getSedeById(canchaid) {
    try {
        const canchas = await fetchSedes();
        return canchas.find(c => c.id_cancha === canchaid);
    } catch(error) {
        console.error('Error obteniendo sede por ID:', error);
        return [];
    }
}

async function getSedeByTitle() {
    try {
        const type = document.querySelector('.sedesTitles h3').textContent.trim().toUpperCase();
        allSedes = await fetchSedes();

        const typeMap = {
            'CANCHAS': 'CANCHA',
            'HOSPITALES': 'HOSPITAL',
            'HOTELES': 'HOTEL'           
        };

        return allSedes.filter(s => s.tipo.toUpperCase() === typeMap[type]);        
    } catch(error) {
        console.error('Error obteniendo sede por título:', error);
        return [];
    }
}

async function getPointsByTeam(equipoid) {
    try {
        const points = await fetchClasificacion();
        return points.find(p => p.equipoid === equipoid);
    } catch (error) {
        console.error('Error obteniendo puntos:', error);
        return null;
    }
}

async function getTeamById(equipoid) {
    try {
        const team = await fetchEquipos();
        return team.find(t => t.id_equipo === equipoid);
    } catch(error) {
        console.log('Error obteniendo equipos: ', error);
        return null;
    }
}

async function getLogoByTeam(tecsid) {
    try {
        const tec = await fetchTecs();
        return tec.find(t => t.id_tecs === tecsid);
    } catch(error) {
        console.error('Error obteniendo logo:', error);
        return null;
    }
}

async function getTeamsByGroup(grupoid) {
    try {
        const teams = await fetchEquipos();
        return teams.filter(t => t.grupoid === grupoid);
    } catch (error) {
        console.error('Error obteniendo equipos:', error);
        return [];
    }
}

async function getDisciplineId(category) {
    try {
        // Obtener nombre de la disciplina desde el HTML
        const disciplineName = document.querySelector('.type').textContent.trim();
        
        // Fetch a endpoint de disciplinas
        const disciplines = await fetchDisciplines();
        
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

async function getImagenesCarousel() {
    try {
        const tecs = await fetchTecs();
        const tecContainer = document.querySelector('.tecs');

        tecContainer.innerHTML = '';

        tecs.forEach(tec => {
            const image = document.createElement('img');
            image.src = tec.logo;
            image.alt = tec.nombre;
            tecContainer.appendChild(image);
        });
    } catch(error) {
        console.error('Error cargando los tecs:', error);
    }
}

/* =================== FETCH =================== */
async function fetchDisciplines() {
    try {
        const response = await fetch('http://localhost:3000/api/disciplinas');
        if(!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch(error) {
        console.error('Error obteniendo disciplinas:', error);
        return [];
    }
}

async function fetchClasificacion() {
    try {
        const response = await fetch('http://localhost:3000/api/clasificacion');
        if(!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
    } catch(error) {
        console.log('Error fetching clasificacion:', error);
        return [];
    }
}

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

async function fetchEquipos() {    
    try {
        const response = await fetch('http://localhost:3000/api/equipo');
        if(!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
    } catch(error) {
        console.log('Error fetching teams:', error);
        return [];
    }
}

async function fetchTecs() {
    try {
        const response = await fetch('http://localhost:3000/api/tecs');
        if(!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
    } catch(error) {
        console.log('Error fetching tecs:', error);
        return [];
    }
}

async function fetchSedes() {
    try {
        const response = await fetch('http://localhost:3000/api/cancha');
        if(!response.ok) throw new Error(`Error ${response.status}`); 
        return response.json();
    } catch(error) {
        console.log('Error fetching sedes:', error);  
        return [];
    }
}

async function fetchPuntosdeInteres() {
    try {
        const response = await fetch('http://localhost:3000/api/puntosdeinteres');
        if(!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
    } catch(error) {
        console.log('Error fetching puntos de interés:', error);
        return [];
    }
}

async function fetchJugadores() {
    try {
        const response = await fetch('http://localhost:3000/api/jugador');
        if(!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
    } catch(error) {
        console.log('Error fetching puntos de interés:', error);
        return [];
    }
}

async function fetchPartidos() {
    try {
        const response = await fetch('http://localhost:3000/api/partido');
        if(!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
    } catch(error) {
        console.log('Error fetching partidos: ', error);
        return [];
    }
}

async function fetchRoldeJuegos() {
    try {
        const response = await fetch('http://localhost:3000/api/roldejuegos');
        if(!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
    } catch(error) {
        console.log('Error fetching roles de juegos: ', error);
        return [];
    }
}