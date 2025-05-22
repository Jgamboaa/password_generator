# Generador de Contraseñas Seguras

Este es un generador de contraseñas seguras implementado con HTML, CSS y JavaScript puro. La aplicación permite generar contraseñas aleatorias con diferentes opciones de personalización y evalúa la fortaleza de las contraseñas generadas.

## Características

- Interfaz de usuario intuitiva y responsiva utilizando Bootstrap 5
- Opciones para personalizar la contraseña:
  - Longitud ajustable (8-32 caracteres)
  - Inclusión/exclusión de mayúsculas, minúsculas, números y símbolos
- Evaluación visual de la fortaleza de la contraseña
- Función de copiado al portapapeles con notificación
- Diseño accesible con etiquetas ARIA y buen contraste de color

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5 (para componentes UI y responsividad)
- Bootstrap Icons

## Estructura del proyecto

```
password_generator/
│
├── index.html              # Archivo principal HTML
├── css/
│   └── styles.css          # Estilos personalizados
├── js/
│   └── password-generator.js # Lógica del generador
└── assets/                 # Carpeta para recursos adicionales
```

## Instalación

No requiere instalación especial. Solo necesitas clonar o descargar este repositorio:

```bash
git clone https://github.com/Jgamboaa/password_generator.git
cd password-generator
```

## Uso

1. Abre el archivo `index.html` en cualquier navegador web moderno
2. Ajusta las opciones de generación según tus preferencias:
   - Mueve el slider para seleccionar la longitud deseada
   - Marca/desmarca los checkboxes para incluir/excluir tipos de caracteres
3. Haz clic en "Generar Contraseña"
4. La contraseña generada aparecerá en el campo de texto
5. Haz clic en "Copiar" para copiar la contraseña al portapapeles

## Despliegue

Puedes desplegar esta aplicación en cualquier servidor web estático:

1. Sube todos los archivos a tu servidor web
2. Asegúrate de mantener la estructura de carpetas
3. No se requiere ninguna configuración adicional del servidor

Puedes probar la aplicación en línea en [GitHub Pages](https://jgamboaa.github.io/password_generator/).

## Seguridad

Este generador utiliza la API Web Crypto (cuando está disponible) para generar números aleatorios criptográficamente seguros. Como fallback, utiliza `Math.random()` si la API Crypto no está disponible.

---

Desarrollado como parte de un proyecto de demostración para crear herramientas de seguridad web interactivas.
