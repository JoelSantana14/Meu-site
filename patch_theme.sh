#!/bin/bash

# We'll use sed to insert the color variables into each block.

sed -i '/\[data-theme-preset="verde"\] {/a\
  --color-indigo-50: var(--color-emerald-50);\
  --color-indigo-100: var(--color-emerald-100);\
  --color-indigo-200: var(--color-emerald-200);\
  --color-indigo-300: var(--color-emerald-300);\
  --color-indigo-400: var(--color-emerald-400);\
  --color-indigo-500: var(--color-emerald-500);\
  --color-indigo-600: var(--color-emerald-600);\
  --color-indigo-700: var(--color-emerald-700);\
  --color-indigo-800: var(--color-emerald-800);\
  --color-indigo-900: var(--color-emerald-900);\
  --color-indigo-950: var(--color-emerald-950);' src/index.css

sed -i '/\[data-theme-preset="vermelho"\] {/a\
  --color-indigo-50: var(--color-red-50);\
  --color-indigo-100: var(--color-red-100);\
  --color-indigo-200: var(--color-red-200);\
  --color-indigo-300: var(--color-red-300);\
  --color-indigo-400: var(--color-red-400);\
  --color-indigo-500: var(--color-red-500);\
  --color-indigo-600: var(--color-red-600);\
  --color-indigo-700: var(--color-red-700);\
  --color-indigo-800: var(--color-red-800);\
  --color-indigo-900: var(--color-red-900);\
  --color-indigo-950: var(--color-red-950);' src/index.css

sed -i '/\[data-theme-preset="azul"\] {/a\
  --color-indigo-50: var(--color-blue-50);\
  --color-indigo-100: var(--color-blue-100);\
  --color-indigo-200: var(--color-blue-200);\
  --color-indigo-300: var(--color-blue-300);\
  --color-indigo-400: var(--color-blue-400);\
  --color-indigo-500: var(--color-blue-500);\
  --color-indigo-600: var(--color-blue-600);\
  --color-indigo-700: var(--color-blue-700);\
  --color-indigo-800: var(--color-blue-800);\
  --color-indigo-900: var(--color-blue-900);\
  --color-indigo-950: var(--color-blue-950);' src/index.css

sed -i '/\[data-theme-preset="dourado_preto"\] {/a\
  --color-indigo-50: var(--color-amber-50);\
  --color-indigo-100: var(--color-amber-100);\
  --color-indigo-200: var(--color-amber-200);\
  --color-indigo-300: var(--color-amber-300);\
  --color-indigo-400: var(--color-amber-400);\
  --color-indigo-500: var(--color-amber-500);\
  --color-indigo-600: var(--color-amber-600);\
  --color-indigo-700: var(--color-amber-700);\
  --color-indigo-800: var(--color-amber-800);\
  --color-indigo-900: var(--color-amber-900);\
  --color-indigo-950: var(--color-amber-950);' src/index.css

