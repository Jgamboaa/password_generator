/**
 * Generador de Contraseñas Seguras
 * Versión actualizada con Tailwind y ToastifyUtils
 */

document.addEventListener("DOMContentLoaded", function () {
  const passwordOutput = document.getElementById("passwordOutput");
  const passwordLength = document.getElementById("passwordLength");
  const lengthValue = document.getElementById("lengthValue");
  const includeUppercase = document.getElementById("includeUppercase");
  const includeLowercase = document.getElementById("includeLowercase");
  const includeNumbers = document.getElementById("includeNumbers");
  const includeSymbols = document.getElementById("includeSymbols");
  const generateButton = document.getElementById("generateButton");
  const copyButton = document.getElementById("copyButton");
  const passwordForm = document.getElementById("passwordGeneratorForm");
  const passwordHelpBlock = document.getElementById("passwordHelpBlock");

  // Actualizar slider
  passwordLength.addEventListener("input", function () {
    lengthValue.textContent = this.value;
  });

  // Generar contraseña
  passwordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const options = {
      length: parseInt(passwordLength.value),
      uppercase: includeUppercase.checked,
      lowercase: includeLowercase.checked,
      numbers: includeNumbers.checked,
      symbols: includeSymbols.checked,
    };

    try {
      const password = generatePassword(options);
      passwordOutput.value = password;
      copyButton.disabled = false;

      // Evaluar fortaleza
      evaluatePasswordStrength(password);

      // Notificación discreta
      ToastifyUtils.success("Generada", "Nueva contraseña lista", {
        duration: 2000,
        position: "bottom-center" 
      });

    } catch (error) {
      ToastifyUtils.error("Error", error.message);
    }
  });

  // Copiar al portapapeles
  copyButton.addEventListener("click", function () {
    navigator.clipboard
      .writeText(passwordOutput.value)
      .then(function () {
        ToastifyUtils.success("¡Copiado!", "Contraseña en el portapapeles");
      })
      .catch(function (err) {
        ToastifyUtils.error("Error", "No se pudo copiar: " + err);
      });
  });

  // Función interna para evaluar fortaleza y actualizar UI con Tailwind
  function evaluatePasswordStrength(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);
    const length = password.length;

    let score = 0;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumbers) score++;
    if (hasSymbols) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;

    // Elementos UI del indicador (el span de color y el texto)
    const dot = passwordHelpBlock.querySelector('span');
    
    // Resetear clases de color
    dot.className = "w-2 h-2 rounded-full transition-colors duration-300";
    passwordHelpBlock.className = "text-sm mt-2 flex items-center gap-2 transition-colors duration-300";

    let text = "";
    let colorClass = "";
    let textClass = "";

    if (score <= 2) {
      colorClass = "bg-red-500";
      textClass = "text-red-400";
      text = "Débil";
    } else if (score <= 4) {
      colorClass = "bg-yellow-500";
      textClass = "text-yellow-400";
      text = "Moderada";
    } else if (score <= 5) {
      colorClass = "bg-green-500";
      textClass = "text-green-400";
      text = "Fuerte";
    } else {
      colorClass = "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]";
      textClass = "text-emerald-400";
      text = "Muy Segura";
    }

    dot.classList.add(...colorClass.split(" "));
    passwordHelpBlock.classList.add(...textClass.split(" "));
    
    // Actualizar texto preservando el span
    passwordHelpBlock.innerHTML = `<span class="${dot.className}"></span> Fortaleza: ${text}`;
  }
});

/* Lógica de generación (sin cambios mayores, solo utilidades) */
function generatePassword(options) {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
    throw new Error("Selecciona al menos un tipo de caracter.");
  }

  let availableChars = "";
  if (options.uppercase) availableChars += uppercaseChars;
  if (options.lowercase) availableChars += lowercaseChars;
  if (options.numbers) availableChars += numberChars;
  if (options.symbols) availableChars += symbolChars;

  let password = ensureCharacterPresence(options, uppercaseChars, lowercaseChars, numberChars, symbolChars);

  while (password.length < options.length) {
    const randomIndex = secureMathRandom() * availableChars.length;
    password += availableChars.charAt(Math.floor(randomIndex));
  }

  return shuffleString(password);
}

function ensureCharacterPresence(options, up, low, num, sym) {
  let result = "";
  if (options.uppercase) result += up.charAt(Math.floor(secureMathRandom() * up.length));
  if (options.lowercase) result += low.charAt(Math.floor(secureMathRandom() * low.length));
  if (options.numbers) result += num.charAt(Math.floor(secureMathRandom() * num.length));
  if (options.symbols) result += sym.charAt(Math.floor(secureMathRandom() * sym.length));
  return result;
}

function shuffleString(text) {
  const array = text.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(secureMathRandom() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

function secureMathRandom() {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (Math.pow(2, 32) - 1);
  }
  return Math.random();
}
