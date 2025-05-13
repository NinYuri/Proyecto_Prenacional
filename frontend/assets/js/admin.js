/* ========================================== CARGA DE PÁGINA  ========================================== */
const disciplineName = document.querySelector('.type').textContent.trim();

document.addEventListener("DOMContentLoaded", async () => {
    await initializeMenu();
    await setupOption();
});

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

/* ========================================== MENÚ ========================================== */
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
  const name = discipline.nombre.toUpperCase();
  let ruta = '#';

  if(name === 'BÁSQUETBOL')
    ruta = './discBasquet.html';
  else if(name === 'VOLEIBOL')
    ruta = './discVolley.html';
  else if(name === 'FÚTBOL')
    ruta = './discFutbol.html';

  return `
  <li data-discipline-id="${discipline.id_diciplinas}" 
      data-category="${discipline.categoria}">
      <a href="${ruta}" class="menu-link">
          ${name}
      </a>
  </li>
  `;
}

// Configurar submenús
function setupSubmenus(selector) {
  document.querySelectorAll(selector).forEach(item => {
      const submenu = item.querySelector('ul');
      if (!submenu) return;

      let hoverTimeout;

      // Abrir con hover
      item.addEventListener('mouseenter', () => {
          if(!item.classList.contains('pinned')) {
              clearTimeout(hoverTimeout);
              handleSubmenuHover(item);
          }
      });

      // Cerrar submenú al salir
      item.addEventListener('mouseleave', () => {
          if(!item.classList.contains('pinned')) {
              hoverTimeout = setTimeout(() => closeSubmenu(item), 300);
          }
      });

      submenu.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
      submenu.addEventListener('mouseleave', () => {
          if (!item.classList.contains('pinned'))
              closeSubmenu(item);        
      });

      // Abrir / cerrar con click
      const link = item.querySelector('a');
      if(link) {
          link.addEventListener('click', (e) => {
              if(!submenu) return;
              e.preventDefault();
              const isPinned = item.classList.contains('pinned');

              submenu.querySelectorAll('a').forEach(link => {
                  link.addEventListener('click', () => {
                      closeAllSubmenus(); // Cierra menú al seleccionar opción
                  });
              });

              // Cerrar los demás submenús
              document.querySelectorAll(selector).forEach(otherItem => {
                  otherItem.classList.remove('pinned', 'active');
              });

              if(!isPinned)
                  item.classList.add('pinned', 'active');
              else
                  item.classList.remove('pinned', 'active');
          });
      }
  });

  document.addEventListener('click', (e) => {
      const clickedInsideMenu = e.target.closest('li');
      if(!clickedInsideMenu)
          closeAllSubmenus();
  });
}

// Manejar hover
function handleSubmenuHover(menuItem) {
  closeSiblingSubmenus(menuItem);
  menuItem.classList.add('active');
}

// Cerrar submenú
function closeSubmenu(menuItem) {
  menuItem.classList.remove('active');
}

// Cerrar otros submenús del mismo nivel
function closeSiblingSubmenus(currentItem) {
  const parentList = currentItem.closest('ul');
  if (parentList) {
      parentList.querySelectorAll('li').forEach(item => {
          if (item !== currentItem)
              item.classList.remove('active');            
      });
  }
}

