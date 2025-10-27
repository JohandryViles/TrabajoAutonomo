// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const eyeOff = document.getElementById("eyeOff");
const eye = document.getElementById("eye");

togglePassword.addEventListener("click", function () {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  if (type === "text") {
    eyeOff.style.display = "none";
    eye.style.display = "block";
  } else {
    eyeOff.style.display = "block";
    eye.style.display = "none";
  }
});

// Handle form submission
const loginForm = document.getElementById("loginForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Show loading state
  submitBtn.disabled = true;
  btnText.innerHTML =
    '<div class="spinner"></div><span>Iniciando sesión...</span>';

  // Simulate login process
  setTimeout(function () {
    console.log("Login attempt:", { email, password });
    alert("Inicio de sesión simulado para: " + email);

    // Reset button state
    submitBtn.disabled = false;
    btnText.textContent = "Iniciar Sesión";

    // Here you would handle the actual login logic
    window.location.href = 'lanpag.html';
  }, 1500);
});

// Google login button
const googleBtn = document.getElementById("googleBtn");
googleBtn.addEventListener("click", function () {
  console.log("Google login clicked");
  alert("Funcionalidad de Google login");
});

// Forgot password button
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
forgotPasswordBtn.addEventListener("click", function () {
  console.log("Forgot password clicked");
  alert("Funcionalidad de recuperar contraseña");
});

// Sign up link
const signupLink = document.getElementById("signupLink");
signupLink.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Sign up clicked");
  alert("Redirigir a página de registro");
});
