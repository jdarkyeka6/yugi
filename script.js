const home = document.getElementById('home');
const experience = document.getElementById('experience');
const content = document.getElementById('experienceContent');
const rarityEl = document.getElementById('rarity');
const thingNumber = document.getElementById('thingNumber');
const chaosButton = document.getElementById('chaosButton');
const nextButton = document.getElementById('nextButton');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const toast = document.getElementById('toast');

const defaults = { presses: 0, seen: [], achievements: [], streak: 0, bestStreak: 0, secrets: 0 };
const state = Object.assign({}, defaults, JSON.parse(localStorage.getItem('yugiState') || '{}'));
function save(){ localStorage.setItem('yugiState', JSON.stringify(state)); updateAchievementCount(); }
function showToast(msg){ toast.textContent = msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1800); }
function unlock(id, label){ if(!state.achievements.includes(id)){ state.achievements.push(id); save(); showToast('🏆 ' + label); } }
function updateAchievementCount(){ document.getElementById('achievementCount').textContent = state.achievements.length; }

const experiences = [
  {
    id:'runaway', rarity:'COMMON', title:'Click the button.',
    render(){ content.innerHTML=`<h2>Click the button.</h2><p>It has absolutely no reason to distrust you.</p><button class="play-button runaway" id="runaway">CLICK ME</button>`; const b=document.getElementById('runaway'); let escapes=0; b.addEventListener('mouseenter',()=>{ if(escapes<6){ b.style.transform=`translate(${Math.random()*320-160}px,${Math.random()*180-90}px)`; escapes++; } }); b.onclick=()=>{unlock('caught','Faster Than A Button'); b.textContent='...fine.'}; }
  },
  {
    id:'red', rarity:'UNCOMMON', title:'Do not press the red button.',
    render(){ content.innerHTML=`<h2>Do not press it.</h2><p>Seriously. This is the entire instruction.</p><button class="play-button" id="redBtn" style="background:#8c1d1d">RED BUTTON</button><p id="redText"></p>`; let n=0; document.getElementById('redBtn').onclick=()=>{n++; document.getElementById('redText').textContent=['Why.','You had one job.','Again??','This is becoming a personality trait.','Fine. You win.'][Math.min(n-1,4)]; if(n===5) unlock('red5','Professional Button Presser');}; }
  },
  {
    id:'guess', rarity:'COMMON', title:'Guess the number.',
    render(){ const target=Math.floor(Math.random()*10)+1; content.innerHTML=`<h2>1 to 10.</h2><p>I picked one. You get three shots.</p><div class="choices" id="nums"></div><p id="guessResult"></p>`; let tries=3; const nums=document.getElementById('nums'); for(let i=1;i<=10;i++){ const b=document.createElement('button'); b.className='choice'; b.textContent=i; b.onclick=()=>{ if(!tries)return; tries--; if(i===target){document.getElementById('guessResult').textContent='Correct. Suspiciously competent.'; unlock('number','Mind Reader-ish'); tries=0;} else document.getElementById('guessResult').textContent=tries?`${i<target?'Higher':'Lower'}. ${tries} left.`:`It was ${target}. Tragic.`;}; nums.appendChild(b);} }
  },
  {
    id:'hold', rarity:'COMMON', title:'Hold it.',
    render(){ content.innerHTML=`<h2>Hold for exactly 3 seconds.</h2><p>Release when your soul says “three”.</p><button class="play-button" id="holdBtn">HOLD</button><p id="holdResult"></p>`; let start; const b=document.getElementById('holdBtn'); b.onpointerdown=()=>{start=performance.now(); b.textContent='HOLDING...'}; b.onpointerup=()=>{const sec=(performance.now()-start)/1000; document.getElementById('holdResult').textContent=`${sec.toFixed(3)}s`; if(Math.abs(sec-3)<.12)unlock('clock','Human Stopwatch'); b.textContent='TRY AGAIN';}; }
  },
  {
    id:'coin', rarity:'COMMON', title:'The least useful market.',
    render(){ let price=100; content.innerHTML=`<h2>Chicken Nugget Coin</h2><p>CNUG is definitely a serious financial instrument.</p><div style="font-size:58px;font-weight:900" id="price">$100.00</div><button class="play-button" id="market">ADVANCE MARKET</button><p id="marketText">Your portfolio is spiritually diversified.</p>`; document.getElementById('market').onclick=()=>{price*=Math.random()<.35?(Math.random()*.35+.02):(Math.random()*1.25+.7); document.getElementById('price').textContent='$'+price.toFixed(2); document.getElementById('marketText').textContent=price<20?'CNUG has encountered a nugget-related liquidity event.':price>300?'Experts are confused and afraid.':'Markets have done a market.';}; }
  },
  {
    id:'captcha', rarity:'UNCOMMON', title:'Prove you are human.',
    render(){ content.innerHTML=`<h2>Human verification</h2><p>Select every square containing emotional stability.</p><div class="choices">${['Monday','Printer ink','Group projects','3% battery','Warm bread','Taxes'].map(x=>`<button class="choice captcha">${x}</button>`).join('')}</div><p id="capResult"></p>`; document.querySelectorAll('.captcha').forEach(b=>b.onclick=()=>{document.getElementById('capResult').textContent=b.textContent==='Warm bread'?'Verification accepted. Barely.':'Incorrect. Extremely robotic behaviour.'; if(b.textContent==='Warm bread')unlock('human','Probably Human');}); }
  },
  {
    id:'reaction', rarity:'COMMON', title:'Reaction test.',
    render(){ content.innerHTML=`<h2 id="reactTitle">Wait for green.</h2><button class="play-button" id="reactBtn">WAIT...</button><p id="reactResult"></p>`; const b=document.getElementById('reactBtn'); let ready=false,start; const delay=1000+Math.random()*3000; const t=setTimeout(()=>{ready=true;start=performance.now();b.textContent='CLICK!';b.style.background='#1e7a43';},delay); b.onclick=()=>{if(!ready){clearTimeout(t);document.getElementById('reactResult').textContent='Too early. Your finger has betrayed you.';}else{const ms=Math.round(performance.now()-start);document.getElementById('reactResult').textContent=ms+' ms'; if(ms<250)unlock('fast','Dangerously Fast'); ready=false;}}; }
  },
  {
    id:'truth', rarity:'UNCOMMON', title:'Important question.',
    render(){ content.innerHTML=`<h2>Would you rather...</h2><p>Have perfect Wi‑Fi forever, but every chair squeaks loudly when you sit down, OR silent chairs forever, but Wi‑Fi drops for 10 seconds every hour?</p><div class="choices"><button class="choice">PERFECT WI‑FI</button><button class="choice">SILENT CHAIRS</button></div><p id="truthResult"></p>`; document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>document.getElementById('truthResult').textContent=b.textContent==='PERFECT WI‑FI'?'Correct. Society can endure the squeak.':'Bold. Incorrect, but bold.'); }
  },
  {
    id:'slider', rarity:'COMMON', title:'Set it to 42.',
    render(){ content.innerHTML=`<h2>Set this to exactly 42.</h2><input id="slider" type="range" min="0" max="100" value="50" style="width:min(600px,90%)"><div style="font-size:52px;font-weight:900" id="slideVal">50</div>`; const s=document.getElementById('slider'); s.oninput=()=>{document.getElementById('slideVal').textContent=s.value;if(s.value==='42')unlock('42','The Answer');}; }
  },
  {
    id:'memory', rarity:'UNCOMMON', title:'Memory.exe',
    render(){ const seq=Array.from({length:6},()=>Math.floor(Math.random()*9)+1).join(' '); content.innerHTML=`<h2>Remember this.</h2><div id="seq" style="font-size:48px;font-weight:900;letter-spacing:.15em">${seq}</div><button class="play-button" id="memStart">I GOT IT</button>`; document.getElementById('memStart').onclick=()=>{document.getElementById('seq').innerHTML=`<input class="mini-input" id="memInput" placeholder="type the six numbers"> <button class="choice" id="memCheck">CHECK</button>`; document.getElementById('memCheck').onclick=()=>{if(document.getElementById('memInput').value.trim()===seq){unlock('memory','RAM Installed'); showToast('Correct 🔥')}else showToast('Nope. It was '+seq);};}; }
  },
  {
    id:'percent', rarity:'RARE', title:'The completely scientific vibe scanner.',
    render(){ content.innerHTML=`<h2>Vibe Scanner</h2><p>Place your cursor or finger on the scanner.</p><button class="play-button" id="scan">SCAN MY VIBE</button><div class="meter"><div id="scanMeter"></div></div><p id="scanText"></p>`; document.getElementById('scan').onclick=()=>{let v=0;const bar=document.getElementById('scanMeter');const timer=setInterval(()=>{v+=4;bar.style.width=v+'%';if(v>=100){clearInterval(timer);const score=Math.floor(Math.random()*101);document.getElementById('scanText').textContent=`Vibe integrity: ${score}%. ${score>80?'Alarmingly powerful.':score<20?'Please reboot your aura.':'Acceptable levels detected.'}`;}},35)}; }
  },
  {
    id:'choice', rarity:'RARE', title:'Pick one.',
    render(){ const doors=['DOOR A','DOOR B','SUSPICIOUS VENT']; content.innerHTML=`<h2>You wake up in a room.</h2><p>No context. Three exits. Pick.</p><div class="choices">${doors.map(x=>`<button class="choice door">${x}</button>`).join('')}</div><p id="doorResult"></p>`; document.querySelectorAll('.door').forEach(b=>b.onclick=()=>{const outcomes={"DOOR A":'You escape. Weirdly easy.',"DOOR B":'It is another identical room. Incredible.',"SUSPICIOUS VENT":'You find a packet of chips and freedom. Best ending.'};document.getElementById('doorResult').textContent=outcomes[b.textContent];if(b.textContent==='SUSPICIOUS VENT')unlock('vent','Vent Enthusiast');}); }
  },
  {
    id:'void', rarity:'LEGENDARY', title:'The Void',
    render(){ content.innerHTML=`<h2 style="font-size:90px">.</h2><p>Congratulations. You found almost nothing.</p><button class="play-button" id="voidBtn">touch the void</button>`; document.getElementById('voidBtn').onclick=()=>{state.secrets++;save();unlock('void','Touched The Void');document.body.style.filter='invert(1)';setTimeout(()=>document.body.style.filter='',650)}; }
  },
  {
    id:'password', rarity:'RARE', title:'Guess the password.',
    render(){ content.innerHTML=`<h2>Super Secure Vault</h2><p>Hint: the password is extremely secure.</p><input class="mini-input" id="pw" placeholder="password"><button class="choice" id="pwBtn">UNLOCK</button><p id="pwResult"></p>`; document.getElementById('pwBtn').onclick=()=>{const v=document.getElementById('pw').value.toLowerCase();const ok=['password','password123','1234'].includes(v);document.getElementById('pwResult').textContent=ok?'Access granted. Cybersecurity has left the building.':'Denied.';if(ok)unlock('vault','Elite Hacker');}; }
  },
  {
    id:'nothing', rarity:'WHY DOES THIS EXIST', title:'Nothing button.',
    render(){ content.innerHTML=`<h2>This button does nothing.</h2><p>That is not a challenge. It literally does nothing.</p><button class="play-button" id="nothing">DO NOTHING</button><p id="nothingText"></p>`; let n=0;document.getElementById('nothing').onclick=()=>{n++;if(n===10){document.getElementById('nothingText').textContent='You pressed a useless button ten times. I respect the commitment.';unlock('nothing','Persistent For No Reason');}}; }
  }
];