// Cerrar al hacer click fuera de él
function closeAllSubmenus() {
  document.querySelectorAll('li.active, li.pinned').forEach(item => {
      item.classList.remove('active', 'pinned');
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

/* ========================================== BOTONES ========================================== */
async function setupOption() {
    const container = document.querySelector('.groupOptions');    
    const subContainer = document.querySelector('.info');

    document.querySelectorAll('.lblOption').forEach((option => {
        option.addEventListener('click', async() => {
            const text = option.textContent.trim();
            const opt = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            container.innerHTML = '';
            subContainer.innerHTML = '';

            container.insertAdjacentHTML('beforeend', `
                <div class="bttnOpt">
                    <div class="opt Add"><ion-icon name="add-circle"></ion-icon>AGREGAR</div> 
                    <div class="opt Mod"><ion-icon name="pencil"></ion-icon>MODIFICAR</div>
                    <div class="opt Sear"><ion-icon name="search"></ion-icon>BUSCAR</div>          
                    <div class="opt Del"><ion-icon name="trash"></ion-icon>ELIMINAR</div>                  
                </div>

                <div class="bttnNm">
                    <p>${opt}</p>
                </div>
            `);

            // Remover listeners previos
            container.removeEventListener('click', SubOptionG);
            container.removeEventListener('click', SubOptionE);
            container.removeEventListener('click', SubOptionJ);

            // Delegación de eventos para sub-opciones
            if (opt === 'Grupo')
                container.addEventListener('click', SubOptionG);
            else if (opt === 'Equipo')
                container.addEventListener('click', SubOptionE);
            else if (opt === 'Jugador')
                container.addEventListener('click', SubOptionJ);            
        });
    }));
}

async function SubOptionG(e) {
    const container = document.querySelector('.info');
    const addBtn = e.target.closest('.opt.Add');
    const modBtn = e.target.closest('.opt.Mod');
    const searBtn = e.target.closest('.opt.Sear');
    const delBtn = e.target.closest('.opt.Del');

    if(addBtn) {
        container.innerHTML = `
            <div class="input-box">           
                <p class="title">GRUPO</p>         
                <input class="input" id="name" type="text">                                               
            </div> 

            <div class="category">
                <p class="title">CATEGORIA</p>      
                <select class="input selector" id="categoria">
                    <option value="Femenil">Femenil</option>
                    <option value="Varonil">Varonil</option>
                </select>
            </div>

            <button class="btns" id="save">GUARDAR</button> 
        `;

        document.getElementById('save').addEventListener('click', NewGroup);
    }

    if(modBtn) {
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);
        const groups = await getGroupsByDiscipline(ids);

        // Genera las opciones
        const optionsHTML = groups.map(group => 
            `<option value="${group.id_grupo}">${group.nombre}</option>`
        ).join('');

        container.innerHTML = `
            <div class="modify">
                <p>SELECCIONE EL GRUPO A MODIFICAR</p>                
                <select class="input selector m" id="groupS">
                    ${optionsHTML}
                </select>
            </div>

            <button class="btns" id="select">SELECCIONAR</button> 
        `;

        document.getElementById('select').addEventListener('click', SelectGroup);
    }

    if(searBtn) {
        container.innerHTML = `
            <div class="modify">           
                <p>ESCRIBA EL NOMBRE DEL GRUPO QUE DESEA BUSCAR</p>         
                <input class="input m" id="name" type="text">                                               
            </div> 

            <div class="modify">
                <p class="catSearch">SELECCIONE SU CATEGORÍA</p>      
                <select class="input selector m" id="categoria">
                    <option value="Femenil">Femenil</option>
                    <option value="Varonil">Varonil</option>
                </select>
            </div>

            <button class="btns" id="search">BUSCAR</button> 
        `;
        document.getElementById('search').addEventListener('click', SearchGroup);
    }

    if(delBtn) {    
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);
        const groups = await getGroupsByDiscipline(ids);

        container.innerHTML = `
            <div class="modify">
                <p>SELECCIONE EL GRUPO A ELIMINAR</p>                
                <select class="input selector m" id="groupS">
                    ${groups.map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`).join('')}
                </select>
            </div>

            <button class="btns" id="delete">ELIMINAR</button> 
        `;

        document.getElementById('delete').addEventListener('click', DeleteGroup);
    }
}

async function SubOptionE(e) {
    const container = document.querySelector('.info');
    const addBtn = e.target.closest('.opt.Add');
    const modBtn = e.target.closest('.opt.Mod');
    const searBtn = e.target.closest('.opt.Sear');
    const delBtn = e.target.closest('.opt.Del');    

    if(addBtn) {
        try {            
            let category = document.getElementById('categoria')?.value;
            if(!category) category = 'Femenil';

            const discipline = await getDisciplineId(category.toLowerCase());
            const groups = await getGroupsByDiscID(discipline);
            const tecs = await getTecs();

            container.innerHTML = `
                <div class="category team">
                    <div class="teamOpt">
                        <p class="title">NOMBRE</p>
                        <input class="input selector team" id="name" type="text" placeholder="Opcional">
                    </div>           
                        
                    <div class="teamOpt">
                        <p class="title">CATEGORIA</p>      
                        <select class="input selector team" id="categoria">
                            <option value="Femenil">Femenil</option>
                            <option value="Varonil">Varonil</option>
                        </select>
                    </div>
                </div> 

                <div class="category team">
                    <div class="teamOpt">
                        <p class="title">GRUPO</p>
                        <select class="input selector team" id="groupTm">
                            ${groups.map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`).join('')}
                        </select>
                    </div>

                    <div class="teamOpt">
                        <p class="title">TEC</p>
                        <select class="input selector team" id="tecTm">
                            ${tecs.map(tec => `<option value="${tec.id_tecs}">${tec.nombre}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <button class="btns" id="save">GUARDAR</button>
            `;            

            document.getElementById('save').addEventListener('click', NewTeam);

            // Escuchar cambios en la categoría para actualizar los grupos
            document.getElementById('categoria').addEventListener('change', async (e) => {
                const selectedCategory = e.target.value;
                const disciplineId = await getDisciplineId(selectedCategory.toLowerCase());
                const updatedGroups = await getGroupsByDiscID(disciplineId);

                const groupSelect = document.getElementById('groupTm');
                groupSelect.innerHTML = updatedGroups
                    .map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`)
                    .join('');
            });
        } catch(error){
            console.log("Error en añadir grupos y tecs: ", error);
        }
    }

    if(modBtn) {
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);
        const teams = await getTeamsByDiscipline(ids);

        try {
            const optionsPromises = teams.map(async (team) => {
                let teamName = team.nombre;

                if(!teamName) {                                        
                    const result = await getTecCityByID(team.tecsid);      
                    teamName = result.ciudad;                    
                }
                return `<option value="${team.id_equipo}">${teamName}</option>`;
            });

            const optionsHTML = (await Promise.all(optionsPromises)).join('');

            container.innerHTML = `
                <div class="modify">
                    <p>SELECCIONE EL EQUIPO A MODIFICAR</p>                
                    <select class="input selector m" id="teamS">
                        ${optionsHTML}
                    </select>
                </div>

                <button class="btns" id="select">SELECCIONAR</button> 
            `;
            document.getElementById('select').addEventListener('click', SelectTeam);
        } catch(error) {
            console.log('Error', error);
        }
    }

    if(searBtn) {
        try {
            let category = document.getElementById('categoria')?.value;
            if(!category) category = 'Femenil';

            const discipline = await getDisciplineId(category.toLowerCase());
            const groups = await getGroupsByDiscID(discipline);
            const tecs = await getTecs();

            container.innerHTML = `
                <div class="category srcTeam">
                    <div class="modify srcTeam">
                        <p class="title">EQUIPO QUE DESEA BUSCAR</p>
                        <input class="input selector srcTeam" id="name" type="text" placeholder="Opcional">
                    </div>           
                            
                    <div class="modify srcTeam">
                        <p class="title">SELECCIONE SU CATEGORÍA</p>      
                        <select class="input selector srcTeam" id="categoria">
                            <option value="Femenil">Femenil</option>
                            <option value="Varonil">Varonil</option>
                        </select>
                    </div>
                </div> 

                <div class="category srcTeam">
                        <div class="modify srcTeam">
                            <p class="title">SELECCIONE SU GRUPO</p>
                            <select class="input selector srcTeam" id="groupTm">
                                ${groups.map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`).join('')}
                            </select>
                        </div>

                        <div class="modify srcTeam">
                            <p class="title">SELECCIONE EL TEC</p>
                            <select class="input selector srcTeam" id="tecTm">
                                ${tecs.map(tec => `<option value="${tec.id_tecs}">${tec.nombre}</option>`).join('')}
                            </select>
                        </div>
                </div>

                <button class="btns srcTeam" id="search">BUSCAR</button>
            `;

            document.getElementById('search').addEventListener('click', SearchTeam);

            document.getElementById('categoria').addEventListener('change', async (e) => {
                console.log("Escuchando cambio en categoría");
                const selectedCategory = e.target.value;
                const disciplineId = await getDisciplineId(selectedCategory.toLowerCase());
                const updatedGroups = await getGroupsByDiscID(disciplineId);

                const groupSelect = document.getElementById('groupTm');
                groupSelect.innerHTML = updatedGroups
                    .map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`)
                    .join('');
            });
        } catch(error){
            console.log("Error en añadir grupos y tecs: ", error);
        }
    }

    if(delBtn) {
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);
        const teams = await getTeamsByDiscipline(ids);

        try {
            const optionsPromises = teams.map(async (team) => {
                let teamName = team.nombre;

                if(!teamName) {                                        
                    const result = await getTecCityByID(team.tecsid);      
                    teamName = result.ciudad;                    
                }
                return `<option value="${team.id_equipo}">${teamName}</option>`;
            });

            const optionsHTML = (await Promise.all(optionsPromises)).join('');

            container.innerHTML = `
                <div class="modify">
                    <p>SELECCIONE EL EQUIPO A ELIMINAR</p>                
                    <select class="input selector m" id="teamS">
                        ${optionsHTML}
                    </select>
                </div>

                <button class="btns" id="delete">ELIMINAR</button> 
            `;
            document.getElementById('delete').addEventListener('click', DeleteTeam);
        } catch(error) {
            console.log('Error', error);
        }
    }
}

