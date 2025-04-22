// Variables de usuarios
var cliente = 'Estefania Lopez';
var clpassword = 'Oceano12/';
var admin = 'Susana Sandoval';
var adpassword = 'Susana09%';

// Variables de visibilidad de contraseña
const passwordFields = [
    { input: document.getElementById("pass"), icon: document.querySelector("#icon-lock-login") },
    { input: document.getElementById("pass-regis"), icon: document.querySelector("#icon-lock-register") },
    { input: document.getElementById("confpass"), icon: document.querySelector("#icon-lock-conf") }
];

// Variables de movimiento login - registro
const btnRegister = document.querySelector("#register-link");
const container = document.querySelector(".container");
const containerRegister = document.querySelector(".container-register");
const btnregUsu = document.querySelector("#btn-registro");

// Variables de validación register y login form 
const loginForm = document.getElementById("login-form");
const userLogin = document.getElementById("user");
const passLogin = document.getElementById("pass");
const usuario = document.getElementById("user-regis");
const telefono = document.getElementById("telefono");
const genero = document.getElementById("gender");
const edad = document.getElementById("edad");
const contra = document.getElementById("pass-regis");
const confContra = document.getElementById("confpass");
const registerForm = document.getElementById("register-form");

// Variables de almacenamiento de datos
var nombreUsuario = "";
var passwordUsuario = "";
var telefonoUsuario = "";
var generoUsuario = "";
var edadUsuario = "";

// Validación de los input para animación
function InputValidacion(inputElement) {
    inputElement.addEventListener("input", () => {
        if (inputElement.value.trim() !== "") {
            inputElement.classList.add("valid");
        } else {
            inputElement.classList.remove("valid");
        }
    });
}

InputValidacion(userLogin);
InputValidacion(passLogin);
InputValidacion(usuario);
InputValidacion(telefono);
InputValidacion(genero);
InputValidacion(edad);
InputValidacion(contra);
InputValidacion(confContra);

// Visibilidad de contraseñas
passwordFields.forEach(({ input, icon }) => {
    icon.addEventListener("click", () => {
        if (input.type === "password") {
            input.type = "text";
            icon.innerHTML = '<ion-icon name="lock-open"></ion-icon>';
        } else {
            input.type = "password";
            icon.innerHTML = '<ion-icon name="lock-closed"></ion-icon>';
        }
    });
});

// Animación Carta, primera vuelta
btnRegister.addEventListener('click', () => {
        container.classList.remove('back')
        container.classList.toggle('active');
        containerRegister.style.animation = 'appear 1s both';
});

