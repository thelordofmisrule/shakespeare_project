document.addEventListener('DOMContentLoaded', () => {
  /* ----------  A. build the sidebar ---------- */
  const plays = [
    { title: "All’s Well That Ends Well",         file: "firstfolio/plays/alls-well.html" },
    { title: "Antony and Cleopatra",             file: "firstfolio/plays/antony-cleopatra.html" },
    { title: "As You Like It",                   file: "firstfolio/plays/as-you-like-it.html" },
    { title: "Julius Caesar",                    file: "firstfolio/plays/julius-caesar.html" },
    { title: "The Comedy of Errors",             file: "firstfolio/plays/comedy-of-errors.html" },
    { title: "Coriolanus",                       file: "firstfolio/plays/coriolanus.html" },
    { title: "Cymbeline",                        file: "firstfolio/plays/cymbeline.html" },
    { title: "Hamlet",                           file: "firstfolio/plays/hamlet.html" },
    { title: "The First Part of King Henry IV",  file: "firstfolio/plays/henry-4-1.html" },
    { title: "The Second Part of King Henry IV", file: "firstfolio/plays/henry-4-2.html" },
    { title: "King Henry V",                     file: "firstfolio/plays/henry-5.html" },
    { title: "The First Part of King Henry VI",  file: "firstfolio/plays/henry-6-1.html" },
    { title: "The Second Part of King Henry VI", file: "firstfolio/plays/henry-6-2.html" },
    { title: "The Third Part of King Henry VI",  file: "firstfolio/plays/henry-6-3.html" },
    { title: "King Henry VIII",                  file: "firstfolio/plays/henry-8.html" },
    { title: "King John",                        file: "firstfolio/plays/john.html" },
    { title: "King Lear",                        file: "firstfolio/plays/lear.html" },
    { title: "Love’s Labour’s Lost",             file: "firstfolio/plays/loves-labor.html" },
    { title: "Macbeth",                          file: "firstfolio/plays/macbeth.html" },
    { title: "Measure for Measure",              file: "firstfolio/plays/measure.html" },
    { title: "The Merchant of Venice",           file: "firstfolio/plays/merchant.html" },
    { title: "The Merry Wives of Windsor",       file: "firstfolio/plays/merry-wives.html" },
    { title: "A Midsummer Night’s Dream",        file: "firstfolio/plays/midsummer.html" },
    { title: "Much Ado About Nothing",           file: "firstfolio/plays/much-ado.html" },
    { title: "Othello",                          file: "firstfolio/plays/othello.html" },
    { title: "Richard II",                       file: "firstfolio/plays/richard-2.html" },
    { title: "Richard III",                      file: "firstfolio/plays/richard-3.html" },
    { title: "Romeo and Juliet",                 file: "firstfolio/plays/romeo-juliet.html" },
    { title: "The Taming of the Shrew",          file: "firstfolio/plays/taming.html" },
    { title: "The Tempest",                      file: "firstfolio/plays/tempest.html" },
    { title: "Timon of Athens",                  file: "firstfolio/plays/timon.html" },
    { title: "Titus Andronicus",                 file: "firstfolio/plays/titus.html" },
    { title: "Troilus and Cressida",             file: "firstfolio/plays/troylus.html" },
    { title: "Twelfth Night",                    file: "firstfolio/plays/twelfth-night.html" },
    { title: "Two Gentlemen of Verona",          file: "firstfolio/plays/two-gentlemen.html" },
    { title: "The Winter’s Tale",                file: "firstfolio/plays/winters-tale.html" }
  ];
  
  const playList      = document.getElementById('play-list');
  const playTitle     = document.getElementById('play-title');
  const playContainer = document.getElementById('play-container');

  // Sort plays alphabetically by title
  plays.sort((a, b) => a.title.localeCompare(b.title));

  plays.forEach(play => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href = '#';
    a.textContent = play.title;
    a.addEventListener('click', e => {
      e.preventDefault();
      loadPlay(play);
    });
    li.appendChild(a);
    playList.appendChild(li);
  });

  function loadPlay(play) {
    fetch(play.file)
      .then(r => {
        if (!r.ok) throw Error(play.file);
        return r.text();
      })
      .then(html => {
        playTitle.textContent = play.title;
        playContainer.innerHTML = html;
      })
      .catch(err => {
        console.error(err);
        playTitle.textContent = 'Error loading play';
        playContainer.innerHTML = '';
      });
  }

  /* ----------  B. line / syllable toggles  ---------- */
  const bodyEl       = document.body;
  const chkLines     = document.getElementById('toggle-lines');
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

// /site/js/app.js

// ... keep all your existing code from the top ...

function loadPlay(play) {
  fetch(play.file)
    .then(r => {
      if (!r.ok) throw Error(play.file);
      return r.text();
    })
    .then(html => {
      playTitle.textContent = play.title;
      playContainer.innerHTML = html;

      // ---- ADD THIS NEW ANNOTATION LOGIC ----
      setupAnnotations();
      // ------------------------------------

    })
    .catch(err => {
      console.error(err);
      playTitle.textContent = 'Error loading play';
      playContainer.innerHTML = '';
    });
}

// ---- ADD THIS ENTIRE NEW FUNCTION ----
function setupAnnotations() {
  const popup = document.getElementById('annotation-popup');
  const annotatedSpans = document.querySelectorAll('.annotated');

  annotatedSpans.forEach(span => {
    span.addEventListener('click', (event) => {
      // Stop the click from bubbling up to the document
      event.stopPropagation();
      
      // Get the annotation text from the data attribute
      const annotationText = span.dataset.annotation;
      if (!annotationText) return;

      // Set popup content and make it visible
      popup.textContent = annotationText;
      popup.style.display = 'block';

      // Position the popup near the clicked element
      const rect = span.getBoundingClientRect();
      popup.style.left = `${rect.left}px`;
      popup.style.top = `${rect.bottom + window.scrollY + 5}px`; // 5px below the element
    });
  });

  // Hide the popup if you click anywhere else on the page
  document.addEventListener('click', () => {
    popup.style.display = 'none';
  });
}
