(function(){
const L=(window.UAT||[]).map(u=>u.n),norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const css=`#tc-b{position:fixed;right:20px;bottom:20px;z-index:95;width:60px;height:60px;border-radius:50%;background:#e30613;color:#fff;border:0;font-size:26px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.2)}
#tc{position:fixed;right:20px;bottom:92px;z-index:96;width:370px;max-width:calc(100vw - 24px);height:540px;max-height:calc(100vh - 120px);background:var(--bg,#fff);color:var(--ink,#111);border:1px solid #111;display:none;flex-direction:column;box-shadow:0 18px 50px rgba(0,0,0,.18);font-size:15px}
#tc.on{display:flex}#tc header{position:static;background:#0a0a0a;color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;border:0;border-bottom:3px solid #e30613}#tc header b{font-size:15px}#tc header button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer}
#tc-m{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:8px}.tm{max-width:85%;padding:10px 13px;line-height:1.45;white-space:pre-line}.tm.bot{background:var(--sf,#f4f4f4);align-self:flex-start}.tm.me{background:#e30613;color:#fff;align-self:flex-end}
#tc-q{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 8px}#tc-q button{border:1px solid #e30613;background:none;color:#e30613;padding:6px 11px;cursor:pointer;font:inherit;font-size:13px}#tc-q button:hover{background:#e30613;color:#fff}
#tc form{display:flex;border-top:1px solid #ddd;margin:0;gap:0;grid-template-columns:none}#tc input{flex:1;border:0;padding:13px;font:inherit;background:transparent;color:inherit}#tc form button{border:0;background:#e30613;color:#fff;padding:0 16px;cursor:pointer;font-weight:700}
#tc-s{position:relative}#tc-ac{position:absolute;bottom:100%;left:0;right:0;background:var(--bg,#fff);border:1px solid #ddd;max-height:160px;overflow:auto;display:none}#tc-ac div{padding:8px 12px;cursor:pointer}#tc-ac div:hover{background:#e30613;color:#fff}`;
document.head.insertAdjacentHTML('beforeend','<style>'+css+'</style>');
document.body.insertAdjacentHTML('beforeend',`<button id="tc-b" aria-label="Asistent TSD">💬</button><div id="tc" role="dialog" aria-label="Asistent TSD Prahova"><header><b>Asistent TSD Prahova</b><button aria-label="Închide">×</button></header><div id="tc-m"></div><div id="tc-q"></div><div id="tc-s"><div id="tc-ac"></div><form><input placeholder="Scrie aici…" autocomplete="off"><button>➤</button></form></div></div>`);
const W=document.getElementById('tc'),M=document.getElementById('tc-m'),Q=document.getElementById('tc-q'),F=W.querySelector('form'),I=F.querySelector('input'),AC=document.getElementById('tc-ac');
const say=(t,c='bot')=>{const d=document.createElement('div');d.className='tm '+c;d.textContent=t;M.appendChild(d);M.scrollTop=1e9};
const quick=a=>{Q.innerHTML='';(a||[]).forEach(x=>{const b=document.createElement('button');b.type='button';b.textContent=x;b.onclick=()=>handle(x);Q.appendChild(b)})};
let D={},step=-1,started=false;
const yes=v=>/^(da|d|yes|y|sigur|ok|vreau)\b/i.test(norm(v)),no=v=>/^(nu|n|no)\b/i.test(norm(v));
const S=[
{k:'Nume',q:'Cum te numești? (nume și prenume)',v:x=>x.trim().split(/\s+/).length>=2&&x.length<=80||'Te rog scrie numele complet (nume și prenume).'},
{k:'Vârstă',q:'Câți ani ai?',v:x=>{const n=parseInt(x);return(n>=14&&n<=35)||'Vârsta trebuie să fie un număr între 14 și 35.'},f:x=>String(parseInt(x))},
{k:'Părinte/tutore',q:'Pentru că ai sub 18 ani, am nevoie de numele unui părinte sau tutore.',if:()=>+D['Vârstă']<18,v:x=>x.trim().split(/\s+/).length>=2||'Scrie numele complet al părintelui.'},
{k:'Telefon părinte',q:'Numărul de telefon al părintelui/tutorelui?',if:()=>+D['Vârstă']<18,v:x=>/^(\+?40|0)7\d{8}$/.test(x.replace(/[\s.-]/g,''))||'Număr invalid. Exemplu: 07xx xxx xxx.',f:x=>x.replace(/[\s.-]/g,'')},
{k:'Acord părinte',q:'Confirmi că părintele/tutorele este de acord cu înscrierea ta?',qr:['Da','Nu'],if:()=>+D['Vârstă']<18,v:x=>yes(x)||'Fără acordul părintelui nu putem finaliza înscrierea. Răspunde „Da” când îl ai.',f:()=>'Da'},
{k:'Localitate',q:'Din ce localitate din Prahova ești? Începe să scrii și alege din listă.',ac:1,v:x=>L.find(l=>norm(l)===norm(x))?true:'Nu găsesc localitatea în lista celor 104 din Prahova. Alege din sugestii.',f:x=>L.find(l=>norm(l)===norm(x))},
{k:'E-mail',q:'Care e adresa ta de e-mail?',v:x=>/^\S+@\S+\.\S{2,}$/.test(x.trim())||'Adresa de e-mail nu pare validă.',f:x=>x.trim()},
{k:'Telefon',q:'Și un număr de telefon?',v:x=>/^(\+?40|0)7\d{8}$/.test(x.replace(/[\s.-]/g,''))||'Număr invalid. Exemplu: 07xx xxx xxx.',f:x=>x.replace(/[\s.-]/g,'')},
{k:'Direcție de interes',q:'Ce direcție te interesează cel mai mult?',qr:['Mediu','Educație','Siguranța tinerilor','Sport'],v:x=>['mediu','educatie','siguranta tinerilor','sport'].includes(norm(x))||'Alege una dintre cele patru direcții.',f:x=>['Mediu','Educație','Siguranța tinerilor','Sport'].find(o=>norm(o)===norm(x))},
{k:'Vreau să fiu și voluntar',q:'Vrei să fii și voluntar la acțiunile noastre?',qr:['Da','Nu'],v:x=>yes(x)||no(x)||'Răspunde cu Da sau Nu.',f:x=>yes(x)?'Da':'Nu'},
{k:'Mesaj',q:'De ce vrei să te implici? (sau scrie „-” ca să sari)',qr:['Sari peste'],v:()=>true,f:x=>/^(-|sari peste)$/i.test(x.trim())?'':x},
{k:'Recomandat de',q:'Te-a recomandat cineva? (sau „-”)',qr:['Nimeni'],v:()=>true,f:x=>/^(-|nimeni|nu)$/i.test(x.trim())?'':x},
{k:'Acord GDPR',q:'Ești de acord ca TSD Prahova să prelucreze aceste date pentru înscriere, conform politicii de confidențialitate (tsd-prahova.onrender.com/confidentialitate.html)?',qr:['Da, sunt de acord','Nu'],v:x=>yes(x)||'Fără acord nu putem salva înscrierea. Răspunde „Da” dacă ești de acord.',f:()=>'Da'}];
function next(){step++;while(step<S.length&&S[step].if&&!S[step].if())step++;
 if(step>=S.length){const sum=Object.entries(D).filter(([k,v])=>v).map(([k,v])=>k+': '+v).join('\n');say('Verifică datele:\n\n'+sum);say('Totul e corect?');quick(['Da, trimite','Reîncep']);step=99;return}
 const s=S[step];say(s.q);quick(s.qr);I.focus()}
async function handle(v){v=String(v).trim();if(!v)return;say(v,'me');I.value='';AC.style.display='none';
 if(step===-1){if(yes(v)||/înscriu|inscriu|membru/i.test(v)){say('Super! Îți pun câteva întrebări, pe rând. Durează un minut.');next()}else if(/intreb|faq/i.test(norm(v))){say('Găsești răspunsurile la Întrebări frecvente.');location.href='intrebari.html'}else if(/directi/i.test(norm(v))){say('Ne concentrăm pe Mediu, Educație, Siguranța tinerilor și Sport.');location.href='directii.html'}else{say('Nicio problemă! Dacă te răzgândești, scrie „Da” oricând.');quick(['Da, vreau să mă înscriu'])}return}
 if(step===99){if(yes(v)){quick();say('Se trimite…');let ok=false;try{const r=await fetch(((window.CFG&&CFG.api)||'')+'/api/submit.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:'Adeziune',source:'chat',data:D})});ok=(await r.json()).ok}catch(e){}
   if(ok){say('Gata! Înscrierea ta a fost înregistrată. 🎉 Te contactează în curând cineva din echipa TSD Prahova.');sessionStorage.tcDone=1;step=100}else{say('N-am reușit să trimit acum. Încearcă din nou sau folosește formularul de pe pagina Implică-te.');quick(['Da, trimite'])}}
  else{D={};step=-1;say('Bine, reluăm.');next()}return}
 if(step===100){say('Ești deja înscris. Mulțumim!');return}
 const s=S[step],r=s.v(v);if(r!==true){say(r);quick(s.qr);return}D[s.k]=s.f?s.f(v):v;next()}
F.onsubmit=e=>{e.preventDefault();handle(I.value)};
I.oninput=()=>{if(step<0||step>=S.length||!S[step].ac){AC.style.display='none';return}const q=norm(I.value);if(!q){AC.style.display='none';return}
 const m=L.filter(l=>norm(l).includes(q)).slice(0,8);AC.innerHTML=m.map(l=>`<div>${l}</div>`).join('');AC.style.display=m.length?'block':'none';[...AC.children].forEach(d=>d.onclick=()=>handle(d.textContent))};
function open_(){W.classList.add('on');if(!started){started=true;say('Salut! 👋 Sunt asistentul TSD Prahova.');say('Vrei să te alături tinerilor care schimbă Prahova? Te pot înscrie chiar aici, în mai puțin de un minut.');quick(['Da, vreau să mă înscriu','Ce direcții aveți?','Mai târziu'])}}
document.getElementById('tc-b').onclick=()=>W.classList.contains('on')?W.classList.remove('on'):open_();W.querySelector('header button').onclick=()=>W.classList.remove('on');
if(!sessionStorage.tcAuto){setTimeout(()=>{if(!sessionStorage.tcAuto){sessionStorage.tcAuto=1;if(!W.classList.contains('on'))open_()}},15000)}
})();
