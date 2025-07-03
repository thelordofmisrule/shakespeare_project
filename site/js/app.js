document.addEventListener('DOMContentLoaded', () => {

  /* ----------  A. build the sidebar (same as before) ---------- */
  const plays = [
    { title: "All’s Well That Ends Well",       file: "firstfolio/plays/alls-well.html" },
    { title: "Antony and Cleopatra",            file: "firstfolio/plays/antony-cleopatra.html" },
    { title: "As You Like It",                  file: "firstfolio/plays/as-you-like-it.html" },
    { title: "The Comedy of Errors",            file: "firstfolio/plays/comedy-of-errors.html" },
    { title: "Coriolanus",                      file: "firstfolio/plays/coriolanus.html" },
    { title: "Cymbeline",                       file: "firstfolio/plays/cymbeline.html" },
    { title: "Hamlet",                          file: "firstfolio/plays/hamlet.html" },
    { title: "King Lear",                       file: "firstfolio/plays/king-lear.html" },
    { title: "Love’s Labour’s Lost",            file: "firstfolio/plays/loves-labours-lost.html" },
    { title: "Macbeth",                         file: "firstfolio/plays/macbeth.html" },
    { title: "Measure for Measure",             file: "firstfolio/plays/measure-for-measure.html" },
    { title: "The Merchant of Venice",          file: "firstfolio/plays/merchant-of-venice.html" },
    { title: "A Midsummer Night’s Dream",       file: "firstfolio/plays/midsummer.html" },
    { title: "Much Ado About Nothing",          file: "firstfolio/plays/much-ado.html" },
    { title: "Othello",                         file: "firstfolio/plays/othello.html" },
    { title: "Richard II",                      file: "firstfolio/plays/richard-ii.html" },
    { title: "Richard III",                     file: "firstfolio/plays/richard-iii.html" },
    { title: "Romeo and Juliet",                file: "firstfolio/plays/romeo-juliet.html" },
    { title: "The Tempest",                     file: "firstfolio/plays/tempest.html" },
    { title: "Twelfth Night",                   file: "firstfolio/plays/twelfth-night.html" }
  ];
  
  const playList      = document.getElementById('play-list');
  const playTitle     = document.getElementById('play-title');
  const playContainer = document.getElementById('play-container');

  plays.forEach(play=>{
    const li=document.createElement('li');
    const a =document.createElement('a');
    a.href='#'; a.textContent=play.title;
    a.addEventListener('click',e=>{
      e.preventDefault(); loadPlay(play);
    });
    li.appendChild(a); playList.appendChild(li);
  });

  function loadPlay(play){
    fetch(play.file)
      .then(r=>{if(!r.ok)throw Error(play.file); return r.text();})
      .then(html=>{
        playTitle.textContent=play.title;
        playContainer.innerHTML=html;
      })
      .catch(err=>{
        console.error(err);
        playTitle.textContent='Error loading play';
        playContainer.innerHTML='';
      });
  }

  /* ----------  B. line / syllable toggles  ---------- */
  const bodyEl = document.body;
  const chkLines     = document.getElementById('toggle-lines');
  const chkSyllables = document.getElementById('toggle-syllables');

  chkLines.addEventListener('change',()=>{
    bodyEl.classList.toggle('show-lines', chkLines.checked);
    bodyEl.classList.toggle('hide-lines', !chkLines.checked);
  });
  chkSyllables.addEventListener('change',()=>{
    bodyEl.classList.toggle('show-syllables', chkSyllables.checked);
    bodyEl.classList.toggle('hide-syllables', !chkSyllables.checked);
  });

  /* set initial classes to match default check-box state */
  bodyEl.classList.add('show-lines','hide-syllables');
});