async function SubOptionJ(e) {
    const container = document.querySelector('.info');
    const addBtn = e.target.closest('.opt.Add');
    const modBtn = e.target.closest('.opt.Mod');
    const searBtn = e.target.closest('.opt.Sear');
    const delBtn = e.target.closest('.opt.Del');

    if(addBtn) {
        let category = document.getElementById('categoria')?.value;
        if(!category) category = 'Femenil';

        const discipline = await getDisciplineId(category.toLowerCase());
        const teamsList = await getTeamsByDiscID(discipline);

        try {
            const optionsPromises = teamsList.map(async (team) => {
                let teamName = team.nombre;

                if(!teamName) {                                        
                    const result = await getTecCityByID(team.tecsid);      
                    teamName = result.ciudad;                    
                }
                return `<option value="${team.id_equipo}">${teamName}</option>`;
            });

            const optionsHTML = (await Promise.all(optionsPromises)).join('');

            container.innerHTML = `
                <div class="input-box play">           
                    <p class="title">NOMBRE</p>         
                    <input class="input play" id="name" type="text">                                               
                </div> 

                <div class="category team play">
                    <div class="teamOpt">
                        <p class="title">CATEGORIA</p>
                        <select class="input selector play" id="categoria">
                            <option value="Femenil">Femenil</option>
                            <option value="Varonil">Varonil</option>
                        </select>
                    </div>           
                            
                    <div class="teamOpt">
                        <p class="title">EQUIPO</p>      
                        <select class="input selector play" id="equipo">
                            ${optionsHTML}
                        </select>
                    </div>
                </div>
                
                <div class="category team play">
                    <div class="teamOpt">
                        <p class="title">NUMERO</p>
                        <input class="input selector play" id="number" type="text">
                    </div>           
                            
                    <div class="teamOpt">
                        <p class="title">POSICION</p>      
                        <input class="input selector play" id="position" type="text">
                    </div>
                </div>   

                <button class="btns play" id="save">SUBIR FOTO</button>
            `;
            
            // document.getElementById('select').addEventListener('click', SelectTeam);

            document.getElementById('categoria').addEventListener('change', async (e) => {
                const selectedCategory = e.target.value;
                const disciplineId = await getDisciplineId(selectedCategory.toLowerCase());
                const updatedTeams = await getTeamsByDiscID(disciplineId);

                const optionsPromises = updatedTeams.map(async (team) => {
                    let teamName = team.nombre;

                    if (!teamName) {
                        const result = await getTecCityByID(team.tecsid);
                        teamName = result.ciudad;
                    }

                    return `<option value="${team.id_equipo}">${teamName}</option>`;
                });
                const optionsHTML = (await Promise.all(optionsPromises)).join('');

                const teamSelect = document.getElementById('equipo');
                teamSelect.innerHTML = optionsHTML;
            });
        } catch(error) {
            console.log('Error', error);
        }
    }

    if(modBtn) {
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);

        const teamsList = await getTeamsByDiscipline(ids);
        const idsT = teamsList.map(t => t.id_equipo);

        const players = await getPlayersByTeams(idsT);

        container.innerHTML = `
            <div class="modify">
                <p>SELECCIONE EL JUGADOR A MODIFICAR</p>                
                <select class="input selector m" id="playerS">
                    ${players.map(player => `<option value="${player.id_jugador}">${player.nombre}</option>`).join('')}
                </select>
            </div>

            <button class="btns" id="select">SELECCIONAR</button> 
        `;

        //document.getElementById('select').addEventListener('click');
    }

    if(delBtn) {
        const disciplineList = await getDisciplineByName();
        const ids = disciplineList.map(d => d.id_diciplinas);

        const teamsList = await getTeamsByDiscipline(ids);
        const idsT = teamsList.map(t => t.id_equipo);

        const players = await getPlayersByTeams(idsT);

        container.innerHTML = `
            <div class="modify">
                <p>SELECCIONE EL JUGADOR A ELIMINAR</p>                
                <select class="input selector m" id="playerS">
                    ${players.map(player => `<option value="${player.id_jugador}">${player.nombre}</option>`).join('')}
                </select>
            </div>

            <button class="btns" id="delete">ELIMINAR</button> 
        `;

        //document.getElementById('delete').addEventListener('click');
    }
}

