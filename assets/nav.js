/* Menú mobile — botón hamburguesa.
   Un <nav> por página, un solo panel (.nav-links) y un solo botón
   (.nav-burger). Se referencia igual en las 22 páginas del sitio. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var burger = document.querySelector('.nav-burger');
    var panel = document.querySelector('.nav-links');
    if (!burger || !panel) return;

    function closePanel() {
      panel.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
    function openPanel() {
      panel.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
    }

    burger.addEventListener('click', function () {
      if (panel.classList.contains('is-open')) {
        closePanel();
      } else {
        openPanel();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });

    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('is-open')) return;
      if (panel.contains(e.target) || burger.contains(e.target)) return;
      closePanel();
    });
  });
})();
