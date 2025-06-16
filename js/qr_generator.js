document.addEventListener("DOMContentLoaded", function () {
  const qrForm = document.getElementById("qrGeneratorForm");
  const qrTextInput = document.getElementById("qrText");
  const qrSizeSlider = document.getElementById("qrSize");
  const qrSizeValue = document.getElementById("qrSizeValue");
  const qrResult = document.getElementById("qrResult");
  const qrCodeDiv = document.getElementById("qrcode");
  const downloadButton = document.getElementById("downloadQrButton");

  let qrCodeInstance = null;

  // Actualizar valor del tamaño del QR
  qrSizeSlider.addEventListener("input", function () {
    qrSizeValue.textContent = this.value;
  });

  // Generar código QR
  qrForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = qrTextInput.value.trim();
    const size = parseInt(qrSizeSlider.value);

    if (!text) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor ingresa el texto o URL para generar el código QR.",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    generateQR(text, size);
  });

  // Función para generar el código QR
  function generateQR(text, size) {
    try {
      // Limpiar QR anterior
      qrCodeDiv.innerHTML = "";

      // Crear nuevo código QR
      qrCodeInstance = new QRCode(qrCodeDiv, {
        text: text,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      // Mostrar resultado
      qrResult.style.display = "block";

      // Scroll suave hacia el resultado
      qrResult.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });

      Swal.fire({
        icon: "success",
        title: "¡Código QR generado!",
        text: "Tu código QR ha sido creado exitosamente.",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error generando QR:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al generar el código QR. Inténtalo de nuevo.",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }

  // Descargar código QR como imagen
  downloadButton.addEventListener("click", function () {
    if (!qrCodeInstance) {
      Swal.fire({
        icon: "warning",
        title: "No hay código QR",
        text: "Primero genera un código QR antes de descargarlo.",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    // Mostrar loading
    Swal.fire({
      title: "Preparando descarga...",
      text: "Generando imagen del código QR",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Usar html2canvas para capturar el QR
    html2canvas(qrCodeDiv, {
      backgroundColor: "#ffffff",
      scale: 2, // Mejor calidad
      useCORS: true,
    })
      .then((canvas) => {
        // Crear enlace de descarga
        const link = document.createElement("a");
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");

        // Simular click para descargar
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cerrar loading y mostrar éxito
        Swal.fire({
          icon: "success",
          title: "¡Descarga iniciada!",
          text: "El código QR se ha descargado como imagen PNG.",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      })
      .catch((error) => {
        console.error("Error en descarga:", error);
        Swal.fire({
          icon: "error",
          title: "Error en descarga",
          text: "No se pudo descargar la imagen. Inténtalo de nuevo.",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      });
  });
});
