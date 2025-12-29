/**
 * Convertidor PDF ⇄ Base64
 * Lógica para transformar archivos PDF a string Base64 y viceversa.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const pdfFileInput = document.getElementById("pdfFileInput");
  const pdfFileDropZone = document.getElementById("pdfFileDropZone");
  const pdfFileNameDisplay = document.getElementById("pdfFileName");
  const btnPdfToBase64 = document.getElementById("btnPdfToBase64");

  const pdfBase64Input = document.getElementById("pdfBase64Input");
  const btnBase64ToPdf = document.getElementById("btnBase64ToPdf");

  const pdfResultArea = document.getElementById("pdfResultArea");
  const pdfResultTitle = document.getElementById("pdfResultTitle");
  const pdfResultContent = document.getElementById("pdfResultContent"); // TextArea para el Base64
  const pdfPreviewContainer = document.getElementById("pdfPreviewContainer"); // Contenedor para el preview del PDF
  const btnCopyPdfResult = document.getElementById("btnCopyPdfResult");
  const btnDownloadPdfResult = document.getElementById("btnDownloadPdfResult");

  const tabPdfToB64 = document.getElementById("subtab-pdf-b64");
  const tabB64ToPdf = document.getElementById("subtab-b64-pdf");
  const formPdfToB64 = document.getElementById("form-pdf-b64");
  const formB64ToPdf = document.getElementById("form-b64-pdf");

  let currentPdfMode = "pdf2b64"; // 'pdf2b64' | 'b642pdf'
  let currentPdfResult = ""; // Contenido Base64 puro
  let currentPdfFilename = "documento.pdf";

  // --- Gestión de Sub-Pestañas ---
  window.switchPdfTab = function (mode) {
    currentPdfMode = mode;
    pdfResultArea.classList.add("hidden");

    if (mode === "pdf2b64") {
      tabPdfToB64.classList.replace("bg-slate-700", "bg-primary-600");
      tabPdfToB64.classList.replace("text-slate-300", "text-white");

      tabB64ToPdf.classList.replace("bg-primary-600", "bg-slate-700");
      tabB64ToPdf.classList.replace("text-white", "text-slate-300");

      formPdfToB64.classList.remove("hidden");
      formB64ToPdf.classList.add("hidden");
    } else {
      tabB64ToPdf.classList.replace("bg-slate-700", "bg-primary-600");
      tabB64ToPdf.classList.replace("text-slate-300", "text-white");

      tabPdfToB64.classList.replace("bg-primary-600", "bg-slate-700");
      tabPdfToB64.classList.replace("text-white", "text-slate-300");

      formB64ToPdf.classList.remove("hidden");
      formPdfToB64.classList.add("hidden");
    }
  };

  // --- PDF a Base64 ---

  pdfFileInput.addEventListener("change", handlePdfFileSelect);

  // Drag & Drop
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    pdfFileDropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach(() => {
    pdfFileDropZone.classList.add("border-primary-500", "bg-slate-800");
  });

  ["dragleave", "drop"].forEach(() => {
    pdfFileDropZone.classList.remove("border-primary-500", "bg-slate-800");
  });

  pdfFileDropZone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    pdfFileInput.files = files;
    handlePdfFileSelect();
  });

  function handlePdfFileSelect() {
    const file = pdfFileInput.files[0];
    if (file) {
      pdfFileNameDisplay.textContent = file.name;
      pdfFileNameDisplay.classList.remove("hidden");

      if (file.type && file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        ToastifyUtils.warning("Advertencia", "El archivo no parece ser un PDF válido");
      }
    } else {
      pdfFileNameDisplay.classList.add("hidden");
    }
  }

  btnPdfToBase64.addEventListener("click", () => {
    const file = pdfFileInput.files[0];
    if (!file) {
      ToastifyUtils.error("Error", "Selecciona un archivo PDF primero");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        // Obtenemos Base64 puro
        const base64String = e.target.result.split(",")[1];
        
        showPdfResult("Base64 Generado", base64String, file.name + ".txt", false);
        ToastifyUtils.success("Éxito", "PDF convertido a Base64");
      } catch (err) {
        console.error(err);
        ToastifyUtils.error("Error", "Falló la conversión del archivo");
      }
    };
    reader.onerror = function () {
      ToastifyUtils.error("Error", "No se pudo leer el archivo");
    };

    reader.readAsDataURL(file);
  });

  // --- Base64 a PDF ---

  btnBase64ToPdf.addEventListener("click", () => {
    let input = pdfBase64Input.value.trim();
    if (!input) {
      ToastifyUtils.warning("Atención", "Pega el contenido Base64");
      return;
    }
    
    // Limpieza básica por si el usuario pega data URI scheme
    if (input.includes(",")) {
        input = input.split(",")[1];
    }

    try {
      // Validar que sea Base64 válido intentando decodificar los primeros caracteres
      atob(input.substring(0, 100));

      showPdfResult("Vista Previa PDF", input, "documento.pdf", true);
      ToastifyUtils.success("Éxito", "PDF generado correctamente");
    } catch (e) {
      console.error(e);
      ToastifyUtils.error("Error", "El texto no es un Base64 válido");
    }
  });

  // --- Funciones Comunes ---

  function showPdfResult(title, content, filename, isPreviewMode) {
    pdfResultTitle.textContent = title;
    currentPdfResult = content;
    currentPdfFilename = filename;
    
    // Limpiar vista previa anterior
    pdfPreviewContainer.innerHTML = '';
    
    if (isPreviewMode) {
      // Mostrar Iframe con el PDF
      pdfResultContent.classList.add("hidden");
      pdfPreviewContainer.classList.remove("hidden");
      
      const objectUrl = `data:application/pdf;base64,${content}`;
      
      const embed = document.createElement("embed");
      embed.src = objectUrl;
      embed.type = "application/pdf";
      embed.width = "100%";
      embed.height = "500px";
      embed.className = "rounded-xl border border-slate-600";
      
      pdfPreviewContainer.appendChild(embed);
      
    } else {
      // Mostrar Text Area con el Base64
      pdfPreviewContainer.classList.add("hidden");
      pdfResultContent.classList.remove("hidden");
      pdfResultContent.value = content;
    }

    pdfResultArea.classList.remove("hidden");

    setTimeout(() => {
      pdfResultArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }

  btnCopyPdfResult.addEventListener("click", () => {
    if (currentPdfMode === 'b642pdf') {
       ToastifyUtils.info("Info", "En modo vista previa no hay texto para copiar.");
       return;
    }
    navigator.clipboard.writeText(currentPdfResult).then(() => {
      ToastifyUtils.success("Copiado", "Base64 copiado al portapapeles");
    });
  });

  btnDownloadPdfResult.addEventListener("click", () => {
    let blob;
    let finalFilename = currentPdfFilename;

    if (currentPdfMode === "pdf2b64") {
      // Descargar el string Base64 como .txt
      blob = new Blob([currentPdfResult], { type: "text/plain;charset=utf-8" });
    } else {
      // Descargar el PDF decodificado
      // Convertir base64 a array buffer
      const byteCharacters = atob(currentPdfResult);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: "application/pdf" });
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ToastifyUtils.success("Descarga", "Archivo descargado");
  });
});