function weightedPick(){
  const weights={COMMON:45,UNCOMMON:28,RARE:17,LEGENDARY:8,'WHY DOES THIS EXIST':2};
  const pool=[]; experiences.forEach(e=>{for(let i=0;i<weights[e.rarity];i++)pool.push(e)}); return pool[Math.floor(Math.random()*pool.length)];
}

function showRandom(){
  state.presses++;
  if(state.presses===1) unlock('first','Pressed The Button');
  if(state.presses>=25) unlock('25','Still Here?');
  if(state.presses>=100) unlock('100','Internet Archaeologist');
  let item=weightedPick(); let guard=0; while(state.seen.length>1 && item.id===state.seen[state.seen.length-1] && guard++<10)item=weightedPick();
  state.seen.push(item.id); state.seen=state.seen.slice(-100);
  if(new Set(state.seen).size===experiences.length) unlock('all','Saw Everything');
  save();
  home.classList.remove('active'); experience.classList.add('active');
  rarityEl.textContent=item.rarity; thingNumber.textContent='THING #'+String(experiences.indexOf(item)+1).padStart(3,'0');
  history.replaceState(null,'','#thing-'+item.id);
  item.render();
}

chaosButton.onclick=showRandom; nextButton.onclick=showRandom;
document.getElementById('brand').onclick=e=>{e.preventDefault();experience.classList.remove('active');home.classList.add('active');history.replaceState(null,'','#');};

