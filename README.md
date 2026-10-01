# Crab's ICPC Generator

A modern, fluid web application designed to auto-generate **ACM-ICPC Team Notebooks (Cheatsheets)** with the authentic 3-column LaTeX format based on [codes2pdf](https://github.com/Erfaniaa/codes2pdf). 

Built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**, integrating seamlessly with the official **Overleaf API** for zero-cost, zero-setup PDF compilation.

---

## ✨ Features

- 🚀 **1-Click Overleaf API Integration**: Click **"Generate Notebook"** -> *"Give me a star ⭐"* -> *"Ok bro 🚀"* to immediately export your generated LaTeX code to Overleaf. Compile and download high-quality PDFs for free without installing heavy TeX Live packages or paying for virtual machines.
- 🌓 **Light & Dark Mode**: Apple-inspired fluid theme switcher with smooth spring animations, automatically remembering your preference.
- 📑 **Authentic ACM-ICPC Table of Contents**:
  - True 3-column A4 Landscape layout matching official ICPC world finals cheatsheet formats.
  - Dot leaders (`. . . . . . . .`) and dynamic page numbering.
  - Click any algorithm directly in the Table of Contents or sidebar to open the fast code editor.
- 📁 **Flexible Code Ingestion**:
  - **Bulk Folder / ZIP Upload**: Simply organize your code files into topic folders, place them in a root directory or ZIP file, and drop it in. The app automatically parses folders into categories and files into algorithms.
  - **Manual Category Management**: Create categories (`1 Algorithms`, `2 DP Optimizations`, etc.), upload single/multiple files (`.cpp`, `.py`, `.java`, `.tex`), reorder them, or create snippets from scratch.
- ⬇️ **Smart Category Auto-Scroll**: When clicking *"Add Category"*, the sidebar smoothly scrolls to the bottom and activates the rename input so you can type immediately.
- 🏫 **School / University Logo (Optional)**:
  - Upload image file or directly paste with **`Ctrl + V`** from your clipboard.
  - Neatly displayed horizontally inline with the *Team Notebook* title.
- 🧹 **Reset & Clear Capabilities**:
  - Dedicated **Eraser button** per category to clear code files inside that category.
  - **Reset All button** to reset the entire notebook to a clean slate.
- 🎨 **Apple Fluid-Interface Principles**:
  - Tactile spring interactions on pointer down.
  - Translucent glassmorphism surfaces (`backdrop-blur-2xl`).
  - Google Inter typography for clean readability, paired with monospace code formatting.

---

## 🛠️ Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/Crablegit/ICPCGenerator.git
cd ICPCGenerator

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Recommended Folder Structure for Bulk Upload

You can prepare a folder on your computer with the following hierarchy and drop it into the app:

```text
My-ICPC-Notebook/
├── 01 Algorithms/
│   ├── mo_on_trees.cpp
│   ├── mo_algorithm.cpp
│   └── sliding_window.cpp
├── 02 DP Optimizations/
│   ├── convex_hull_trick.cpp
│   └── divide_and_conquer.cpp
├── 03 Data structures/
│   ├── STL_Treap.cpp
│   ├── fenwick.cpp
│   └── dsu.cpp
├── 04 Geometry/
│   └── circle_2points_radius.cpp
├── 05 Graphs/
│   ├── scc_kosaraju.cpp
│   └── tarjan_scc.cpp
├── 06 Math/
│   ├── lucas_theorem.tex   <-- .tex files render raw formulas/theorems
│   └── fft.cpp
└── 10 Strings/
    ├── suffix_array.cpp
    └── z_algorithm.cpp
```

---

## 📜 Credits

- **Created by:** Crabrian
  - **GitHub:** [https://github.com/Crablegit](https://github.com/Crablegit)
  - **LinkedIn:** [https://www.linkedin.com/in/brianthecrab/](https://www.linkedin.com/in/brianthecrab/)
  - **Discord:** `brianthecrab`
- **Template Credit:** 
  - LaTeX template structure based on [Erfaniaa/codes2pdf](https://github.com/Erfaniaa/codes2pdf).
