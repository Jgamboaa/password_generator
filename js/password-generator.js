/**
 * Generador de Contraseñas Seguras
 * Este script proporciona funcionalidad para generar contraseñas aleatorias y seguras
 * con opciones personalizables para incluir diferentes tipos de caracteres.
 *
 * @author Isaí Gamboa
 * @version 1.0.0
 */

// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM
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

  /**
   * Actualiza el valor mostrado de la longitud de la contraseña
   */
  passwordLength.addEventListener("input", function () {
    lengthValue.textContent = this.value;
  });

  /**
   * Maneja el envío del formulario para generar una nueva contraseña
   */
  passwordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtiene las opciones de generación
    const options = {
      length: parseInt(passwordLength.value),
      uppercase: includeUppercase.checked,
      lowercase: includeLowercase.checked,
      numbers: includeNumbers.checked,
      symbols: includeSymbols.checked,
    };
    try {
      // Genera y muestra la contraseña
      const password = generatePassword(options);
      passwordOutput.value = password;

      // Habilita el botón de copia
      copyButton.disabled = false;

      // Evalúa y muestra la fortaleza de la contraseña
      const passwordStrength = evaluatePasswordStrength(password);

      // Muestra notificación de éxito con SweetAlert2
      Swal.fire({
        icon: "success",
        title: "¡Contraseña Generada!",
        text:
          "Se ha generado una nueva contraseña " +
          passwordStrength.toLowerCase(),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      // Usa SweetAlert2 para mostrar errores
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  });
  /**
   * Maneja el clic en el botón de copiar
   */
  copyButton.addEventListener("click", function () {
    navigator.clipboard
      .writeText(passwordOutput.value)
      .then(function () {
        window.getSelection().removeAllRanges();
        Swal.fire({
          icon: "success",
          title: "¡Copiado!",
          text: "Contraseña copiada al portapapeles",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#198754",
          color: "#ffffff",
          iconColor: "#ffffff",
        });
      })
      .catch(function (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo copiar: " + err,
        });
      });
  });
});

/**
 * Genera una contraseña aleatoria basada en las opciones proporcionadas
 *
 * @param {Object} options - Opciones de configuración
 * @param {number} options.length - Longitud de la contraseña
 * @param {boolean} options.uppercase - Incluir mayúsculas
 * @param {boolean} options.lowercase - Incluir minúsculas
 * @param {boolean} options.numbers - Incluir números
 * @param {boolean} options.symbols - Incluir símbolos
 * @returns {string} - La contraseña generada
 * @throws {Error} - Si no se selecciona ningún tipo de caracter
 */
function generatePassword(options) {
  // Conjuntos de caracteres
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Verifica que al menos un tipo de caracter esté seleccionado
  if (
    !options.uppercase &&
    !options.lowercase &&
    !options.numbers &&
    !options.symbols
  ) {
    throw new Error("Selecciona al menos un tipo de caracter.");
  }

  // Construye el conjunto de caracteres disponibles
  let availableChars = "";
  if (options.uppercase) availableChars += uppercaseChars;
  if (options.lowercase) availableChars += lowercaseChars;
  if (options.numbers) availableChars += numberChars;
  if (options.symbols) availableChars += symbolChars;

  // Asegura que al menos un carácter de cada tipo seleccionado estará presente
  let password = ensureCharacterPresence(
    options,
    uppercaseChars,
    lowercaseChars,
    numberChars,
    symbolChars
  );

  // Completa la contraseña hasta la longitud deseada
  while (password.length < options.length) {
    const randomIndex = secureMathRandom() * availableChars.length;
    password += availableChars.charAt(Math.floor(randomIndex));
  }

  // Mezcla los caracteres para mayor aleatoriedad
  return shuffleString(password);
}

