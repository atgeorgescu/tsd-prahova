const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const _q=document.querySelector.bind(document);
function tt(){const t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;localStorage.setItem('t',t)}
$$('#menu a').forEach(a=>a.onclick=()=>menu.classList.remove('on'));
const TL={municipiu:'Municipiu',oras:'Oraș',comuna:'Comună'};let F='';
function draw(){const q=$('#q').value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const r=UAT.filter(u=>(!F||u.t===F)&&u.n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));
 $('#cnt').textContent=r.length+' din 104 localități';
 $('#loc').innerHTML=r.map(u=>`<div class="card" onclick="loc('${u.n}','${u.t}')"><span class="tag ${u.t==='comuna'?'g':''}">${TL[u.t]}</span><h4 style="margin:.4em 0 .1em">${u.n}</h4><small style="color:var(--mut)">Președinte: Nume Prenume</small></div>`).join('')}
if($('#q')){$('#q').oninput=draw;$$('.filters button').forEach(b=>b.onclick=()=>{$$('.filters button').forEach(x=>x.classList.remove('on'));b.classList.add('on');F=b.dataset.f;draw()});draw();}
function loc(n,t){$('#modt').innerHTML=`<b>TSD ${n}</b> (${TL[t]})<br>Președinte organizație locală: <i>Nume Prenume (de completat)</i><br>Contact: <i>de completat</i>`;$('#modb').innerHTML=`<a class="btn" href="implica-te.html" onclick="mod.classList.remove('on');setLoc('${n}')">Înscrie-te în TSD ${n}</a>`;mod.classList.add('on')}
function setLoc(n){$$('.selloc').forEach(s=>s.value=n)}
$$('.selloc').forEach(s=>s.innerHTML='<option value="">Alege localitatea…</option>'+UAT.slice().sort((a,b)=>a.n.localeCompare(b.n,'ro')).map(u=>`<option>${u.n}</option>`).join(''));
const roles=['Președinte TSD Prahova','Prim-vicepreședinte','Vicepreședinte','Vicepreședinte','Secretar general','Responsabil comunicare'];
if($('#team'))$('#team').innerHTML=roles.map(r=>`<div class="card ph"><div class="av">👤</div><h3>Nume Prenume</h3><p style="margin:0">${r}</p></div>`).join('');
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');['m','v','b'].forEach(k=>$('#t-'+k).style.display=k===b.dataset.t?'':'none')});
if($('#age'))$('#age').oninput=e=>$('#guard').style.display=(+e.target.value&&+e.target.value<18)?'':'none';
function deliver(subj,body){const m=`mailto:${CFG.email}?subject=${encodeURIComponent('[TSD Prahova] '+subj)}&body=${encodeURIComponent(body)}`;
 const w=CFG.whatsapp?`https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(subj+'\n'+body)}`:'';
 $('#modt').textContent='Se deschide aplicația de e-mail cu mesajul completat. Apasă „Trimite” acolo.';
 $('#modb').innerHTML=`<a class="btn" href="${m}">Deschide e-mailul</a> ${w?`<a class="btn" href="${w}" target="_blank">Trimite pe WhatsApp</a>`:''}`;mod.classList.add('on');location.href=m}
function send(e,subj){e.preventDefault();const fd=new FormData(e.target);let b='';for(const[k,v]of fd)if(v&&k!=='on')b+=`${k}: ${v}\n`;deliver(subj,b);e.target.reset();return false}
function nl(e){e.preventDefault();deliver('Abonare evenimente','E-mail: '+e.target.email.value);return false}
const P=['Locuri de muncă pentru tineri','Transport între localități','Școli și educație','Sport și spații de joacă','Mediu și Valea Prahovei curată','Internet și digitalizare','Locuințe pentru tineri','Cultură și evenimente'];let S=[];
if($('#bus'))$('#bus').innerHTML=P.map((p,i)=>`<button class="card" style="cursor:pointer;text-align:left;font:inherit;color:var(--ink)" id="p${i}" onclick="pick(${i})">${p}</button>`).join('');
function pick(i){S.includes(i)?S=S.filter(x=>x!==i):S.length<3&&S.push(i);P.forEach((_,j)=>$('#p'+j).style.borderColor=S.includes(j)?'var(--r)':'');$('#busr').textContent=S.length?'Prioritățile tale: '+S.map(x=>P[x]).join(', '):''}
function busSend(){if(!S.length)return alert('Alege cel puțin o prioritate');deliver('Busola Prahovei',S.map(x=>P[x]).join('\n'))}
if($('#cmail')){$('#cmail').textContent=CFG.email;$('#cmail').href='mailto:'+CFG.email;$('#ctel').textContent=CFG.telefon;$('#cadr').textContent=CFG.adresa;
$('#soc').innerHTML=['facebook','instagram','tiktok'].map(s=>`<a href="${CFG[s]}">${s[0].toUpperCase()+s.slice(1)}</a>`).join(' · ');}
