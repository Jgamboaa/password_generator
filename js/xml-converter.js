/**
 * Convertidor XML ⇄ Base64
 * Lógica para transformar archivos XML a string Base64 y viceversa.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const xmlFileInput = document.getElementById("xmlFileInput");
  const xmlFileDropZone = document.getElementById("xmlFileDropZone");
  const fileNameDisplay = document.getElementById("xmlFileName");
  const btnXmlToBase64 = document.getElementById("btnXmlToBase64");

  const base64Input = document.getElementById("base64Input");
  const btnBase64ToXml = document.getElementById("btnBase64ToXml");

  const resultArea = document.getElementById("xmlResultArea");
  const resultTitle = document.getElementById("xmlResultTitle");
  const resultContent = document.getElementById("xmlResultContent");
  const btnCopyResult = document.getElementById("btnCopyXmlResult");
  const btnDownloadResult = document.getElementById("btnDownloadXmlResult");

  const tabXmlToB64 = document.getElementById("subtab-xml-b64");
  const tabB64ToXml = document.getElementById("subtab-b64-xml");
  const formXmlToB64 = document.getElementById("form-xml-b64");
  const formB64ToXml = document.getElementById("form-b64-xml");

  let currentMode = "xml2b64"; // 'xml2b64' | 'b642xml'
  let currentResult = "";
  let currentFilename = "convertido";

  // --- Gestión de Sub-Pestañas ---
  window.switchXmlTab = function (mode) {
    currentMode = mode;
    resultArea.classList.add("hidden"); // Ocultar resultados previos

    if (mode === "xml2b64") {
      tabXmlToB64.classList.replace("bg-slate-700", "bg-primary-600");
      tabXmlToB64.classList.replace("text-slate-300", "text-white");

      tabB64ToXml.classList.replace("bg-primary-600", "bg-slate-700");
      tabB64ToXml.classList.replace("text-white", "text-slate-300");

      formXmlToB64.classList.remove("hidden");
      formB64ToXml.classList.add("hidden");
    } else {
      tabB64ToXml.classList.replace("bg-slate-700", "bg-primary-600");
      tabB64ToXml.classList.replace("text-slate-300", "text-white");

      tabXmlToB64.classList.replace("bg-primary-600", "bg-slate-700");
      tabXmlToB64.classList.replace("text-white", "text-slate-300");

      formB64ToXml.classList.remove("hidden");
      formXmlToB64.classList.add("hidden");
    }
  };

  // --- XML a Base64 ---

  // Manejo de archivo seleccionado
  xmlFileInput.addEventListener("change", handleFileSelect);

  // Drag & Drop
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    xmlFileDropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach(() => {
    xmlFileDropZone.classList.add("border-primary-500", "bg-slate-800");
  });

  ["dragleave", "drop"].forEach(() => {
    xmlFileDropZone.classList.remove("border-primary-500", "bg-slate-800");
  });

  xmlFileDropZone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    xmlFileInput.files = files;
    handleFileSelect();
  });

  function handleFileSelect() {
    const file = xmlFileInput.files[0];
    if (file) {
      fileNameDisplay.textContent = file.name;
      fileNameDisplay.classList.remove("hidden");
      // Validación básica de tipo (opcional, ya que a veces los XML no tienen mime correcto)
      if (
        file.type &&
        !file.type.includes("xml") &&
        !file.name.endsWith(".xml")
      ) {
        ToastifyUtils.warning(
          "Advertencia",
          "El archivo no parece ser un XML válido"
        );
      }
    } else {
      fileNameDisplay.classList.add("hidden");
    }
  }

  // Convertir XML -> Base64
  btnXmlToBase64.addEventListener("click", () => {
    const file = xmlFileInput.files[0];
    if (!file) {
      ToastifyUtils.error("Error", "Selecciona un archivo XML primero");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        // readAsDataURL retorna "data:text/xml;base64,....."
        // Obtenemos solo la parte base64 después de la coma
        const base64String = e.target.result.split(",")[1];

        showResult("Base64 Generado", base64String, file.name + ".txt");
        ToastifyUtils.success("Éxito", "Archivo convertido a Base64");
      } catch (err) {
        console.error(err);
        ToastifyUtils.error("Error", "Falló la lectura del archivo");
      }
    };
    reader.onerror = function () {
      ToastifyUtils.error("Error", "No se pudo leer el archivo");
    };

    // Usamos readAsDataURL para que el navegador maneje la codificación a base64
    reader.readAsDataURL(file);
  });

  // --- Base64 a XML ---

  btnBase64ToXml.addEventListener("click", () => {
    const input = base64Input.value.trim();
    if (!input) {
      ToastifyUtils.warning("Atención", "Pega el contenido Base64");
      return;
    }

    try {
      // Decodificar Base64 (Manejo de caracteres UTF-8)
      const binaryString = atob(input);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decoder = new TextDecoder("utf-8");
      const xmlString = decoder.decode(bytes);

      // Validar si es XML válido
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");
      if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        ToastifyUtils.warning(
          "Cuidado",
          "El resultado no parece un XML válido, pero se decodificó."
        );
      }

      showResult("XML Decodificado", xmlString, "convertido.xml");
      ToastifyUtils.success("Éxito", "Base64 decodificado correctamente");
    } catch (e) {
      console.error(e);
      ToastifyUtils.error("Error", "El texto no es un Base64 válido");
    }
  });

  // --- Funciones Comunes ---

  function showResult(title, content, filename) {
    resultTitle.textContent = title;
    resultContent.value = content;
    currentResult = content;
    currentFilename = filename;
    resultArea.classList.remove("hidden");

    // Scroll al resultado
    setTimeout(() => {
      resultArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }

  btnCopyResult.addEventListener("click", () => {
    navigator.clipboard.writeText(currentResult).then(() => {
      ToastifyUtils.success("Copiado", "Contenido en el portapapeles");
    });
  });

  btnDownloadResult.addEventListener("click", () => {
    const blob = new Blob([currentResult], {
      type: "text/plain;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = currentFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ToastifyUtils.success("Descarga", "Archivo descargado");
  });
});
