# Dra. Bustamante - Medicina Estética
## Contexto del Proyecto

> [!IMPORTANT]
> **REGLA DE ORO DE MANTENIMIENTO:** 
> Cada vez que se realice algún cambio estructural, de dependencias, de archivos, en el diseño base o en este mismo proyecto por parte de cualquier agente de Inteligencia Artificial, desarrollador o editor de código, **ESTE DOCUMENTO (`CONTEXT.md`) DEBE SER ACTUALIZADO OBLIGATORIAMENTE** de manera que refleje con precisión el estado actual del proyecto. 
> Este documento funciona como la única fuente de la verdad para el contexto del proyecto y debe ser legible y comprensible por programas, IA's y humanos.

---

## 1. Descripción General
El proyecto es una **Landing Page** (página de aterrizaje única) profesional para la Dra. Maria Paula Bustamante, especialista en medicina estética y cuidados de la piel en Samborondón, Ecuador. El sitio está diseñado para transmitir elegancia, ética médica y profesionalismo, utilizando una estética editorial refinada.

## 2. Pila Tecnológica (Tech Stack)
Este es un sitio web estático puro, sin uso de frameworks de JavaScript pesados (no React, no Next.js) ni bibliotecas CSS pesadas (no Tailwind, no Bootstrap).

- **HTML5:** Marcado semántico (`<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`).
- **CSS3 Puro (Vanilla):** Manejo robusto de Custom Properties (Variables CSS), Grid, Flexbox, media queries y transiciones suaves.
- **JavaScript Puro (Vanilla ES6+):** Utilizado de forma mínima y enfocada a interacciones (IntersectionObserver para animaciones al hacer scroll, interacción de menú móvil tipo "burger", y ligero efecto *parallax* en el hero banner).

## 3. Estructura de Archivos
```text
/Users/carlosalava/Desktop/Proyectos/dra-bustamante
├── CONTEXT.md        # (Este archivo) Documento de contexto y reglas del proyecto
├── index.html        # Estructura principal y contenido de la web
├── css/
│   └── styles.css    # Hojas de estilo unificadas con todo el diseño y variables
├── js/
│   └── main.js       # Scripts para menú móvil, Intersection Observers y utilidades
└── images/           # Carpeta para todo el contenido multimedia (.jpg, .png, .svg)
    ├── hero.jpg
    ├── profile.jpg
    └── treatment-*.jpg
```

## 4. Sistema de Diseño (Design System)

### Paleta de Colores
La paleta se centra en tonos "vino", acentos dorados/champaña, y fondos cremas cálidos.
- **Wine (Colores Principales):** `#2A1018`, `#5C1F2C`, `#962E45`
- **Gold/Champagne (Acentos):** `#B58A5E`, `#C9A47A`, `#D9BD96`
- **Cream (Fondos):** `#FBF7F2`, `#F4ECE2`, `#ECDFD0`
- **Ink (Textos/Tipografías):** `#1F1318` (Oscuros profundos con subtonos vino)
- **Blush (Cajas/Fondos sutiles):** `#E8D5CA`, `#F0DFD6`

### Tipografía
Se cargan a través de Google Fonts.
- **Display / Títulos:** `Playfair Display`, serif (Para dar el look editorial, estético y premium enfocado en belleza).
- **Body / Textos:** `Montserrat`, sans-serif (Para la legibilidad moderna y limpia que complementa la elegancia).

### Interacciones y Efectos
- **Animaciones sutiles:** Los botones tienen `transform: translateY()` y las imágenes tienen `transform: scale()` suaves al interactuar o cargar.
- **Intersection Observer (`.reveal`):** Las secciones y tarjetas entran con `fadeUp` suave al hacer scroll.
- **Glassmorphism / Blur:** Se utiliza `backdrop-filter: blur()` en la caja de navegación superior flotante (`nav__inner`), la cual se adaptó para estar envuelta en una píldora con bordes redondeados y sombra.

## 5. Contacto y Redes
El call to action principal del sitio dirige hacia WhatsApp (mediante `https://api.whatsapp.com/send`) con un mensaje predeterminado y está presente en el menú y al final del sitio (se removió el botón flotante global para darle mayor elegancia a la interfaz). El número y enlaces de Instagram correspondientes están quemados en el código.

---
*Última actualización: Mayo 2026*