/**
 * Asegura que al menos un carácter de cada tipo seleccionado esté presente
 *
 * @param {Object} options - Opciones de generación
 * @param {string} uppercaseChars - Conjunto de caracteres mayúsculas
 * @param {string} lowercaseChars - Conjunto de caracteres minúsculas
 * @param {string} numberChars - Conjunto de caracteres numéricos
 * @param {string} symbolChars - Conjunto de caracteres símbolos
 * @returns {string} - Cadena inicial con al menos un caracter de cada tipo
 */
function ensureCharacterPresence(
  options,
  uppercaseChars,
  lowercaseChars,
  numberChars,
  symbolChars
) {
  let result = "";

  // Añade un carácter de cada tipo seleccionado
  if (options.uppercase) {
    result += uppercaseChars.charAt(
      Math.floor(secureMathRandom() * uppercaseChars.length)
    );
  }

  if (options.lowercase) {
    result += lowercaseChars.charAt(
      Math.floor(secureMathRandom() * lowercaseChars.length)
    );
  }

  if (options.numbers) {
    result += numberChars.charAt(
      Math.floor(secureMathRandom() * numberChars.length)
    );
  }

  if (options.symbols) {
    result += symbolChars.charAt(
      Math.floor(secureMathRandom() * symbolChars.length)
    );
  }

  return result;
}

/**
 * Mezcla una cadena de caracteres de forma aleatoria
 *
 * @param {string} text - La cadena a mezclar
 * @returns {string} - La cadena mezclada
 */
function shuffleString(text) {
  const array = text.split("");

  // Algoritmo Fisher-Yates para mezclar
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(secureMathRandom() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Intercambia elementos
  }

  return array.join("");
}

/**
 * Proporciona un número aleatorio más seguro que Math.random()
 *
 * @returns {number} - Número aleatorio entre 0 y 1
 */
function secureMathRandom() {
  // Utiliza crypto.getRandomValues cuando está disponible
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (Math.pow(2, 32) - 1);
  } else {
    // Fallback a Math.random() si crypto no está disponible
    return Math.random();
  }
}

/**
 * Evalúa y visualiza la fortaleza de la contraseña
 *
 * @param {string} password - La contraseña a evaluar
 */
function evaluatePasswordStrength(password) {
  // Criterios de evaluación
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  const length = password.length;

  // Puntuación basada en criterios
  let score = 0;
  if (hasUppercase) score += 1;
  if (hasLowercase) score += 1;
  if (hasNumbers) score += 1;
  if (hasSymbols) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;

  // Busca o crea el elemento indicador de fortaleza
  let strengthIndicator = document.getElementById("passwordStrength");
  if (!strengthIndicator) {
    strengthIndicator = document.createElement("div");
    strengthIndicator.id = "passwordStrength";
    strengthIndicator.className = "password-strength";

    // Inserta después del campo de contraseña
    const helpBlock = document.getElementById("passwordHelpBlock");
    helpBlock.parentNode.insertBefore(strengthIndicator, helpBlock);
  }
  // Actualiza la clase según la puntuación
  strengthIndicator.className = "password-strength";
  let strengthText = "";

  if (score <= 2) {
    strengthIndicator.classList.add("strength-weak");
    strengthText = "débil. Intenta añadir más tipos de caracteres.";
    document.getElementById("passwordHelpBlock").textContent =
      "Contraseña " + strengthText;
  } else if (score <= 4) {
    strengthIndicator.classList.add("strength-medium");
    strengthText = "moderada. Considera hacerla más larga.";
    document.getElementById("passwordHelpBlock").textContent =
      "Contraseña " + strengthText;
  } else if (score <= 5) {
    strengthIndicator.classList.add("strength-strong");
    strengthText = "fuerte.";
    document.getElementById("passwordHelpBlock").textContent =
      "Contraseña " + strengthText;
  } else {
    strengthIndicator.classList.add("strength-very-strong");
    strengthText = "muy fuerte. ¡Excelente!";
    document.getElementById("passwordHelpBlock").textContent =
      "Contraseña " + strengthText;
  }

  // Devuelve el texto de fortaleza para usar en notificaciones
  return strengthText;
}
