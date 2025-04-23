/* ========================================== VARIABLES ========================================== */
// Visibilidad de contraseña
const passwordFields = [
    { input: document.getElementById("pass"), icon: document.querySelector("#icon-lock-login") },
    { input: document.getElementById("pass-regis"), icon: document.querySelector("#icon-lock-register") },
    { input: document.getElementById("confpass"), icon: document.querySelector("#icon-lock-conf") }
];

// Movimiento login - registro
const btnRegister = document.querySelector("#register-link");
const container = document.querySelector(".container");
const containerRegister = document.querySelector(".container-register");
const btnregUsu = document.querySelector("#btn-registro");

// Variables de validación register y login form 
const userLogin = document.getElementById("user");
const passLogin = document.getElementById("pass");

/* ========================================== MÉTODOS ========================================== */
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

// Animación Carta, primera vuelta
btnRegister.addEventListener('click', () => {
        container.classList.remove('back')
        container.classList.toggle('active');
        containerRegister.style.animation = 'appear 1s both';
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