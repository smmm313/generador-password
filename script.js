const history = [];

function generarContrasena() {
  const length = document.getElementById("length").value;
  const useUpper = document.getElementById("uppercase").checked;
  const useLower = document.getElementById("lowercase").checked;
  const useNumbers = document.getElementById("numbers").checked;
  const useSymbols = document.getElementById("symbols").checked;

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "@#$%&*!";

  let caracteres = "";
  if (useUpper) caracteres += upper;
  if (useLower) caracteres += lower;
  if (useNumbers) caracteres += numbers;
  if (useSymbols) caracteres += symbols;

  if (caracteres.length === 0) {
    document.getElementById("warning").textContent = "⚠️ Seleccioná al menos un tipo de carácter.";
    return;
  } else {
    document.getElementById("warning").textContent = "";
  }

  let contrasena = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * caracteres.length);
    contrasena += caracteres.charAt(index);
  }

  document.getElementById("password").value = contrasena;
  evaluarFuerza(contrasena);
  agregarAHistorial(contrasena);
}

function copiarContrasena() {
  const pw = document.getElementById("password");
  pw.select();
  document.execCommand("copy");
  alert("Contraseña copiada al portapapeles");
}

function evaluarFuerza(pw) {
  let fuerza = 0;
  if (pw.length >= 8) fuerza++;
  if (/[A-Z]/.test(pw)) fuerza++;
  if (/[a-z]/.test(pw)) fuerza++;
  if (/[0-9]/.test(pw)) fuerza++;
  if (/[@#$%&*!]/.test(pw)) fuerza++;

  let nivel = "Débil";
  if (fuerza >= 4) nivel = "Fuerte";
  else if (fuerza >= 3) nivel = "Media";

  document.getElementById("strength").textContent = "Fuerza: " + nivel;
}

function agregarAHistorial(pw) {
  history.push(pw);
  const div = document.getElementById("history");
  div.innerHTML = history.map(p => `• ${p}`).reverse().join("<br>");
}

function descargarContrasena() {
  const pw = document.getElementById("password").value;
  if (!pw) {
    alert("Primero generá una contraseña.");
    return;
  }
  const fecha = new Date().toISOString().replace(/[:.]/g, "-");
  const blob = new Blob([pw], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `contrasena-${fecha}.txt`;
  link.click();
}

document.getElementById("length").addEventListener("input", function () {
  document.getElementById("lengthValue").textContent = this.value;
});

document.querySelectorAll(".options input[type=checkbox]").forEach(cb => {
  cb.addEventListener("change", () => {
    const anyChecked = [...document.querySelectorAll(".options input[type=checkbox]")]
      .some(cb => cb.checked);
    document.getElementById("warning").textContent = anyChecked ? "" : "⚠️ Seleccioná al menos un tipo de carácter.";
  });
});
