# Leones FC e Hípico FC – Plataforma de Resultados Deportivos

Este proyecto es una plataforma web minimalista y responsiva para mostrar el **fixture**, la **tabla de posiciones** y los **goleadores** de diferentes categorías (Sub-6 a Sub-15) del club **Leones FC e Hípico FC**. La información se alimenta automáticamente desde hojas de cálculo de Google Sheets publicadas como CSV.

## 🧩 Características

- ✅ Visualización de fixtures por subcategoría.
- 📊 Cálculo automático de posiciones (PJ, PG, PE, PP, DG, Pts).
- ⚽ Listado de goleadores por categoría.
- 🖼️ Marca de agua de fondo con los logos de ambos clubes.
- ⚡ Interfaz intuitiva con TailwindCSS y JavaScript.
- 🔄 Datos dinámicos desde Google Sheets mediante PapaParse.


## 🚀 Tecnologías utilizadas

- HTML5 + CSS3
- TailwindCSS
- JavaScript Vanilla
- PapaParse.js
- Google Sheets como backend (CSV público)

## 📂 Estructura del proyecto

📁 assets/
├── logo.png
├── HFC.png
└── combinada.png
📁 static/
├── css/
│ └── style.css
└── js/
└── app.js
📄 index.html

markdown
Copiar
Editar

## 🔗 Fuentes de datos

- **Fixture y posiciones:**  
  [Google Sheet CSV (pestaña principal)](https://docs.google.com/spreadsheets/d/e/2PACX-1vSYXScoRCoo9DbquvdWPT7CZlImArBABXU552zmZPbsV5f-RPn1GSG4WEetgzctjw/pub?output=csv)

- **Goleadores:**  
  [Google Sheet CSV (pestaña Goleadores)](https://docs.google.com/spreadsheets/d/e/2PACX-1vSYXScoRCoo9DbquvdWPT7CZlImArBABXU552zmZPbsV5f-RPn1GSG4WEetgzctjw/pub?gid=1075599834&single=true&output=csv)

## 🛠️ Cómo usar

1. Clona este repositorio o descarga los archivos.
2. Asegúrate de tener conexión a internet para acceder a TailwindCDN y PapaParse.
3. Abre `index.html` en tu navegador.
4. Haz clic en alguna categoría (Sub-6 a Sub-15) para visualizar los datos.

## ✍️ Créditos

Desarrollado por Enrique Arce  
© 2025 Leones FC e Hípico FC. Todos los derechos reservados.

---

📌 *Este proyecto es de uso deportivo, mantiene todos los derechos reservados legales bajo la licencia MIT.*