/* ========================================== OPCIONES ========================================== */
async function NewGroup() {
    const groupName = document.getElementById('name').value.trim();
    const category = document.getElementById('categoria').value;
    const option = document.querySelector('.bttnNm p').textContent.trim();

    if(!groupName) {
        Toast('error', `Nuevo ${option}` + '\n' + '\n' + `Debe ingresar un nombre para el ${option.toLowerCase()}.`);
        return;
    }

    if (/\bgrupo\b/i.test(groupName)) {
        Toast('error', `Nuevo ${option}` + '\n' + '\n' + `Por favor, elimine la palabra ${option}.`);
        return;
    }

    const existingGroup = await getGroupByNC(groupName, category);
    if(existingGroup) {        
        Toast('error',`Nuevo ${option}` + '\n' + '\n' + `Este ${option.toLowerCase()} ya existe en la categoría.`);
        return;
    }

    try {
        const disciplinaId = await getDisciplineId(category.toLowerCase());
        const response = await createGroup({
            nombre: "Grupo " + groupName,
            disciplinaid: disciplinaId
        });

        if(response && response.id_grupo) {
            Toast('success', `Nuevo ${option}` + '\n' + '\n' + `${option} creado con éxito.`);
            document.getElementById('name').value = '';
        } else 
            Toast('error', `Nuevo ${option}` + '\n' + '\n' + `Error al crear el ${option.toLowerCase()}.`);
    } catch(error) {
        console.log('Error', error);
        Toast('error', `Nuevo ${option}` + '\n' + '\n' + 'Error de conexión con el servidor.');
    }
}

async function NewTeam() {
    const teamName = document.getElementById('name').value.trim();
    const category = document.getElementById('categoria').value;
    const group = document.getElementById('groupTm').value;
    const tec = document.getElementById('tecTm').value;
    const option = document.querySelector('.bttnNm p').textContent.trim();
    
    if (/\bequipo\b/i.test(teamName)) {
        Toast('error', `Nuevo ${option}` + '\n' + '\n' + `Por favor, elimine la palabra ${option}.`);
        return;
    }

    const existingTeam = await getExistingTeams(teamName, category, group, tec);
    if(existingTeam) {        
        Toast('error',`Nuevo ${option}` + '\n' + '\n' + `Este ${option.toLowerCase()} ya existe.`);
        return;
    }

    try {
        const disciplinaId = await getDisciplineId(category.toLowerCase());

        const response = await createTeam({
            nombre: teamName,
            diciplinaid: disciplinaId,
            grupoid: parseInt(group),
            tecsid: parseInt(tec)
        });

        if(response && response.id_equipo) {
            Toast('success', `Nuevo ${option}` + '\n' + '\n' + `${option} creado con éxito.`);
            document.getElementById('name').value = '';
        } else 
            Toast('error', `Nuevo ${option}` + '\n' + '\n' + `Error al crear el ${option.toLowerCase()}.`);

    } catch(error) {
        console.log('Error', error);
        Toast('error', `Nuevo ${option}` + '\n' + '\n' + 'Error de conexión con el servidor.');
    }
}

async function SelectGroup() {
    const groupSelected = document.getElementById('groupS').value;
    const container = document.querySelector('.info');

    try {
        const group = await getGroupByID(groupSelected);
        const discipline = await getDisciplineByID(group.disciplinaid);
        const groupName = group.nombre.replace(/^grupo\s+/i, '');

        container.innerHTML = `
            <div class="input-box">           
                <p class="title">GRUPO</p>         
                <input class="input" id="name" type="text" value="${groupName}">                                               
            </div> 

            <div class="category">
                <p class="title">CATEGORIA</p>      
                <select class="input selector" id="categoria">
                    <option value="femenil" ${discipline.categoria === 'Femenil' ? 'selected' : ''}>Femenil</option>
                    <option value="varonil" ${discipline.categoria === 'Varonil' ? 'selected' : ''}>Varonil</option>
                </select>
            </div>

            <div class="buttons">
                <button class="btns" id="modify">MODIFICAR</button> 
                <button class="btns" id="cancel">CANCELAR</button> 
            </div>
        `;

        document.getElementById('modify').addEventListener('click', () => ModifyGroup(groupSelected));
        document.getElementById('cancel').addEventListener('click', CancelGroup);
    } catch (error) {
        console.error('Error cargando grupo:', error);
    }
}

async function SelectTeam() {
    const teamSelected = document.getElementById('teamS').value;
    const container = document.querySelector('.info');

    try {
        const team = await getTeamByID(teamSelected);
        let category = document.getElementById('categoria')?.value;
        if(!category) category = 'Femenil';

        const discipline = await getDisciplineId(category.toLowerCase());
        const groups = await getGroupsByDiscID(discipline);
        const tecs = await getTecs();

        container.innerHTML = `
            <div class="category team">
                <div class="teamOpt">
                    <p class="title">NOMBRE</p>
                    <input class="input selector team" id="name" type="text" placeholder="Opcional" value="${team.nombre}">
                </div>           
                        
                <div class="teamOpt">
                    <p class="title">CATEGORIA</p>      
                    <select class="input selector team" id="categoria">
                        <option value="Femenil" ${discipline.categoria === 'Femenil' ? 'selected' : ''}>Femenil</option>
                        <option value="Varonil" ${discipline.categoria === 'Varonil' ? 'selected' : ''}>Varonil</option>
                    </select>
                </div>
            </div> 

            <div class="category team">
                <div class="teamOpt">
                    <p class="title">GRUPO</p>
                    <select class="input selector team" id="groupTm">
                        ${groups.map(group => `<option value="${group.id_grupo}" ${group.id_grupo === team.grupoid ? 'selected' : ''}>${group.nombre}</option>`).join('')}
                    </select>
                </div>

                <div class="teamOpt">
                    <p class="title">TEC</p>
                    <select class="input selector team" id="tecTm">
                        ${tecs.map(tec => `<option value="${tec.id_tecs}" ${tec.id_tecs === team.tecsid ? 'selected' : ''}>${tec.nombre}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="buttons">
                <button class="btns" id="modify">MODIFICAR</button> 
                <button class="btns" id="cancel">CANCELAR</button> 
            </div>
        `;

        document.getElementById('modify').addEventListener('click', () => ModifyTeam(teamSelected));
        document.getElementById('cancel').addEventListener('click', CancelTeam);

        document.getElementById('categoria').addEventListener('change', async (e) => {
            const selectedCategory = e.target.value;
            const disciplineId = await getDisciplineId(selectedCategory.toLowerCase());
            const updatedGroups = await getGroupsByDiscID(disciplineId);

            const groupSelect = document.getElementById('groupTm');
            groupSelect.innerHTML = updatedGroups
                .map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`)
                .join('');
        });
    } catch (error) {
        console.error('Error cargando equipo:', error);
    }
}

