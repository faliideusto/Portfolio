// Esto hace que las barras de habilidades se llenen cuando la página carga
window.addEventListener('load', () => {
  const skills = document.querySelectorAll('.skill-progress');

  skills.forEach(skill => {
    const width = skill.getAttribute('data-skill'); // saco el porcentaje del atributo
    setTimeout(() => {
      skill.style.width = width; // cambio la anchura de la barra para animarla
    }, 500); // espero medio segundo para que quede más bonito
  });
});
