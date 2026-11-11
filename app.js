const $=id=>document.getElementById(id);let records=[];const sourceMeta={usace:{title:'USACE Plant List',note:'Source: user-provided Army Corps of Engineers Plants spreadsheet. 4,233 rows loaded. The indicator status is displayed exactly as provided in the spreadsheet.'},sfwmd:{title:'SFWMD Vegetative Index (FDEP Manual)',note:'Source: Appendix B, “The Vegetative Index,” FDEP Delineation Manual, printed pages 175–191. This table was transcribed from the supplied PDF using OCR; verify the printed source for critical determinations. “U” and “Keys only” notes are retained where legible.'}};
// Expandable wetland indicator status guide
$('sourceinfo').insertAdjacentHTML('afterend', `
  <details class="status-guide">
    <summary>What do the status codes mean?</summary>
    <div class="status-guide-content">
      <p class="status-guide-intro">These ratings describe how often a plant is associated with wetlands versus non-wetlands.</p>
      <div class="status-guide-row">
        <span class="rating OBL">OBL</span>
        <div><strong>Obligate Wetland</strong><p>Almost always occurs in wetlands.</p></div>
      </div>
      <div class="status-guide-row">
        <span class="rating FACW">FACW</span>
        <div><strong>Facultative Wetland</strong><p>Usually occurs in wetlands, but may occur in non-wetlands.</p></div>
      </div>
      <div class="status-guide-row">
        <span class="rating FAC">FAC</span>
        <div><strong>Facultative</strong><p>Occurs in wetlands and non-wetlands.</p></div>
      </div>
      <div class="status-guide-row">
        <span class="rating FACU">FACU</span>
        <div><strong>Facultative Upland</strong><p>Usually occurs in non-wetlands, but may occur in wetlands.</p></div>
      </div>
      <div class="status-guide-row">
        <span class="rating UPL">UPL</span>
        <div><strong>Upland</strong><p>Almost always occurs in non-wetlands.</p></div>
      </div>
      <p class="status-guide-note"><strong>U:</strong> This appears in the supplied source data. It is not one of the five standard USACE National Wetland Plant List categories, so the original notation is retained rather than assigning it a meaning.</p>
      <p class="status-guide-note">Indicator status is one piece of wetland vegetation evidence; it does not determine whether a site is a wetland by itself. For project decisions, consult the applicable source and regional guidance.</p>
    </div>
  </details>
`);

async function load(){const s=$('source').value;$('results').innerHTML='<div class="empty">Loading plant list…</div>';try{const r=await fetch(`data/${s}.json`);if(!r.ok)throw Error('Could not load data');records=await r.json();$('sourceinfo').textContent=sourceMeta[s].note;render()}catch(e){$('results').innerHTML='<div class="empty">The plant data could not be loaded. Open the site through GitHub Pages and refresh.</div>';$('count').textContent=''}}function render(){const q=$('search').value.trim().toLowerCase();const rating=$('rating').value;const filtered=records.filter(x=>(rating==='all'||x.rating===rating)&&(!q||x.searchText.includes(q)||x.scientificName.toLowerCase().includes(q)||x.commonName.toLowerCase().includes(q)));$('count').textContent=`${filtered.length.toLocaleString()} of ${records.length.toLocaleString()} entries`;const shown=filtered.slice(0,150);$('results').innerHTML=shown.length?shown.map(x=>`<article class="result"><div class="names"><div class="sci">${esc(x.scientificName)}</div><div class="common">${esc(x.commonName||'Common name not listed')}</div>${x.qualifier?`<div class="qualifier">${esc(x.qualifier)}</div>`:''}</div><div class="rating ${esc(x.rating)}">${esc(x.rating)}</div></article>`).join(''):'<div class="empty">No matching plants. Try another spelling or clear the status filter.</div>';if(filtered.length>150)$('results').insertAdjacentHTML('beforeend',`<div class="empty">Showing first 150 matches. Refine your search to narrow the results.</div>`)}function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}$('source').addEventListener('change',load);$('search').addEventListener('input',render);$('rating').addEventListener('change',render);if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));load();