async function ModifyGroup(groupSelected) {
    const container = document.querySelector('.info');
    const option = document.querySelector('.bttnNm p').textContent.trim();

    const groupName = document.getElementById('name').value.trim();
    const category = document.getElementById('categoria').value;

    const originalGroup = await getGroupByID(groupSelected);
    const originalDiscipline = await getDisciplineByID(originalGroup.disciplinaid);
    const originalName = originalGroup.nombre.replace(/^grupo\s+/i, '');
    const originalCategory = originalDiscipline.categoria.toLowerCase();


    if(!groupName) {
        Toast('error', `Modificar ${option}` + '\n' + '\n' + `Debe ingresar un nombre para el ${option.toLowerCase()}.`);
        return;
    }

    if (/\bgrupo\b/i.test(groupName)) {
        Toast('error', `Modificar ${option}` + '\n' + '\n' + `Por favor, elimine la palabra ${option}.`);
        return;
    }

    if (groupName === originalName && category === originalCategory) {
        Toast('error', `Modificar ${option}` + '\n' + '\n' + 'Presione Cancelar si no desea realizar cambios.');
        return;
    }

    try {
        const disciplinaId = await getDisciplineId(category);
        const response = await modifyGroup({
            nombre: "Grupo " + groupName,
            disciplinaid: disciplinaId
        }, groupSelected);

        if(response && response.id_grupo) {
            Toast('success', `Modificar ${option}` + '\n' + '\n' + `${option} modificado con éxito.`);

            const disciplineList = await getDisciplineByName();
            const ids = disciplineList.map(d => d.id_diciplinas);
            const groups = await getGroupsByDiscipline(ids);

            // Genera las opciones
            container.innerHTML = `
                <div class="modify">
                    <p>SELECCIONA GRUPO A MODIFICAR</p>                
                    <select class="input selector m" id="groupS">
                        ${groups.map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`).join('')}
                    </select>
                </div>

                <button class="btns" id="select">SELECCIONAR</button> 
            `;
            document.getElementById('select').addEventListener('click', SelectGroup);
        } else 
            Toast('error', `Modificar ${option}` + '\n' + '\n' + `Error al modificar el ${option.toLowerCase()}.`);
    } catch(error) {
        console.log('Error', error);
        Toast('error', `Modificar ${option}` + '\n' + '\n' + 'Error de conexión con el servidor.');
    }
}

async function ModifyTeam(teamSelected) {
    const container = document.querySelector('.info');
    const option = document.querySelector('.bttnNm p').textContent.trim();    

    const teamName = document.getElementById('name').value.trim();
    const category = document.getElementById('categoria').value;
    const group = document.getElementById('groupTm').value;
    const tec = document.getElementById('tecTm').value;

    const originalTeam = await getTeamByID(teamSelected);
    const originalDiscipline = await getDisciplineByID(originalTeam.diciplinaid);
    const originalName = originalTeam.nombre;
    const originalCategory = originalDiscipline.categoria;
    const originalGroup = originalTeam.grupoid;
    const originalTec = originalTeam.tecsid;

    if (/\bequipo\b/i.test(teamName)) {
        Toast('error', `Nuevo ${option}` + '\n' + '\n' + `Por favor, elimine la palabra ${option}.`);
        return;
    }

    if (teamName === originalName && category === originalCategory && group == originalGroup && tec == originalTec) {
        Toast('error', `Modificar ${option}` + '\n' + '\n' + 'Presione Cancelar si no desea realizar cambios.');
        return;
    }

    try {
        const disciplinaId = await getDisciplineId(category.toLowerCase());

        const response = await modifyTeam({
            nombre: teamName,
            diciplinaid: disciplinaId,
            grupoid: parseInt(group),
            tecsid: parseInt(tec)
        }, teamSelected);

        console.log(response);

        if(response && response.id_equipo) {
            Toast('success', `Modificar ${option}` + '\n' + '\n' + `${option} modificado con éxito.`);

            const disciplineList = await getDisciplineByName();
            const ids = disciplineList.map(d => d.id_diciplinas);
            const teams = await getTeamsByDiscipline(ids);

            try {
                const optionsPromises = teams.map(async (team) => {
                    let teamName = team.nombre;

                    if(!teamName) {                                        
                        const result = await getTecCityByID(team.tecsid);      
                        teamName = result.ciudad;                    
                    }
                    return `<option value="${team.id_equipo}">${teamName}</option>`;
                });

                const optionsHTML = (await Promise.all(optionsPromises)).join('');

                container.innerHTML = `
                    <div class="modify">
                        <p>SELECCIONE EL EQUIPO A MODIFICAR</p>                
                        <select class="input selector m" id="teamS">
                            ${optionsHTML}
                        </select>
                    </div>

                    <button class="btns" id="select">SELECCIONAR</button> 
                `;
                document.getElementById('select').addEventListener('click', SelectTeam);
            } catch(error) {
                console.log('Error', error);
            }
        } else 
            Toast('error', `Modificar ${option}` + '\n' + '\n' + `Error al modificar el ${option.toLowerCase()}.`);
    } catch(error) {
        console.log('Error', error);
        Toast('error', `Modificar ${option}` + '\n' + '\n' + 'Error de conexión con el servidor.');
    }
}

async function CancelGroup() {
    const container = document.querySelector('.info');
    const disciplineList = await getDisciplineByName();
    const ids = disciplineList.map(d => d.id_diciplinas);
    const groups = await getGroupsByDiscipline(ids);

        container.innerHTML = `
            <div class="modify">
                <p>SELECCIONE EL GRUPO A MODIFICAR</p>                
                <select class="input selector m" id="groupS">
                    ${groups.map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`).join('')}
                </select>
            </div>

            <button class="btns" id="select">SELECCIONAR</button> 
        `;

        document.getElementById('select').addEventListener('click', SelectGroup);
}

async function CancelTeam() {
    const container = document.querySelector('.info');
    const disciplineList = await getDisciplineByName();
    const ids = disciplineList.map(d => d.id_diciplinas);
    const teams = await getTeamsByDiscipline(ids);

    try {
        const optionsPromises = teams.map(async (team) => {
            let teamName = team.nombre;

            if(!teamName) {                                        
                const result = await getTecCityByID(team.tecsid);      
                teamName = result.ciudad;                    
            }
            return `<option value="${team.id_equipo}">${teamName}</option>`;
        });

        const optionsHTML = (await Promise.all(optionsPromises)).join('');

        container.innerHTML = `
            <div class="modify">
                <p>SELECCIONE EL EQUIPO A MODIFICAR</p>                
                <select class="input selector m" id="teamS">
                    ${optionsHTML}
                </select>
            </div>

            <button class="btns" id="select">SELECCIONAR</button> 
        `;
        document.getElementById('select').addEventListener('click', SelectTeam);
    } catch(error) {
        console.log('Error', error);
    }
}

async function SearchGroup() {
    const container = document.querySelector('.info');
    const option = document.querySelector('.bttnNm p').textContent.trim();
    const groupName = document.getElementById('name').value.trim();
    const category = document.getElementById('categoria').value;

    if(!groupName) {
        Toast('error', `Modificar ${option}` + '\n' + '\n' + `Debe ingresar un nombre para el ${option.toLowerCase()}.`);
        return;
    }

    if (/\bgrupo\b/i.test(groupName)) {
        Toast('error', `Modificar ${option}` + '\n' + '\n' + `Por favor, elimine la palabra ${option}.`);
        return;
    }

    const existingGroup = await getGroupByNC(groupName, category);
    if(existingGroup === null) {        
        Toast('error',`Modificar ${option}` + '\n' + '\n' + `El ${option.toLowerCase()} ${groupName} no existe en la categoría.`);
        return;
    }

    try {
        const discipline = await getDisciplineByID(existingGroup.disciplinaid);

        container.innerHTML = `
            <div class="input-box">           
                <p class="title bold">GRUPO:</p>      
                <p class="title">${groupName}</p>   
            </div> 

            <div class="category">
                <p class="title bold">CATEGORIA:</p>
                <p class="title">${discipline.categoria}</p>      
            </div>

            <button class="btns" id="return">REGRESAR</button> 
        `;

        document.getElementById('return').addEventListener('click', ReturnGroup);
    } catch (error) {
        console.error('Error cargando grupo:', error);
    }
}

async function SearchTeam() {
    const container = document.querySelector('.info');
    const option = document.querySelector('.bttnNm p').textContent.trim();
    const teamName = document.getElementById('name').value.trim();
    const category = document.getElementById('categoria').value;
    const group = document.getElementById('groupTm').value;
    const tec = document.getElementById('tecTm').value;

    if (/\bequipo\b/i.test(teamName)) {
        Toast('error', `Modificar ${option}` + '\n' + '\n' + `Por favor, elimine la palabra ${option}.`);
        return;
    }

    const existingTeam = await getExistingTeams(teamName, category, group, tec);
    if(existingTeam == null) {        
        Toast('error',`Modificar ${option}` + '\n' + '\n' + `Este ${option.toLowerCase()} no existe.`);
        return;
    }

    try {
        const groupName = await getGroupByID(group);
        const tecName = await getTecCityByID(tec);

        container.innerHTML = `
            <div class="category team src">
                <div class="teamOpt">
                    <p class="title bold">NOMBRE:</p>
                    <p class="title">${teamName}</p>
                </div>           
                        
                <div class="teamOpt">
                    <p class="title bold">CATEGORIA:</p>      
                    <p class="title">${category}</p>
                </div>
            </div> 

            <div class="category team src">
                <div class="teamOpt">
                    <p class="title bold">GRUPO:</p>
                    <p class="title">${groupName.nombre}</p>
                </div>

                <div class="teamOpt">
                    <p class="title bold">TEC:</p>
                    <p class="title">${tecName.nombre}</p>
                </div>
            </div>

            <button class="btns teamSrc" id="return">REGRESAR</button>
        `;            

        document.getElementById('return').addEventListener('click', ReturnTeam);
    } catch (error) {
        console.error('Error cargando grupo:', error);
    }
}

async function ReturnGroup() {
    const container = document.querySelector('.info');

    container.innerHTML = `
            <div class="modify">           
                <p>ESCRIBA EL NOMBRE DEL GRUPO QUE DESEA BUSCAR</p>         
                <input class="input m" id="name" type="text">                                               
            </div> 

            <div class="modify">
                <p class="catSearch">SELECCIONE SU CATEGORÍA</p>      
                <select class="input selector m" id="categoria">
                    <option value="Femenil">Femenil</option>
                    <option value="Varonil">Varonil</option>
                </select>
            </div>

            <button class="btns" id="search">BUSCAR</button> 
        `;
        document.getElementById('search').addEventListener('click', SearchGroup);
}

async function ReturnTeam() {
    const container = document.querySelector('.info');

    try {
        let category = document.getElementById('categoria')?.value;
        if(!category) category = 'Femenil';

        const discipline = await getDisciplineId(category.toLowerCase());
        const groups = await getGroupsByDiscID(discipline);
        const tecs = await getTecs();

        container.innerHTML = `
            <div class="category srcTeam">
                <div class="modify srcTeam">
                    <p class="title">EQUIPO QUE DESEA BUSCAR</p>
                    <input class="input selector srcTeam" id="name" type="text" placeholder="Opcional">
                </div>           
                            
                <div class="modify srcTeam">
                    <p class="title">SELECCIONE SU CATEGORÍA</p>      
                    <select class="input selector srcTeam" id="categoria">
                        <option value="Femenil">Femenil</option>
                        <option value="Varonil">Varonil</option>
                    </select>
                </div>
            </div> 

            <div class="category srcTeam">
                <div class="modify srcTeam">
                    <p class="title">SELECCIONE SU GRUPO</p>
                    <select class="input selector srcTeam" id="groupTm">
                        ${groups.map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`).join('')}
                    </select>
                </div>

                <div class="modify srcTeam">
                    <p class="title">SELECCIONE EL TEC</p>
                    <select class="input selector srcTeam" id="tecTm">
                        ${tecs.map(tec => `<option value="${tec.id_tecs}">${tec.nombre}</option>`).join('')}
                    </select>
                </div>
            </div>

            <button class="btns srcTeam" id="search">BUSCAR</button>
            `;

            document.getElementById('search').addEventListener('click', SearchTeam);

            document.getElementById('categoria').addEventListener('change', async (e) => {
                console.log("Escuchando cambio en categoría");
                const selectedCategory = e.target.value;
                const disciplineId = await getDisciplineId(selectedCategory.toLowerCase());
                const updatedGroups = await getGroupsByDiscID(disciplineId);

                const groupSelect = document.getElementById('groupTm');
                groupSelect.innerHTML = updatedGroups
                    .map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`)
                    .join('');
            });
        } catch(error){
            console.log("Error en añadir grupos y tecs: ", error);
        }
}

