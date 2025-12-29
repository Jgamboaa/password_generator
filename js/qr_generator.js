document.addEventListener("DOMContentLoaded", function () {
  const qrForm = document.getElementById("qrGeneratorForm");
  const qrTextInput = document.getElementById("qrText");
  const qrSizeSlider = document.getElementById("qrSize");
  const qrSizeValue = document.getElementById("qrSizeValue");
  const qrResult = document.getElementById("qrResult");
  const qrCodeDiv = document.getElementById("qrcode");
  const downloadButton = document.getElementById("downloadQrButton");

  let qrCodeInstance = null;

  // Actualizar valor visual del slider
  qrSizeSlider.addEventListener("input", function () {
    qrSizeValue.textContent = this.value;
  });

  // Generar QR
  qrForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = qrTextInput.value.trim();
    const size = parseInt(qrSizeSlider.value);

    if (!text) {
      ToastifyUtils.warning("Campo vacío", "Ingresa texto o URL para el QR");
      return;
    }

    generateQR(text, size);
  });

  function generateQR(text, size) {
    try {
      qrCodeDiv.innerHTML = "";
      
      // Ajuste visual: el contenedor del QR debe adaptarse
      qrCodeDiv.style.width = size + "px";
      qrCodeDiv.style.height = size + "px";
      qrCodeDiv.style.margin = "0 auto";

      qrCodeInstance = new QRCode(qrCodeDiv, {
        text: text,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      // Mostrar sección de resultado con animación
      qrResult.classList.remove("hidden");
      
      // Scroll suave
      setTimeout(() => {
        qrResult.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);

      ToastifyUtils.success("¡Listo!", "Código QR generado correctamente");

    } catch (error) {
      console.error(error);
      ToastifyUtils.error("Error", "No se pudo generar el QR");
    }
  }

  // Descargar QR
  downloadButton.addEventListener("click", function () {
    if (!qrCodeDiv.querySelector("img") && !qrCodeDiv.querySelector("canvas")) {
      ToastifyUtils.warning("Atención", "Genera un QR primero");
      return;
    }

    // Notificación de proceso
    const loadingToast = ToastifyUtils.show({
      variant: "loading",
      title: "Procesando...",
      message: "Generando imagen de alta calidad",
      toastify: { duration: 0 } // No cerrar automáticamente hasta que terminemos
    });

    // Pequeño delay para permitir que el UI se actualice
    setTimeout(() => {
      // El div que contiene el QR (puede ser canvas o img generado por la librería)
      // La librería qrcodejs a veces genera un canvas y luego lo oculta para poner img, o viceversa.
      // html2canvas funciona bien sobre el contenedor.
      
      // Aseguramos fondo blanco para la descarga
      const originalBg = qrCodeDiv.style.backgroundColor;
      qrCodeDiv.style.backgroundColor = "white"; 
      qrCodeDiv.style.padding = "20px"; // Margen blanco alrededor

      html2canvas(qrCodeDiv, {
        backgroundColor: "#ffffff",
        scale: 2, // Alta resolución
        useCORS: true,
        logging: false
      })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Limpiar toast de carga y mostrar éxito
        loadingToast.dismiss();
        ToastifyUtils.success("Descarga iniciada", "Imagen guardada como PNG");
      })
      .catch((error) => {
        console.error(error);
        loadingToast.dismiss();
        ToastifyUtils.error("Error", "Falló la descarga de la imagen");
      })
      .finally(() => {
        // Restaurar estilos
        qrCodeDiv.style.backgroundColor = originalBg;
        qrCodeDiv.style.padding = "0";
      });
    }, 500);
  });
});
