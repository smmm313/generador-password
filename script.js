const history = [];

function generarContrasena() {
  const length = parseInt(document.getElementById("length").value);
  const useUpper = document.getElementById("uppercase").checked;
  const useLower = document.getElementById("lowercase").checked;
  const useNumbers = document.getElementById("numbers").checked;
  const useSymbols = document.getElementById("symbols").checked;

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "@#$%&*!";

  let caracteres = "";
  let requisitos = [];

  if (useUpper) {
    caracteres += upper;
    requisitos.push(() => upper[Math.floor(Math.random() * upper.length)]);
  }
  if (useLower) {
    caracteres += lower;
    requisitos.push(() => lower[Math.floor(Math.random() * lower.length)]);
  }
  if (useNumbers) {
    caracteres += numbers;
    requisitos.push(() => numbers[Math.floor(Math.random() * numbers.length)]);
  }
  if (useSymbols) {
    caracteres += symbols;
    requisitos.push(() => symbols[Math.floor(Math.random() * symbols.length)]);
  }

  if (caracteres.length === 0) {
    document.getElementById("warning").textContent = "⚠️ Seleccioná al menos un tipo de carácter.";
    return;
  } else {
    document.getElementById("warning").textContent = "";
  }

  if (length < requisitos.length) {
    document.getElementById("warning").textContent = `⚠️ La longitud mínima debe ser ${requisitos.length} para cumplir con los requisitos.`;
    return;
  }

  let contrasenaArray = requisitos.map(fn => fn());

  for (let i = contrasenaArray.length; i < length; i++) {
    contrasenaArray.push(caracteres[Math.floor(Math.random() * caracteres.length)]);
  }

  contrasenaArray = contrasenaArray.sort(() => Math.random() - 0.5);
  const contrasena = contrasenaArray.join("");

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

  const bar = document.getElementById("strengthBar");
  let color = "red";
  let width = "25%";

  if (fuerza >= 4) {
    color = "green";
    width = "100%";
  } else if (fuerza === 3) {
    color = "orange";
    width = "66%";
  } else if (fuerza === 2) {
    color = "gold";
    width = "40%";
  } else {
    color = "red";
    width = "25%";
  }

  bar.style.backgroundColor = color;
  bar.style.width = width;
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
