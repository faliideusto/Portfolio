# Rafael Deusto — Portfolio

Portfolio de desarrollo de software: https://faliideusto.github.io/Portfolio/

La raíz contiene la web estática preparada para GitHub Pages (main / raíz). El código editable de React y TypeScript se encuentra en `source/`.

## Actualizar

Con Node.js 22 o posterior:

1. `cd source`
2. `npm ci`
3. `npm run dev` para trabajar en local.
4. `npm run build`
5. Copiar el contenido de `source/dist-pages/` a la raíz del repositorio y subir los cambios a main.

GitHub Pages publica la raíz al recibir el push. La fotografía de perfil se incluye en img. Las capturas reales de Escuela Fito Raya y Tesis, y el CV en español exportado de Canva, se incluyen en assets. No se necesita servidor ni base de datos.

## MaxiJuegos (proyecto 04, jugable)

La carpeta `maxijuegos/` de la raíz contiene la exportación web del juego (Godot 4, sin hilos y sin sonido) y se publica tal cual: no pasa por Vite. `npm run dev` y `npm run start` la sirven desde ahí.

Para actualizarla, exportar el preset `Web` en el repositorio de MaxiJuegos y copiar `index.js`, `index.wasm`, `index.pck` y los dos `index.audio*.js` a `maxijuegos/`. El `index.html` de esa carpeta es propio del portfolio (pantalla de carga): si cambia el tamaño de `index.wasm` o `index.pck`, actualizar `fileSizes` en ese archivo.
