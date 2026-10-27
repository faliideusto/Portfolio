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

El juego se publica en su propia web, https://maxijuegos.vercel.app/ (con música y salas online por código). El repositorio de MaxiJuegos la exporta y la publica solo en cada push a `main`, así que el portfolio no guarda ninguna copia: la tarjeta la abre en un iframe ("Jugar ahora") o en una pestaña nueva ("Jugar con amigos").

## Capturas de los proyectos

Cada captura de `source/public/assets/shots/` tiene dos copias reducidas: `sm/` (960 px de ancho, la que carga el móvil) y `thumb/` (320 px, las miniaturas del carrusel en escritorio). Al añadir una captura nueva hay que crear también esas dos copias, porque las capturas grandes llenan la memoria de Safari en iPhone y la pestaña se recarga sola.
