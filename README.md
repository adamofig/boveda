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

## 📄 Documentación Técnica

Contiene la información detallada sobre la planeación física, costos y especificaciones de ingeniería:

*   **[detalles.md](file:///Users/adamo/Documents/GitHub/boveda/docs/detalles.md)**: Recopila especificaciones sobre climatización/ventilación natural, instalación eléctrica, sistema hidrosanitario (biodigestor autolimpiable y pozo de absorción) y dirección técnica.
*   **[materiales-y-posibles-costos.md](file:///Users/adamo/Documents/GitHub/boveda/docs/materiales-y-posibles-costos.md)**: Catálogo de materiales clave de cimentación, muros y bóveda de cañón. Incluye tablas de costos estimados y reales (como la piedra para muros o biodigestores) y la lista de acciones pendientes / mano de obra.

---

## 🔍 Índice de Archivos por Secciones de la Landing Page

Esta guía detalla la correspondencia entre los componentes visuales de la interfaz de usuario, sus archivos fuente y sus archivos lógicos asociados:

| Sección en UI | Archivo HTML Componente | Archivo(s) de Lógica / Estilo | Propósito y Contexto de la Sección |
| :--- | :--- | :--- | :--- |
| **Estructura Base** | [index.html](file:///Users/adamo/Documents/GitHub/boveda/index.html) | [style.css](file:///Users/adamo/Documents/GitHub/boveda/style.css), [main.js](file:///Users/adamo/Documents/GitHub/boveda/main.js) | Contenedor principal (Skeleton Layout), menú lateral de navegación y pie de página. |
| **1. Presentación (Hero)** | [hero.html](file:///Users/adamo/Documents/GitHub/boveda/sections/hero.html) | [style.css](file:///Users/adamo/Documents/GitHub/boveda/style.css) | Pantalla de inicio con títulos principales y estadísticas rápidas del proyecto. |
| **2. Ficha Técnica** | [ficha-tecnica.html](file:///Users/adamo/Documents/GitHub/boveda/sections/ficha-tecnica.html) | [style.css](file:///Users/adamo/Documents/GitHub/boveda/style.css) | Tabla y tarjetas con dimensiones (huella, tapanco, altura) e inclinación del terreno. |
| **3. Objetivos** | [objetivos.html](file:///Users/adamo/Documents/GitHub/boveda/sections/objetivos.html) | [style.css](file:///Users/adamo/Documents/GitHub/boveda/style.css) | Declaración de intenciones comerciales (rentabilidad) y de usuario (experiencia y descanso). |
| **4. Distribución** | [distribucion.html](file:///Users/adamo/Documents/GitHub/boveda/sections/distribucion.html) | [main.js](file:///Users/adamo/Documents/GitHub/boveda/main.js) (Pestañas) | Planos interactivos por niveles (Planta Baja y Planta Alta/Tapanco) con selectores. |
| **5. Visor 3D** | [visor-3d.html](file:///Users/adamo/Documents/GitHub/boveda/sections/visor-3d.html) | [visor-3d.js](file:///Users/adamo/Documents/GitHub/boveda/visor-3d.js) (Three.js) | Contenedor canvas que inicializa el modelo interactivo 3D de la cabaña abovedada. |
| **6. Renders y Alzados** | [renders.html](file:///Users/adamo/Documents/GitHub/boveda/sections/renders.html) | [style.css](file:///Users/adamo/Documents/GitHub/boveda/style.css) | Galería de imágenes con planos arquitectónicos estructurales, fachadas y volumetrías. |
| **7. Inspiración** | [inspiracion.html](file:///Users/adamo/Documents/GitHub/boveda/sections/inspiracion.html) | [style.css](file:///Users/adamo/Documents/GitHub/boveda/style.css) | Moodboard visual con referentes arquitectónicos y acabados estilo *Casona Sforza*. |
| **8. Cuestionario** | [cuestionario.html](file:///Users/adamo/Documents/GitHub/boveda/sections/cuestionario.html) | [main.js](file:///Users/adamo/Documents/GitHub/boveda/main.js) (Acordeón) | Acordeón interactivo con las preguntas y respuestas técnicas más importantes de la obra. |

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
