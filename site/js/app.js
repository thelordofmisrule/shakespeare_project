document.addEventListener('DOMContentLoaded', () => {
  const mainPageContent = document.getElementById('play-container').innerHTML;
  const playContainer = document.getElementById('play-container');
  const plays = [
    { title: "The Tempest", file: "firstfolio/plays/tempest.html" },
    { title: "The Two Gentlemen of Verona", file: "firstfolio/plays/two-gentlemen.html" },
    { title: "The Merry Wives of Windsor", file: "firstfolio/plays/merry-wives.html" },
    { title: "Measure for Measure", file: "firstfolio/plays/measure.html" },
    { title: "The Comedy of Errors", file: "firstfolio/plays/comedy-of-errors.html" },
    { title: "Much Ado About Nothing", file: "firstfolio/plays/much-ado.html" },
    { title: "Love’s Labour’s Lost", file: "firstfolio/plays/loves-labor.html" },
    { title: "A Midsummer Night’s Dream", file: "firstfolio/plays/midsummer.html" },
    { title: "The Merchant of Venice", file: "firstfolio/plays/merchant.html" },
    { title: "As You Like It", file: "firstfolio/plays/as-you-like-it.html" },
    { title: "The Taming of the Shrew", file: "firstfolio/plays/taming.html" },
    { title: "All’s Well That Ends Well", file: "firstfolio/plays/alls-well.html" },
    { title: "Twelfth Night", file: "firstfolio/plays/twelfth-night.html" },
    { title: "The Winter’s Tale", file: "firstfolio/plays/winters-tale.html" },
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
  const homeLink = document.getElementById('home-link');
  const bodyEl = document.body;

  const categories = [
    { name: "Comedies", start: 0, end: 14 },
    { name: "Histories", start: 14, end: 24 },
    { name: "Tragedies", start: 24, end: 36 }
  ];

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

  homeLink.addEventListener('click', e => {
    e.preventDefault();
    playContainer.innerHTML = mainPageContent;
    bodyEl.classList.remove('play-loaded');
  });

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    bodyEl.classList.toggle('dark-theme');
    themeToggle.textContent = bodyEl.classList.contains('dark-theme') ? 'Switch to Light Mode' : 'Toggle Dark Mode';
  });

  function loadPlay(play) {
    fetch(play.file)
      .then(r => {
        if (!r.ok) throw Error(`Failed to load ${play.file}: ${r.statusText}`);
        return r.text();
      })
      .then(html => {
        console.log('Fetched HTML for', play.title, ':', html.substring(0, 200) + '...');
        let cleanedHtml = html;
        cleanedHtml = cleanedHtml.replace(/(<h2 class="act">.*?)\.\s*<\/h2>/g, '$1</h2>');
        cleanedHtml = cleanedHtml.replace(/(<h3 class="scene">.*?)\.\s*<\/h3>/g, '$1</h3>');
        cleanedHtml = cleanedHtml.replace(/(<div class="unknown-header">.*?)\.\s*<\/div>/g, '$1</div>');
        cleanedHtml = cleanedHtml.replace(/(<span class="direction">.*?)\.\s*<\/span>/g, '$1</span>');

        playContainer.innerHTML = `<h1 id="play-title">${play.title}</h1>${cleanedHtml}`;
        console.log('Rendered HTML:', playContainer.innerHTML.substring(0, 200) + '...');
        bodyEl.classList.add('play-loaded');
        setupAnnotations(playContainer);
      })
      .catch(err => {
        console.error('Load error:', err.message);
        playContainer.innerHTML = `<h1 id="play-title">Error loading play</h1><p>${err.message}</p>`;
        console.log('Error HTML:', playContainer.innerHTML);
        bodyEl.classList.add('play-loaded');
        setupAnnotations(playContainer);
      });
  }

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

  bodyEl.classList.add('show-lines', 'hide-syllables');

  // Annotations functionality (enhanced image load handling)
  function setupAnnotations(container) {
    const popup = document.getElementById('annotation-popup');
    if (!popup) {
      console.error('Error: #annotation-popup element not found in DOM');
      return;
    }

    const annotatedSpans = container.querySelectorAll('span.annotated');
    console.log('Found annotated spans:', annotatedSpans.length, 'Content:', Array.from(annotatedSpans).map(span => span.outerHTML));

    if (annotatedSpans.length === 0) {
      console.warn('No .annotated spans found. Check play HTML for <span class="annotated" data-annotation="...">');
      console.log('Full #play-container HTML:', container.innerHTML.substring(0, 500) + '...');
    }

    annotatedSpans.forEach((span, index) => {
      const newSpan = span.cloneNode(true);
      span.parentNode.replaceChild(newSpan, span);
      newSpan.addEventListener('click', (event) => {
        event.stopPropagation();
        const annotationHtml = newSpan.dataset.annotation;
        if (!annotationHtml) {
          console.warn(`Span ${index} has no data-annotation attribute`);
          popup.style.display = 'none';
          return;
        }

        console.log('Raw annotationHtml:', annotationHtml);
        const cleanedHtml = annotationHtml.replace(/>\s*$/, ''); // Remove trailing ">"
        console.log('Cleaned annotationHtml:', cleanedHtml);

        popup.innerHTML = cleanedHtml;

        // Immediate image load check with manual load
        let img = popup.querySelector('img');
        if (img) {
          if (img.complete) {
            if (!img.naturalHeight) {
              console.error('Image failed to load (complete but no height):', img.src);
              // Manually trigger load
              const newImg = new Image();
              newImg.onload = () => console.log('Manual image load successful:', img.src);
              newImg.onerror = () => console.error('Manual image load failed:', img.src);
              newImg.src = img.src;
              popup.replaceChild(newImg, img);
            } else {
              console.log('Image loaded successfully:', img.src);
            }
          } else {
            img.onload = () => console.log('Image loaded successfully:', img.src);
            img.onerror = () => console.error('Image failed to load:', img.src);
          }
        }

        // Fallback check after rendering
        setTimeout(() => {
          img = popup.querySelector('img');
          if (img) {
            if (img.complete && !img.naturalHeight) {
              console.error('Image failed to load after timeout:', img.src);
              const newImg = new Image();
              newImg.onload = () => console.log('Manual image load after timeout successful:', img.src);
              newImg.onerror = () => console.error('Manual image load after timeout failed:', img.src);
              newImg.src = img.src;
              popup.replaceChild(newImg, img);
            } else if (!img.complete) {
              img.onload = () => console.log('Image loaded after timeout:', img.src);
              img.onerror = () => console.error('Image failed to load after timeout:', img.src);
            }
          }
        }, 100);

        popup.style.display = 'block';

        const rect = newSpan.getBoundingClientRect();
        let left = rect.left + window.scrollX;
        let top = rect.bottom + window.scrollY + 5;

        const popupWidth = popup.offsetWidth || 300;
        const popupHeight = popup.offsetHeight || 100;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left + popupWidth > viewportWidth - 10) {
          left = viewportWidth - popupWidth - 10;
        }
        if (left < 10) left = 10;
        if (top + popupHeight > viewportHeight + window.scrollY - 10) {
          top = rect.top + window.scrollY - popupHeight - 5;
        }

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        console.log(`Showing popup for span ${index}: "${cleanedHtml}" at (${left}, ${top})`);
      });
    });

    document.removeEventListener('click', null);
    document.addEventListener('click', (event) => {
      if (!event.target.closest('span.annotated')) {
        popup.style.display = 'none';
      }
    });
  }
});