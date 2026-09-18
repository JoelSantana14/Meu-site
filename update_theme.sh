#!/bin/bash

# Define the CSS to inject
CSS_INJECT="
  --color-indigo-50: var(--color-emerald-50);
  --color-indigo-100: var(--color-emerald-100);
  --color-indigo-200: var(--color-emerald-200);
  --color-indigo-300: var(--color-emerald-300);
  --color-indigo-400: var(--color-emerald-400);
  --color-indigo-500: var(--color-emerald-500);
  --color-indigo-600: var(--color-emerald-600);
  --color-indigo-700: var(--color-emerald-700);
  --color-indigo-800: var(--color-emerald-800);
  --color-indigo-900: var(--color-emerald-900);
  --color-indigo-950: var(--color-emerald-950);
"

# We will just edit index.css directly with edit_file.