document.getElementById('statsBtn').onclick=()=>openModal(`<h2>YUGI Stats</h2><p>Your extremely important local statistics.</p><div class="stat-grid"><div class="stat"><strong>${state.presses}</strong>buttons pressed</div><div class="stat"><strong>${new Set(state.seen).size}</strong>things discovered</div><div class="stat"><strong>${state.achievements.length}</strong>achievements</div><div class="stat"><strong>${state.secrets}</strong>secrets touched</div></div>`);
const achievementList=[['first','Pressed The Button'],['caught','Faster Than A Button'],['red5','Professional Button Presser'],['number','Mind Reader-ish'],['clock','Human Stopwatch'],['human','Probably Human'],['fast','Dangerously Fast'],['42','The Answer'],['memory','RAM Installed'],['vent','Vent Enthusiast'],['void','Touched The Void'],['vault','Elite Hacker'],['nothing','Persistent For No Reason'],['25','Still Here?'],['100','Internet Archaeologist'],['all','Saw Everything']];
document.getElementById('achievementsBtn').onclick=()=>openModal(`<h2>Achievements</h2>${achievementList.map(([id,name])=>`<div class="achievement ${state.achievements.includes(id)?'':'locked'}">${state.achievements.includes(id)?'🏆':'🔒'} <strong>${name}</strong></div>`).join('')}`);
function openModal(html){modalContent.innerHTML=html;modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false')}
document.getElementById('modalClose').onclick=()=>modal.classList.add('hidden');modal.onclick=e=>{if(e.target===modal)modal.classList.add('hidden')};
updateAchievementCount();
if(location.hash.startsWith('#thing-')){ const id=location.hash.slice(7); const found=experiences.find(x=>x.id===id); if(found){home.classList.remove('active');experience.classList.add('active');rarityEl.textContent=found.rarity;thingNumber.textContent='THING #'+String(experiences.indexOf(found)+1).padStart(3,'0');found.render();}}
