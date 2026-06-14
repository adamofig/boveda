# Proyecto Cabaña Bóveda de Cañón

Este repositorio contiene la **página de aterrizaje (landing page)** interactiva y modular para presentar el proyecto conceptual de la cabaña con techo en **bóveda de cañón** que se construirá en Puerto Ángel, Oaxaca.

El diseño web se inspira en la arquitectura orgánica y el estilo minimalista tropical de **Casona Sforza** (Puerto Escondido), utilizando una paleta de colores terrosos (terracota, arena, carbón) y tipografía moderna.

---

## 📂 Origen de los Documentos y Recursos

Toda la información técnica, cuestionarios y planos conceptuales fueron extraídos de los siguientes archivos locales:

- **Documento Técnico Principal (Markdown)**:
  `file:///Users/adamo/Documents/Adamo Main Vault/05 Life/playa/Proyecto Cabaña Boveda de Cañon.md`
- **Imágenes, Planos y Renders de Inspiración**:
  `file:///Users/adamo/Documents/Adamo Main Vault/05 Life/playa/attachments/` (Copiados localmente a la carpeta `images/` de este proyecto).

---

## 📦 Estructura Modular del Proyecto

Para facilitar el mantenimiento y la edición de secciones de forma independiente, el proyecto está dividido en componentes separados:

```
├── index.html              # Contenedor/Frame estructural principal (Skeleton layout)
├── style.css               # Hoja de estilos global, paleta de colores y scroll-snap
├── main.js                # Cargador dinámico de secciones e inicializador Three.js/UI
├── images/                 # Renders de volumetría e imágenes de inspiración
└── sections/               # Componentes HTML individuales para cada sección:
    ├── hero.html           # Cabecera de presentación y métricas rápidas
    ├── ficha-tecnica.html  # Ficha de especificaciones y dimensiones
    ├── objetivos.html      # Objetivos comerciales y de usuario
    ├── distribucion.html   # Planos interactivos de distribución por niveles
    ├── visor-3d.html       # Lienzo interactivo para el canvas 3D (Three.js)
    ├── renders.html        # Grid con planos estructurales y alzados
    ├── inspiracion.html    # Moodboard e imágenes de referencia
    └── cuestionario.html   # Preguntas y respuestas técnicas (Acordeón)
```

---

## 🛠️ Cómo Funciona la Carga Dinámica

1. El archivo `index.html` contiene únicamente las etiquetas estructurales de cabecera (`<header>`), pie de página (`<footer>`), controles flotantes y contenedores vacíos con identificadores únicos (p. ej., `<section id="hero"></section>`).
2. Al cargar la página, `main.js` realiza solicitudes asíncronas concurrentes (`fetch`) para traer cada archivo individual de la carpeta `/sections/`.
3. Una vez inyectados los contenidos HTML, se disparan los módulos de inicialización de la interfaz:
   - Renderizador 3D WebGL con **Three.js** y **OrbitControls**.
   - Eventos de interacción de pestañas para los niveles de distribución.
   - Acordeones colapsables para las preguntas de obra.
   - Enlaces dinámicos de los puntos de navegación lateral (scroll snap).

---

## 🚨 IMPORTANTE: Cómo Visualizar el Proyecto Localmente

> [!IMPORTANT]
> **No abras el archivo `index.html` directamente haciendo doble clic desde el gestor de archivos.** 
> Debido a las políticas de seguridad de los navegadores modernos (CORS), las peticiones locales `fetch` para cargar los archivos de la carpeta `sections/` serán bloqueadas bajo el protocolo `file://`.
> 
> **Debes visualizar el sitio a través de un servidor web local.**

### Opción 1: Con Python (Recomendado, preinstalado en macOS)
Inicia el servidor local en la terminal dentro de esta carpeta:
```bash
python3 -m http.server 8199
```
Abre tu navegador e ingresa a:
👉 [http://localhost:8199](http://localhost:8199)

### Opción 2: Con Node.js / npm
Si prefieres usar `npx`:
```bash
npx serve -l 8199
```
Abre tu navegador en:
👉 [http://localhost:8199](http://localhost:8199)
