// Redirectpedia — navigazione tra la griglia delle linee, il dettaglio link
// e la vista "categoria non trovata". Nessuna dipendenza esterna. Usa l'hash
// dell'URL (#str, #ani, ...) così ogni linea resta condivisibile con un link
// diretto e funziona il tasto "indietro" del browser.

(function () {
  const tilesView = document.getElementById('tilesView');
  const detailView = document.getElementById('detailView');
  const notFoundView = document.getElementById('notFoundView');
  const panels = Array.from(detailView.querySelectorAll('.detail-panel'));
  const tiles = Array.from(tilesView.querySelectorAll('.tile'));
  const backBtn = document.getElementById('backBtn');
  const notFoundBackBtn = document.getElementById('notFoundBackBtn');

  const lineSwitch = document.getElementById('lineSwitch');
  const lineSwitchBtn = document.getElementById('lineSwitchBtn');
  const lineSwitchMenu = document.getElementById('lineSwitchMenu');
  const lineSwitchItems = Array.from(lineSwitchMenu.querySelectorAll('.line-switch-item'));

  const validLines = panels.map((p) => p.dataset.line);
  const DEFAULT_TITLE = 'Redirectpedia — la mappa dei tuoi link';

  function hideAllViews() {
    tilesView.classList.add('is-hidden');
    detailView.classList.add('is-hidden');
    notFoundView.classList.add('is-hidden');
  }

  function showHome(updateHash) {
    closeLineSwitch();
    hideAllViews();
    tilesView.classList.remove('is-hidden');
    panels.forEach((p) => p.classList.add('is-hidden'));
    if (updateHash) history.pushState(null, '', '#');
    document.title = DEFAULT_TITLE;
  }

  function showNotFound(updateHash, attemptedLine) {
    closeLineSwitch();
    hideAllViews();
    notFoundView.classList.remove('is-hidden');
    document.title = 'Not found — Redirectpedia';
    if (updateHash) history.pushState(null, '', attemptedLine ? '#' + attemptedLine : '#');
    notFoundView.querySelector('.notfound-title').focus({ preventScroll: false });
  }

  function showLine(line, updateHash) {
    if (!validLines.includes(line)) {
      showNotFound(updateHash, line);
      return;
    }
    closeLineSwitch();
    hideAllViews();
    detailView.classList.remove('is-hidden');
    panels.forEach((p) => p.classList.toggle('is-hidden', p.dataset.line !== line));

    const activePanel = panels.find((p) => p.dataset.line === line);
    const heading = activePanel.querySelector('.panel-heading');
    document.title = `${heading.textContent} — Redirectpedia`;
    updateLineSwitchCurrent(line);

    if (updateHash) history.pushState(null, '', '#' + line);
    // sposta il focus sull'intestazione per l'accessibilità da tastiera/screen reader
    heading.focus({ preventScroll: false });
  }

  tiles.forEach((tile) => {
    tile.addEventListener('click', (e) => {
      e.preventDefault();
      showLine(tile.dataset.line, true);
    });
  });

  backBtn.addEventListener('click', () => showHome(true));
  notFoundBackBtn.addEventListener('click', () => showHome(true));

  window.addEventListener('popstate', () => {
    const line = location.hash.replace('#', '');
    if (line) showLine(line, false);
    else showHome(false);
  });

  // conta i link reali presenti in ciascun pannello e lo mostra nella tessera
  panels.forEach((panel) => {
    const line = panel.dataset.line;
    const count = panel.querySelectorAll('.stop').length;
    const countEl = tilesView.querySelector(`.tile-count[data-count-for="${line}"]`);
    if (countEl) countEl.textContent = `${count} links`;
  });

  // ---- menu a comparsa: passa da una linea all'altra senza tornare alla home ----

  function updateLineSwitchCurrent(line) {
    lineSwitchItems.forEach((item) => {
      const isCurrent = item.dataset.line === line;
      item.classList.toggle('is-current', isCurrent);
      if (isCurrent) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
  }

  function onOutsideClick(e) {
    if (!lineSwitch.contains(e.target)) closeLineSwitch();
  }

  function onEscapeKey(e) {
    if (e.key === 'Escape') {
      closeLineSwitch();
      lineSwitchBtn.focus();
    }
  }

  function openLineSwitch() {
    lineSwitchMenu.classList.remove('is-hidden');
    lineSwitchBtn.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onOutsideClick);
    document.addEventListener('keydown', onEscapeKey);
  }

  function closeLineSwitch() {
    lineSwitchMenu.classList.add('is-hidden');
    lineSwitchBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onOutsideClick);
    document.removeEventListener('keydown', onEscapeKey);
  }

  lineSwitchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = lineSwitchBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeLineSwitch();
    } else {
      openLineSwitch();
      const firstItem = lineSwitchMenu.querySelector('.line-switch-item');
      if (firstItem) firstItem.focus();
    }
  });

  lineSwitchItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const line = item.dataset.line;
      closeLineSwitch();
      lineSwitchBtn.focus();
      if (line !== location.hash.replace('#', '')) {
        showLine(line, true);
      }
    });
  });

  // stato iniziale in base all'hash corrente
  const initialLine = location.hash.replace('#', '');
  if (initialLine) showLine(initialLine, false);
  else showHome(false);
})();
