/* AIMC - shared header/footer/nav injector + mobile menu */
(function(){
 const PAGES = [
 {href:'index.html',label:'Accueil'},
 {href:'manifeste.html',label:'Manifeste'},
 {href:'bureau.html',label:'Bureau'},
 {href:'lab.html',label:'Lab'},
 {href:'contenu.html',label:'Contenu'},
 {href:'jobs.html',label:'Jobs'},
 {href:'partenaires.html',label:'Partenaires'},
 {href:'contact.html',label:'Contact'},
 ];
 const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

 // Boot log rotator (subtle)
 const messages = [
 ['$ BOOT: aimc.dev v0.1.0', 'READY.'],
 ['$ init aimc.membership', 'OK.'],
 ['$ load manifest', 'DONE.'],
 ['$ open lab doors', 'WELCOME.'],
 ['$ 2h du matin', 'toujours là.'],
 ];
 const msg = messages[Math.floor(Math.random()*messages.length)];

 // Inject SVG logo sprite once (fetch + insert at body start)
 if(!document.getElementById('aimc-logos')){
 fetch('assets/logos.svg').then(r => r.text()).then(txt => {
 const div = document.createElement('div');
 div.id = 'aimc-logos';
 div.style.display = 'none';
 div.innerHTML = txt;
 document.body.insertBefore(div, document.body.firstChild);
 }).catch(() => {});
 }

 // HEADER
 const header = document.querySelector('[data-header]');
 if(header){
 const navHtml = PAGES.map(p => {
 const active = p.href === current ? ' class="active"' : '';
 return '<a href="'+p.href+'"'+active+'>'+p.label+'</a>';
 }).join('');
 header.innerHTML = `
 <div class="container">
 <div class="brand-block">
 <a href="index.html" class="brand">AIMC<span class="lime">.</span></a>
 <div class="claim">AI Makers Club,<br>ceux qui font.</div>
 <div class="tagline"><span class="p">${msg[0]}</span> · <span class="ok">${msg[1]}</span><span class="cursor-caret" aria-hidden="true"></span></div>
 </div>
 <nav class="nav" id="site-nav">
 ${navHtml}
 <a href="adherer.html" class="btn-nav">Adhérer</a>
 </nav>
 <button class="nav-toggle" onclick="document.getElementById('site-nav').classList.toggle('open')">MENU</button>
 </div>
 `;
 }

 // FOOTER
 const footer = document.querySelector('[data-footer]');
 if(footer){
 footer.innerHTML = `
 <div class="container">
 <div class="grid-footer">
 <div class="brand-block">
 <a href="index.html"><span class="brand" style="font-size:24px;display:block;margin-bottom:12px;">AIMC<span class="lime">.</span></span>
 <div class="claim" style="margin-bottom:12px;">AI Makers Club,<br>ceux qui font.</div></a>
 <p>AI Makers Club - association loi 1901 des builders IA francophones. Démos, benchmarks, retours terrain. Pas un cabinet de conseil déguisé.</p>
 </div>
 <div>
 <h5>Explorer</h5>
 <ul>
 <li><a href="manifeste.html">Manifeste</a></li>
 <li><a href="bureau.html">Le bureau</a></li>
 <li><a href="lab.html">Le lab</a></li>
 <li><a href="contenu.html">Contenu</a></li>
 <li><a href="jobs.html">Job board</a></li>
 </ul>
 </div>
 <div>
 <h5>Rejoindre</h5>
 <ul>
 <li><a href="adherer.html">Adhérer</a></li>
 <li><a href="partenaires.html">Partenaires</a></li>
 <li><a href="contact.html">Contact</a></li>
 <li><a href="#">Statuts loi 1901 (PDF)</a></li>
 </ul>
 </div>
 <div>
 <h5>Suivre</h5>
 <ul>
 <li><a href="#">LinkedIn</a></li>
 <li><a href="#">Newsletter</a></li>
 <li><a href="#">GitHub</a></li>
 <li><a href="#">Mentions légales</a></li>
 </ul>
 </div>
 </div>
 <div class="legal">
 <div><span class="lime">$</span> aimc.dev - 2026 · association loi 1901 · en cours de constitution</div>
 <div>Made with care par ceux qui font.</div>
 </div>
 </div>
 `;
 }

 // NEG banner - cascade au scroll (une ligne lime à la fois)
 const negList = document.getElementById('neg-list');
 if(negList){
 const lines = [...negList.querySelectorAll('.neg-line')];
 const banner = document.getElementById('neg-banner');
 const setActive = (idx) => {
 lines.forEach((el,i) => {
 el.classList.remove('active','past','dim-1','dim-2');
 if(i === idx){ el.classList.add('active'); }
 else if(i < idx){ el.classList.add('past'); }
 else{
 const d = i - idx;
 if(d === 1) el.classList.add('dim-2');
 else if(d === 2) el.classList.add('dim-1');
 }
 });
 };
 setActive(0);
 const onScroll = () => {
 const rect = banner.getBoundingClientRect();
 const vh = window.innerHeight;
 const total = rect.height + vh;
 const seen = vh - rect.top;
 const p = Math.max(0, Math.min(1, seen / total));
 const eased = Math.max(0, Math.min(1, (p - 0.15) / 0.70));
 const idx = Math.min(lines.length - 1, Math.floor(eased * lines.length));
 setActive(idx);
 };
 let ticking = false;
 window.addEventListener('scroll', () => {
 if(!ticking){
 requestAnimationFrame(() => { onScroll(); ticking = false; });
 ticking = true;
 }
 }, {passive:true});
 onScroll();
 }

 // Scroll reveal — fade-in sections au scroll
 const revealEls = document.querySelectorAll('.pilier,.card-content,.plan,.lab-card,.pilier,.faq-item');
 revealEls.forEach(el => el.classList.add('reveal'));
 const revealObs = new IntersectionObserver((entries) => {
 entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
 }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
 revealEls.forEach(el => revealObs.observe(el));

 // Motion system — reveal-term, card-reveal, h-underline, neg-cascade, terminal-line
 // Auto-apply neg-cascade sur les .neg-line existantes (bandeau négatif)
 document.querySelectorAll('.neg-line').forEach(el => el.classList.add('neg-cascade'));

 const motionEls = document.querySelectorAll('.reveal-term, .card-reveal, .h-underline, .neg-cascade, .terminal-line');
 const motionObs = new IntersectionObserver((entries) => {
 entries.forEach(e => {
 if(e.isIntersecting){
 if(e.target.classList.contains('neg-cascade')){
 e.target.classList.add('active');
 } else {
 e.target.classList.add('visible');
 }
 motionObs.unobserve(e.target);
 }
 });
 }, {threshold:0.35, rootMargin:'0px 0px -60px 0px'});
 motionEls.forEach(el => motionObs.observe(el));

 // Auto-apply h-underline sur les h2 de sec-head sans opt-out
 document.querySelectorAll('.sec-head h2:not(.no-underline)').forEach(h => {
 h.classList.add('h-underline');
 motionObs.observe(h);
 });

 // FAQ accordion
 document.querySelectorAll('.faq-item').forEach(item => {
 item.addEventListener('click', () => item.classList.toggle('open'));
 });

 // Filters
 document.querySelectorAll('.filters').forEach(bar => {
 bar.addEventListener('click', e => {
 if(!e.target.matches('.filter')) return;
 // Toggle active
 bar.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
 e.target.classList.add('active');

 const filter = e.target.textContent.trim();
 const grid = document.querySelector('.grid-content');
 if(!grid) return;
 const cards = grid.querySelectorAll('.card-content');
 cards.forEach(card => {
 if(filter === 'Tout') { card.style.display = ''; return; }
 const tagEl = card.querySelector('.tag');
 if(!tagEl) { card.style.display = ''; return; }
 const tagText = tagEl.textContent.trim();
 if(tagText === filter) { card.style.display = ''; }
 else { card.style.display = 'none'; }
 });
 });
 });
})();
