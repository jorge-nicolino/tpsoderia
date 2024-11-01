
document.addEventListener('DOMContentLoaded', function() {
    const signUp = document.getElementById("sigUp"); 
    const signIn = document.getElementById("sigIn");
    const nameInput = document.getElementById("nameInput");
    const title = document.getElementById("title");
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    signIn.onclick = function() {
        window.location.href = '../jogani/html/index.html';
    };

    signUp.onclick = function() {
        nameInput.style.maxHeight = "60px"; 
        title.innerHTML = "Registro";
        signUp.classList.remove("disable");
        signIn.classList.add("disable");
    };

    //Ocultar contraseña
    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});
