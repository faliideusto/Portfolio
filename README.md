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

GitHub Pages publica la raíz al recibir el push. La fotografía, la captura real de Tesis y el CV se incluyen en assets. No se necesita servidor ni base de datos.

