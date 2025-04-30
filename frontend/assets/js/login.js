/* ========================================== VARIABLES / CARGA DE PÁGINA  ========================================== */
const form = document.querySelector('.login-form');
const user = document.getElementById("user");
const password = { 
  input: document.getElementById('pass'), 
  icon: document.querySelector('.icon-lock') 
};

document.addEventListener("DOMContentLoaded", () => {
  initializeMenu();
});

/* ========================================== MÉTODOS ========================================== */
// Visibilidad de contraseñas
const visibility = () => {
    password.icon.addEventListener("click", () => {
        if (password.input.type === "password") {
            password.input.type = "text";
            password.icon.innerHTML = '<ion-icon name="lock-open"></ion-icon>';
        } else {
            password.input.type = "password";
            password.icon.innerHTML = '<ion-icon name="lock-closed"></ion-icon>';
        }
    });
};

// Animación de input
function inputValidacion(inputElement) {
  inputElement.addEventListener("input", () => {
      if (inputElement.value.trim() !== "")
          inputElement.classList.add("valid");
      else
          inputElement.classList.remove("valid");      
  });
}

// Validación
form.addEventListener('submit', e=>{
  e.preventDefault();
  if(user.value.length === 0 || user.value.trim() === '')
      Toast('error', 'Bienvenido al Sistema' + '\n' + '\n' + 'Debes escribir un nombre de usuario.');
  else
      if(password.input.value.length === 0)
          Toast('error', 'Bienvenido al Sistema' + '\n' + '\n' + 'Debes escribir una contraseña.');
});

/* ========================================== LLAMADAS ========================================== */

visibility();
inputValidacion(user);
inputValidacion(password.input);

/* ========================================== ALERTA ERROR ========================================== */
function Toast(icon, titulo) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast'
      },
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    });
  
    Toast.fire({
      icon: icon,
      title: titulo
    });
  }

/* ========================================== API ========================================== */
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