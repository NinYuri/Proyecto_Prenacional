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