async function DeleteGroup() {
    const groupSelected = document.getElementById('groupS').value;
    const option = document.querySelector('.bttnNm p').textContent.trim();
    const container = document.querySelector('.info');

    try {
        const response = await deleteGroup(groupSelected);

        if(response && response.id_grupo) {
            Toast('success', `Eliminar ${option}` + '\n' + '\n' + `${option} eliminado con éxito.`);

            const disciplineList = await getDisciplineByName();
            const ids = disciplineList.map(d => d.id_diciplinas);
            const groups = await getGroupsByDiscipline(ids);

            container.innerHTML = `
                <div class="modify">
                    <p>SELECCIONE EL GRUPO A ELIMINAR</p>                
                    <select class="input selector m" id="groupS">
                        ${groups.map(group => `<option value="${group.id_grupo}">${group.nombre}</option>`).join('')}
                    </select>
                </div>

                <button class="btns" id="delete">ELIMINAR</button> 
            `;

            document.getElementById('delete').addEventListener('click', DeleteGroup);
        } else 
            Toast('error', `Eliminar ${option}` + '\n' + '\n' + `Error al eliminar el ${option.toLowerCase()}.`);
    } catch(error) {
        console.log('Error', error);
        Toast('error', `Eliminar ${option}` + '\n' + '\n' + 'Error de conexión con el servidor.');
    }
}

