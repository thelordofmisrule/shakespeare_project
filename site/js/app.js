document.addEventListener('DOMContentLoaded', () => {
  /* ----------  A. Store main page content ---------- */
  const mainPageContent = document.getElementById('play-container').innerHTML;

  /* ----------  B. Build the sidebar ---------- */
  const plays = [
    // Comedies
    { title: "The Tempest", file: "firstfolio/plays/tempest.html" },
    { title: "The Two Gentlemen of Verona", file: "firstfolio/plays/two-gentlemen.html" },
    { title: "The Merry Wives of Windsor", file: "firstfolio/plays/merry-wives.html" },
    { title: "Measure for Measure", file: "firstfolio/plays/measure.html" },
    { title: "The Comedy of Errors", file: "firstfolio/plays/comedy-errors.html" },
    { title: "Much Ado About Nothing", file: "firstfolio/plays/much-ado.html" },
    { title: "Love’s Labour’s Lost", file: "firstfolio/plays/loves-labor.html" },
    { title: "A Midsummer Night’s Dream", file: "firstfolio/plays/midsummer.html" },
    { title: "The Merchant of Venice", file: "firstfolio/plays/merchant.html" },
    { title: "As You Like It", file: "firstfolio/plays/as-you-like-it.html" },
    { title: "The Taming of the Shrew", file: "firstfolio/plays/taming.html" },
    { title: "All’s Well That Ends Well", file: "firstfolio/plays/alls-well.html" },
    { title: "Twelfth Night", file: "firstfolio/plays/twelfth-night.html" },
    { title: "The Winter’s Tale", file: "firstfolio/plays/winters-tale.html" },
    // Histories
    { title: "King John", file: "firstfolio/plays/john.html" },
    { title: "Richard II", file: "firstfolio/plays/richard-2.html" },
    { title: "Henry IV, Part 1", file: "firstfolio/plays/henry-4-1.html" },
    { title: "Henry IV, Part 2", file: "firstfolio/plays/henry-4-2.html" },
    { title: "Henry V", file: "firstfolio/plays/henry-5.html" },
    { title: "Henry VI, Part 1", file: "firstfolio/plays/henry-6-1.html" },
    { title: "Henry VI, Part 2", file: "firstfolio/plays/henry-6-2.html" },
    { title: "Henry VI, Part 3", file: "firstfolio/plays/henry-6-3.html" },
    { title: "Richard III", file: "firstfolio/plays/richard-3.html" },
    { title: "Henry VIII", file: "firstfolio/plays/henry-8.html" },
    // Tragedies
    { title: "Troilus and Cressida", file: "firstfolio/plays/troylus.html" },
    { title: "Coriolanus", file: "firstfolio/plays/coriolanus.html" },
    { title: "Titus Andronicus", file: "firstfolio/plays/titus.html" },
    { title: "Romeo and Juliet", file: "firstfolio/plays/romeo-juliet.html" },
    { title: "Timon of Athens", file: "firstfolio/plays/timon.html" },
    { title: "Julius Caesar", file: "firstfolio/plays/julius-caesar.html" },
    { title: "Macbeth", file: "firstfolio/plays/macbeth.html" },
    { title: "Hamlet", file: "firstfolio/plays/hamlet.html" },
    { title: "King Lear", file: "firstfolio/plays/lear.html" },
    { title: "Othello", file: "firstfolio/plays/othello.html" },
    { title: "Antony and Cleopatra", file: "firstfolio/plays/antony-cleopatra.html" },
    { title: "Cymbeline", file: "firstfolio/plays/cymbeline.html" }
  ];

  const playList = document.getElementById('play-list');
  const playContainer = document.getElementById('play-container');
  const homeLink = document.getElementById('home-link');
  const bodyEl = document.body;

  // Define categories and their play indices
  const categories = [
    { name: "Comedies", start: 0, end: 14 },
    { name: "Histories", start: 14, end: 24 },
    { name: "Tragedies", start: 24, end: 36 }
  ];

  // Render plays with category headers
  categories.forEach(category => {
    const headerLi = document.createElement('li');
    headerLi.className = 'category-header';
    headerLi.textContent = category.name;
    playList.appendChild(headerLi);

    for (let i = category.start; i < category.end; i++) {
      const play = plays[i];
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = play.title;
      a.addEventListener('click', e => {
        e.preventDefault();
        loadPlay(play);
      });
      li.appendChild(a);
      playList.appendChild(li);
    }
  });

  // Handle home link click
  homeLink.addEventListener('click', e => {
    e.preventDefault();
    playContainer.innerHTML = mainPageContent;
    bodyEl.classList.remove('play-loaded'); // Hide controls
  });

  function loadPlay(play) {
    fetch(play.file)
      .then(r => {
        if (!r.ok) throw Error(`Failed to load ${play.file}: ${r.statusText}`);
        return r.text();
      })
      .then(html => {
        // Remove trailing period from .act, .scene, .unknown-header, .direction
        let cleanedHtml = html;
        cleanedHtml = cleanedHtml.replace(/(<h2 class="act">.*?)\.\s*<\/h2>/g, '$1</h2>');
        cleanedHtml = cleanedHtml.replace(/(<h3 class="scene">.*?)\.\s*<\/h3>/g, '$1</h3>');
        cleanedHtml = cleanedHtml.replace(/(<div class="unknown-header">.*?)\.\s*<\/div>/g, '$1</div>');
        cleanedHtml = cleanedHtml.replace(/(<span class="direction">.*?)\.\s*<\/span>/g, '$1</span>');
        playContainer.innerHTML = `<h1 id="play-title">${play.title}</h1>${cleanedHtml}`;
        bodyEl.classList.add('play-loaded'); // Show controls
        setupAnnotations();
      })
      .catch(err => {
        console.error('Load error:', err.message);
        playContainer.innerHTML = `<h1 id="play-title">Error loading play</h1><p>${err.message}</p>`;
        bodyEl.classList.add('play-loaded'); // Show controls even on error
      });
  }

  /* ----------  C. line / syllable toggles  ---------- */
  const chkLines = document.getElementById('toggle-lines');
  const chkSyllables = document.getElementById('toggle-syllables');

  chkLines.addEventListener('change', () => {
    bodyEl.classList.toggle('show-lines', chkLines.checked);
    bodyEl.classList.toggle('hide-lines', !chkLines.checked);
  });
  chkSyllables.addEventListener('change', () => {
    bodyEl.classList.toggle('show-syllables', chkSyllables.checked);
    bodyEl.classList.toggle('hide-syllables', !chkSyllables.checked);
  });

  /* set initial classes to match default check-box state */
  bodyEl.classList.add('show-lines', 'hide-syllables');
});

// setupAnnotations function unchanged
function setupAnnotations() {
  const popup = document.getElementById('annotation-popup');
  const annotatedSpans = document.querySelectorAll('.annotated');
  console.log('Found annotated spans:', annotatedSpans.length);

  annotatedSpans.forEach(span => {
    span.addEventListener('click', (event) => {
      event.stopPropagation();
      const annotationText = span.dataset.annotation;
      if (!annotationText) {
        popup.style.display = 'none';
        return;
      }

      popup.textContent = annotationText;
      popup.style.display = 'block';

      const rect = span.getBoundingClientRect();
      let left = rect.left + window.scrollX;
      let top = rect.bottom + window.scrollY + 5;

      const popupWidth = popup.offsetWidth;
      const viewportWidth = window.innerWidth;
      if (left + popupWidth > viewportWidth - 10) {
        left = viewportWidth - popupWidth - 10;
      }
      if (left < 10) left = 10;

      popup.style.left = `${left}px`;
      popup.style.top = `${top}px`;
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.classList.contains('annotated')) {
      popup.style.display = 'none';
    }
  });
}