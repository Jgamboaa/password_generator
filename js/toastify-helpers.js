/**
 * Toast Helpers - Estilo React Hot Toast (sin librerías externas)
 *
 * - Réplica visual y animaciones cercanas a react-hot-toast.
 * - API compatible con el helper previo (success, error, warning, info, show).
 * - No requiere Toastify ni CSS adicional; inyecta su propio CSS ligero.
 *
 * Uso:
 *   ToastifyUtils.success("Éxito", "Se guardó correctamente");
 *   ToastifyUtils.error("Error", "No se pudo guardar");
 *   ToastifyUtils.show({ variant: "info", title: "Hola", message: "..." });
 *
 * Opciones soportadas (backward compatible con `toastify`):
 *   - toastify.duration: duración en ms (por defecto 4000). Con 0 no se cierra.
 *   - toastify.onClick: callback al hacer click en el toast.
 *   - toastify.style: estilos inline extra para el contenedor del toast.
 */

const ToastifyUtils = (() => {
  const STYLE_ID = "hot-toast-styles";
  const DEFAULT_FONT = "'Inter', system-ui, -apple-system, sans-serif";

  let defaults = {
    duration: 4000,
    style: {},
  };

  const ICONS = {
    success: `
      <div class="hot-toast-icon hot-toast-icon-success">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    `,
    error: `
      <div class="hot-toast-icon hot-toast-icon-error">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    `,
    warning: `
      <div class="hot-toast-icon hot-toast-icon-warning">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v6" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 17h.01" />
        </svg>
      </div>
    `,
    info: `
      <div class="hot-toast-icon hot-toast-icon-info">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V12" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8h.01" />
        </svg>
      </div>
    `,
    loading: `
      <div class="hot-toast-icon hot-toast-icon-loading"></div>
    `,
  };

  const injectStyles = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes hot-toast-enter {
        0% { transform: translate3d(0, -200%, 0) scale(.6); opacity: .5; }
        100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
      }
      @keyframes hot-toast-exit {
        0% { transform: translate3d(0, 0, -1px) scale(1); opacity: 1; }
        100% { transform: translate3d(0, -150%, -1px) scale(.6); opacity: 0; }
      }
      @keyframes hot-toast-pop {
        0% { transform: scale(.6); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .hot-toast-container {
        position: fixed;
        top: 65px;
        left: 0;
        right: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        pointer-events: none;
      }
      .hot-toast {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        background: #ffffff;
        color: #363636;
        border-radius: 4px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1), 0 3px 3px rgba(0,0,0,0.05);
        max-width: 420px;
        font-family: ${DEFAULT_FONT};
        font-size: 14px;
        font-weight: 500;
        line-height: 1.2;
        animation: hot-toast-enter 0.35s cubic-bezier(.21,1.02,.73,1) forwards;
      }
      .hot-toast.exit {
        animation: hot-toast-exit 0.4s forwards cubic-bezier(.06,.71,.55,1);
      }
      .hot-toast-icon {
        width: 20px;
        height: 20px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: hot-toast-pop 0.4s ease-out;
        flex-shrink: 0;
      }
      .hot-toast-icon svg { width: 14px; height: 14px; color: #fff; }
      .hot-toast-icon-success { background: #22c55e; }
      .hot-toast-icon-error { background: #ef4444; }
      .hot-toast-icon-warning { background: #eab308; }
      .hot-toast-icon-info { background: #3b82f6; }
      .hot-toast-icon-loading {
        width: 20px;
        height: 20px;
        border-radius: 999px;
        border: 2px solid #e5e7eb;
        border-top-color: #4b5563;
        animation: hot-toast-spin 0.8s linear infinite, hot-toast-pop 0.4s ease-out;
        box-sizing: border-box;
      }
      @keyframes hot-toast-spin {
        to { transform: rotate(360deg); }
      }
      .hot-toast-body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }
      .hot-toast-title { font-weight: 600; font-size: 14px; color: #111827; }
      .hot-toast-message { font-size: 12px; color: #6b7280; }
      /* Dark mode (AdminLTE agrega body.dark-mode) */
      body.dark-mode .hot-toast {
        background: #333;
        color: #e5e7eb;
        box-shadow: 0 8px 30px rgba(0,0,0,0.35), 0 4px 10px rgba(0,0,0,0.25);
      }
      body.dark-mode .hot-toast-title { color: #f3f4f6; }
      body.dark-mode .hot-toast-message { color: #9ca3af; }
      body.dark-mode .hot-toast-icon-loading {
        border-color: #374151;
        border-top-color: #e5e7eb;
      }
    `;
    document.head.appendChild(style);
  };

  const getContainer = () => {
    let container = document.querySelector(".hot-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "hot-toast-container";
      document.body.appendChild(container);
    }
    return container;
  };

  const normalizeVariant = (variant) => {
    const v = String(variant || "info").toLowerCase();
    return ["success", "error", "warning", "info", "loading"].includes(v)
      ? v
      : "info";
  };

  const buildHtml = ({ variant, title, message, withIcon, html }) => {
    if (typeof html === "string") return html;

    const v = normalizeVariant(variant);
    const safeTitle =
      title !== undefined && title !== null && String(title).trim() !== ""
        ? String(title)
        : v.charAt(0).toUpperCase() + v.slice(1);
    const safeMessage =
      message !== undefined && message !== null ? String(message) : "";

    const icon = withIcon ? ICONS[v] || "" : "";
    const msgHtml = safeMessage
      ? `<span class="hot-toast-message">${safeMessage}</span>`
      : "";

    return `
      ${icon}
      <div class="hot-toast-body">
        <span class="hot-toast-title">${safeTitle}</span>
        ${msgHtml}
      </div>
    `;
  };

  const show = (opts = {}) => {
    injectStyles();
    const container = getContainer();

    const {
      variant = "info",
      title,
      message,
      withIcon = true,
      html,
      toastify = {},
    } = opts;

    const v = normalizeVariant(variant);
    const el = document.createElement("div");
    el.className = "hot-toast";
    el.innerHTML = buildHtml({ variant: v, title, message, withIcon, html });

    const duration =
      typeof toastify.duration === "number"
        ? toastify.duration
        : defaults.duration;

    const style = { ...defaults.style, ...toastify.style };
    Object.assign(el.style, style);

    if (typeof toastify.onClick === "function") {
      el.addEventListener("click", (ev) => toastify.onClick(ev, el));
    }

    const dismiss = () => {
      if (el.classList.contains("exit")) return;
      el.classList.add("exit");
      el.addEventListener(
        "animationend",
        () => {
          if (el.parentElement) el.parentElement.removeChild(el);
        },
        { once: true }
      );
    };

    if (v !== "loading" && duration !== 0) {
      setTimeout(dismiss, Math.max(500, duration || defaults.duration));
    }

    container.appendChild(el);
    return { dismiss };
  };

  const setDefaults = (nextDefaults = {}) => {
    defaults = {
      ...defaults,
      ...nextDefaults,
      style: { ...defaults.style, ...nextDefaults.style },
    };
  };

  const getDefaults = () => ({
    ...defaults,
    style: { ...defaults.style },
  });

  const success = (title, message = "", toastify = {}) =>
    show({ variant: "success", title, message, toastify });
  const error = (title, message = "", toastify = {}) =>
    show({ variant: "error", title, message, toastify });
  const warning = (title, message = "", toastify = {}) =>
    show({ variant: "warning", title, message, toastify });
  const info = (title, message = "", toastify = {}) =>
    show({ variant: "info", title, message, toastify });

  return {
    show,
    success,
    error,
    warning,
    info,
    setDefaults,
    getDefaults,
  };
})();

// Exponer globalmente
window.ToastifyUtils = ToastifyUtils;