async function DeleteTeam() {
    const teamSelected = document.getElementById('teamS').value;
    const option = document.querySelector('.bttnNm p').textContent.trim();
    const container = document.querySelector('.info');

    try {
        const response = await deleteTeam(teamSelected);

        if(response && response.id_equipo) {
            Toast('success', `Eliminar ${option}` + '\n' + '\n' + `${option} eliminado con éxito.`);

            const disciplineList = await getDisciplineByName();
            const ids = disciplineList.map(d => d.id_diciplinas);
            const teams = await getTeamsByDiscipline(ids);

            const optionsPromises = teams.map(async (team) => {
                let teamName = team.nombre;

                if(!teamName) {                                        
                    const result = await getTecCityByID(team.tecsid);      
                    teamName = result.ciudad;                    
                }
                return `<option value="${team.id_equipo}">${teamName}</option>`;
            });

            const optionsHTML = (await Promise.all(optionsPromises)).join('');

            container.innerHTML = `
                <div class="modify">
                    <p>SELECCIONE EL EQUIPO A ELIMINAR</p>                
                    <select class="input selector m" id="teamS">
                        ${optionsHTML}
                    </select>
                </div>

                <button class="btns" id="delete">ELIMINAR</button> 
            `;
            document.getElementById('delete').addEventListener('click', DeleteTeam);
        } else 
            Toast('error', `Eliminar ${option}` + '\n' + '\n' + `Error al eliminar el ${option.toLowerCase()}.`);
    } catch(error) {
        console.log('Error', error);
        Toast('error', `Eliminar ${option}` + '\n' + '\n' + 'Error de conexión con el servidor.');
    }
}

/* ========================================== API ========================================== */
// DISCIPLINAS
async function getDisciplineByID(ID) {
    try {        
        const disciplines = await fetchDisciplines();

        return disciplines.find(d => d.id_diciplinas === ID);
    } catch (error) {
        console.error('Error obteniendo disciplina:', error);
        return null;
    }
}

async function getDisciplineId(category) {
    try {
        const disciplines = await fetchDisciplines();

        const discipline = disciplines.find(d => 
            d.nombre === disciplineName && 
            d.categoria.toLowerCase() === category
        );

        return discipline?.id_diciplinas || null;        
    } catch (error) {
        console.error('Error obteniendo disciplina:', error);
        return null;
    }
}

async function getDisciplineByName() {
    try {
        const disciplines = await fetchDisciplines();

        return disciplines.filter(d => d.nombre === disciplineName );
    } catch (error) {
        console.error('Error obteniendo disciplinas:', error);
        return null;
    }
}

// GRUPOS
async function getGroupByID(ID) {
    try {
        const grupos = await fetchGroups();

        return grupos.find(g => g.id_grupo == ID);       // == por si ID es un string 
    } catch(error) {
        console.error('Error obteniendo grupos:', error);
        return null;
    }
}

async function getGroupsByDiscID(ID) {
    try {
        const grupos = await fetchGroups();

        return grupos.filter(g => g.disciplinaid == ID);       // == por si ID es un string 
    } catch(error) {
        console.error('Error obteniendo grupos:', error);
        return null;
    }
}

async function getGroupsByDiscipline(ids) {
    try {
        const grupos = await fetchGroups();

        return grupos.filter(g => ids.includes(g.disciplinaid));
    } catch(error) {
        console.error('Error obteniendo grupos:', error);
        return null;
    }
}