// Validaciones
registerForm.addEventListener('submit', e=>{
    e.preventDefault();
    let numeros = /^[0-9]+$/;
    if(usuario.value.length === 0 || usuario.value.trim() === '')
        Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'Debes escribir un nombre de usuario');
    else   
        if(usuario.value.length < 8 || usuario.value.length > 20)
            Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'Debes escribir un nombre de usuario mayor a 8 caracteres y menor a 20.');
        else
            if(telefono.value.length === 0)
                Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'Debes escribir un número de teléfono.');
            else
                if(!numeros.test(telefono.value))
                    Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'El número de teléfono debe contener sólo números.');
                else
                    if(telefono.value.length != 10)
                        Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'El número de teléfono no cumple con la longitud requerida.');
                    else
                        if(genero.value.length === 0)
                            Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'Debes escribir un género.');
                        else
                            if(genero.value !== 'Femenino' && genero.value !== 'Masculino')
                                Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'El género ' + genero.value + ' no es una opción válida. Escribe Femenino o Masculino.');
                            else
                                if(edad.value.length === 0)
                                    Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'Debes escribir una edad.');
                            else
                                if(!numeros.test(edad.value))
                                    Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'La edad debe contener sólo números.');
                                else
                                    if(edad.value < 10 || edad.value > 90)
                                        Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'La edad ingresada no es válida.');
                                    else
                                        if(contra.value.length === 0)
                                            Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'Debes escribir una contraseña.');
                                        else
                                            if(Password(contra.value))
                                                if(confContra.value.length === 0)
                                                    Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'Debes confirmar tu contraseña');
                                                else
                                                    if(contra.value != confContra.value)
                                                        Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'Las contraseñas no coinciden.');
                                                    else
                                                    {
                                                        container.classList.remove('active');
                                                        container.classList.toggle('back');
                                                        containerRegister.style.animation = 'disappear 1s both';
                                                        
                                                        //Datos para MongoDB y SQL
                                                        nombreUsuario = usuario.value.trim();
                                                        passwordUsuario = contra.value.trim();
                                                        telefonoUsuario = telefono.value.trim();
                                                        generoUsuario = genero.value.trim();
                                                        edadUsuario = edad.value.trim();

                                                        
                                                        // Limpiar los campos
                                                        usuario.value = ''; 
                                                        // Si usuario.value = ''; borra el valor del campo de entrada, pero la clase valid todavía está presente, la animación CSS podría no funcionar.
                                                        usuario.classList.remove("valid"); // Elimina la clase valid de tenerla activa.
                                                        telefono.value = '';
                                                        telefono.classList.remove("valid");
                                                        genero.value = '';
                                                        genero.classList.remove("valid");
                                                        edad.value = '';
                                                        edad.classList.remove("valid");
                                                        contra.value = '';
                                                        contra.classList.remove("valid");                                                            
                                                        confContra.value = '';
                                                        confContra.classList.remove("valid");
                                                    }
});

loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    if(userLogin.value.length === 0 || userLogin.value.trim() === '')
        Toast('error', 'Bienvenido al Sistema' + '\n' + '\n' + 'Debes escribir un nombre de usuario.');
    else
        if(passLogin.value.length === 0)
            Toast('error', 'Bienvenido al Sistema' + '\n' + '\n' + 'Debes escribir una contraseña.');
        else
            if(userLogin.value !== cliente && userLogin.value !== admin && userLogin.value !== nombreUsuario)
                Toast('error', 'Bienvenido al Sistema' + '\n'  + '\n' + 'Debes escribir un nombre de usuario registrado.');
            else {
                var passwordToCheck;
                if (userLogin.value === cliente)
                    passwordToCheck = clpassword;
                else 
                    if (userLogin.value === admin)
                        passwordToCheck = adpassword;
                    else 
                        if(nombreUsuario.length !== 0)
                            if (userLogin.value === nombreUsuario)
                                passwordToCheck = passwordUsuario;

                if (passLogin.value !== passwordToCheck)
                    Toast('error', 'Bienvenido al Sistema' + '\n' + '\n' + 'Contraseña incorrecta.');
                else {
                    if (userLogin.value === cliente)
                        window.location.href = 'home.html';
                    else
                        if (userLogin.value === nombreUsuario)
                            window.location.href = 'home.html';
                        else
                            if(userLogin.value === admin)
                                window.location.href = 'Ahome.html';
                }
            }
});

function Password(contrasena){
    const Mayuscula = /[A-Z]/.test(contrasena);
    const Minuscula = /[a-z]/.test(contrasena);
    const Digito = /\d/.test(contrasena);
    const Caracter = /[@#$%&+/]/.test(contrasena);

    if(contrasena.length < 8 || contrasena.length > 20)
        Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'La contraseña debe tener una longitud de 8 a 20 caracteres.');
    else
        if(!Mayuscula)
            Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'La contraseña debe contener al menos una mayúscula.');
        else
            if(!Minuscula)
                Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'La contraseña debe contener letras minúsculas.');
            else
                if(!Digito)
                    Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'La contraseña debe contener por lo menos un número.');
                else
                    if(!Caracter)
                        Toast('error', 'Registro en el Sistema' + '\n' + '\n' + 'La contraseña debe contener por lo menos un caracter especial como @#$%&+/');
                    else
                        return true;
}

// Mensaje alerta error
function Toast(icon, titulo) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast'
      },
      showConfirmButton: false,
      timer: 2000,
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