async function getGroupByNC(name, category) {
    try {
        const [grupos, disciplines] = await Promise.all([
            fetchGroups(),
            fetchDisciplines()
        ]);

        // Buscar la disciplina correcta
        const disciplina = disciplines.find(d => {
            return d.nombre === disciplineName &&
                   d.categoria === category
        });
        if(!disciplina) return null;
        
        // Buscar el grupo en esa disciplina específica
        const nombreBuscado = `Grupo ${name}`;

        const grupo = grupos.find(g => 
            g.nombre === nombreBuscado &&
            g.disciplinaid === disciplina.id_diciplinas
        );

        return grupo || null;
    } catch(error) {
        console.error('Error obteniendo grupos:', error);
        return null;
    }
}

async function getGroupByName(name) {
    try {
        const grupos = await fetchGroups();
        const nombre = "Grupo " + name;

        return grupos.find(g => g.nombre == nombre) || "";
    } catch(error) {
        console.error('Error obteniendo grupos:', error);
        return null;
    }
}

// EQUIPOS
async function getTeamByID(ID) {
    try {
        const teams = await fetchTeams();

        return teams.find(t => t.id_equipo == ID);
    } catch(error) {
        console.error('Error obteniendo equipos:', error);
        return null;
    }
}

async function getTeamsByDiscID(ID) {
    try {
        const equipos = await fetchTeams();

        return equipos.filter(e => e.diciplinaid == ID); 
    } catch(error) {
        console.error('Error obteniendo equipos:', error);
        return null;
    }
}

async function getTeamsByDiscipline(ids) {
    try {
        const equipos = await fetchTeams();

        return equipos.filter(e => ids.includes(e.diciplinaid));
    } catch(error) {
        console.error('Error obteniendo equipos:', error);
        return null;
    }
}

async function getExistingTeams(name, category, groupID, tecID) {
    try {
        const [teams, disciplines] = await Promise.all([
            fetchTeams(),
            fetchDisciplines()
        ]);

        // Buscar la disciplina correcta
        const discipline = disciplines.find(d => {
            return d.nombre === disciplineName &&
                   d.categoria === category
        });
        if(!discipline) return null;
        
        // Buscar el equipo
        const team = teams.find(t => 
            t.nombre.toLowerCase() === name.toLowerCase() &&
            t.diciplinaid == discipline.id_diciplinas &&
            t.grupoid == groupID &&
            t.tecsid == tecID
        );

        return team || null;
    } catch(error) {
        console.error('Error obteniendo equipos:', error);
        return null;
    }
}

// TECS
async function getTecCityByID(ID) {
    try {
        const tecs = await fetchTecs();

        return tecs.find(t => t.id_tecs == ID);
    } catch(error) {
        console.error('Error obteniendo tecs:', error);
        return null;
    }
}

async function getTecs() {
    try {
        const tecs = await fetchTecs();
        return tecs;
    } catch(error) {
        console.error('Error obteniendo tecnologicos:', error);
        return [];
    }
}

// JUGADORES
async function getPlayersByTeams(ids) {
    try {
        const players = await fetchPlayers();

        return players.filter(p => ids.includes(p.equipoid));
    } catch(error) {
        console.error('Error obteniendo jugadores:', error);
        return null;
    }
}

/* ========================================== POST ========================================== */
async function createGroup(groupData) {
    try {
        const response = await fetch('http://localhost:3000/api/grupos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData)
        });

        return response.json();
    } catch(error) {
        console.error('Error en createGroupInDatabase:', error);
        return { 
            success: false, 
            message: 'Error de conexión con el servidor' 
        };
    }
}

async function createTeam(groupData) {
    try {
        const response = await fetch('http://localhost:3000/api/equipo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData)
        });

        return response.json();
    } catch(error) {
        console.error('Error en createTeamInDatabase:', error);
        return { 
            success: false, 
            message: 'Error de conexión con el servidor' 
        };
    }
}

async function modifyGroup(groupData, ID) {
    try {
        const response = await fetch(`http://localhost:3000/api/grupos/${ID}?`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData)
        });

        return response.json();
    } catch(error) {
        console.error('Error en modifyGroupInDatabase:', error);
        return { 
            success: false, 
            message: 'Error de conexión con el servidor' 
        };
    }
}

async function modifyTeam(groupData, ID) {
    try {
        const response = await fetch(`http://localhost:3000/api/equipo/${ID}?`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData)
        });

        return response.json();
    } catch(error) {
        console.error('Error en modifyTeamInDatabase:', error);
        return { 
            success: false, 
            message: 'Error de conexión con el servidor' 
        };
    }
}

async function deleteGroup(ID) {
    try {
        const response = await fetch(`http://localhost:3000/api/grupos/${ID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.json();
    } catch(error) {
        console.error('Error en deleteGroupInDatabase:', error);
        return { 
            success: false, 
            message: 'Error de conexión con el servidor' 
        };
    }
}

async function deleteTeam(ID) {
    try {
        const response = await fetch(`http://localhost:3000/api/equipo/${ID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return response.json();
    } catch(error) {
        console.error('Error en deleteTeamInDatabase:', error);
        return { 
            success: false, 
            message: 'Error de conexión con el servidor' 
        };
    }
}

/* ========================================== FETCH ========================================== */
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

async function fetchGroups() {
    try {
        const response = await fetch('http://localhost:3000/api/grupos');
        if(!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch(error) {
        console.error('Error obteniendo grupos: ', error);
        return [];
    } 
}

async function fetchTeams() {
    try {
        const response = await fetch('http://localhost:3000/api/equipo');
        if(!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch(error) {
        console.error('Error obteniendo equipos: ', error);
        return [];
    } 
}

async function fetchTecs() {
    try {
        const response = await fetch('http://localhost:3000/api/tecs');
        if(!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch(error) {
        console.error('Error obteniendo tecs: ', error);
        return [];
    } 
}

async function fetchPlayers() {
    try {
        const response = await fetch('http://localhost:3000/api/jugador');
        if(!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
    } catch(error) {
        console.error('Error obteniendo jugadores: ', error);
        return [];
    } 
}