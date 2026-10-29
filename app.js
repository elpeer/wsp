/* ===== DATA (from wsp-womensportpower.com, YouTube IDs) =====
   item: [youtubeId, episode, name, role, duration, sub]                       */
const ALL=[];ORDER.forEach(k=>P[k].items.forEach(a=>ALL.push({id:a[0],ep:a[1],name:a[2],role:a[3],dur:a[4],sub:a[5]||"",p:k})));
const byId=Object.fromEntries(ALL.map(v=>[v.id,v]));

/* ===== THUMBNAILS: frames from inside the video, never the intro frame =====
   YouTube stores 3 auto-frames per video (1=25%, 2=50%, 3=75%). We try HD → SD → HQ,
   and treat YouTube's 120×90 grey placeholder as "missing".                         */
const FRAME=2;
function thumbHTML(v,frame=FRAME){
  const p=P[v.p];
  return `<div class="th" style="--c1:${p.c1};--c2:${p.c2}"><span class="ph">${p.big.split(" ")[0]}</span><img class="yt" alt="" referrerpolicy="no-referrer" loading="lazy" data-yt="${v.id}" data-f="${frame}"></div>`;
}
function hydrate(root=document){
  root.querySelectorAll("img.yt:not([data-s])").forEach(img=>{
    const id=img.dataset.yt,f=img.dataset.f;
    const list=[`maxres${f}`,`sd${f}`,`hq${f}`,`mq${f}`,`hqdefault`]; // last = channel thumbnail, only if no inner frame exists
    let i=0;
    const next=()=>{ if(i>=list.length){img.remove();return} img.src=`https://i.ytimg.com/vi/${id}/${list[i++]}.jpg`; };
    img.onload=()=>{
      if(img.naturalWidth<=120){next();return}
      if(img.naturalWidth/img.naturalHeight<1.5) img.classList.add("r43"); // letterboxed 4:3 → crop bars
      img.classList.add("ok");
    };
    img.onerror=next; img.dataset.s=1; next();
  });
}

const ICON={
 play:'<svg viewBox="0 0 24 24" fill="#fff"><path d="M7 4.5v15l13-7.5z"/></svg>',
 clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>',
 share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>',
 heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.3 3.7 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.5 0 5.8 3.3 4.5 6.8C19.5 15.4 12 20 12 20z"/></svg>',
 yt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/></svg>'
};
const epLabel=v=>v.ep?`פרק ${v.ep}`:P[v.p].subs&&v.sub?P[v.p].subs[v.sub]:P[v.p].short;

function card(v,cls="c-port"){
  const p=P[v.p];
  return `<a class="card ${cls}" href="#v-${v.id}" data-vt="${v.id}" style="--c1:${p.c1};--c2:${p.c2}">
    ${thumbHTML(v)}<div class="shade"></div>
    <span class="badge">${ICON.clock}${v.dur}</span>
    ${v.ep&&cls!=="c-reel"?`<span class="badge l">#${v.ep}</span>`:""}
    <span class="play">${ICON.play}</span>
    <div class="meta"><div class="kick">${cls==="c-reel"?(p.subs&&v.sub?p.subs[v.sub]:p.short):p.short}</div><h3>${v.name}</h3>${cls!=="c-reel"?`<div class="sub">${v.role}</div>`:""}</div>
  </a>`;
}

/* ===== HOME ===== */
function renderStories(){
  document.getElementById("stories").innerHTML=ORDER.map(k=>{
    const o=byId[P[k].items[0][0]];
    return `<a class="story" href="#p-${k}"><div class="ring"><div>${thumbHTML(o)}</div></div><span>${P[k].short}</span></a>`;
  }).join("");
}

const HERO=[byId["I-wK8blhLkY"],byId["5HFdgbtaxAI"],byId["POlooD7GplM"],byId["UlK3p3RSxwo"],byId["pWB9jUexb_w"]];
let hi=0,htimer;
function renderHero(){
  const h=document.getElementById("hero");
  h.innerHTML=`<div class="bars">${HERO.map(()=>"<i><b></b></i>").join("")}</div>`+
   HERO.map((v,i)=>{const p=P[v.p];return `<div class="slide" style="--c1:${p.c1};--c2:${p.c2}" aria-hidden="true">
     ${thumbHTML(v)}<div class="shade"></div>
     <div class="tag"><em>חדש</em>${p.name}</div>
     <div class="meta"><div class="sub" style="font-weight:600;opacity:1">${epLabel(v)} · ${v.dur}</div><h3>${v.name}</h3><div class="sub">${v.role}</div>
     <div class="cta"><a class="btn btn-w" href="#v-${v.id}" data-vt="${v.id}">${ICON.play.replace('#fff','currentColor')}לצפייה</a><a class="btn btn-g" href="#p-${v.p}">לכל הפרקים</a></div></div></div>`}).join("")+
   `<button class="tapzone prev" aria-label="הקודם"></button><button class="tapzone next" aria-label="הבא"></button>`;
  h.querySelector(".prev").onclick=()=>heroGo(hi-1);
  h.querySelector(".next").onclick=()=>heroGo(hi+1);
  let sx=0;h.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
  h.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)heroGo(hi+(dx>0?1:-1))});
  heroGo(0);
}
function heroGo(n){
  const h=document.getElementById("hero");hi=(n+HERO.length)%HERO.length;
  h.querySelectorAll(".slide").forEach((s,i)=>{s.classList.toggle("on",i===hi);s.setAttribute("aria-hidden",i!==hi)});
  h.querySelectorAll(".bars i").forEach((b,i)=>{b.className=i<hi?"done":"";if(i===hi){void b.offsetWidth;b.className="run"}});
  clearTimeout(htimer);htimer=setTimeout(()=>heroGo(hi+1),6500);
}

function tabs(el,list,active,onPick){
  el.innerHTML=list.map(([k,l])=>`<button class="tab${k===active?" on":""}" role="tab" aria-selected="${k===active}" data-k="${k}">${l}</button>`).join("");
  el.onclick=e=>{const b=e.target.closest(".tab");if(!b)return;el.querySelectorAll(".tab").forEach(t=>{t.classList.toggle("on",t===b);t.setAttribute("aria-selected",t===b)});onPick(b.dataset.k);b.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"})};
}
function chips(el,list,active,onPick){
  el.innerHTML=list.map(([k,l,n])=>`<button class="chip${k===active?" on":""}" data-k="${k}">${l}${n!=null?`<i>${n}</i>`:""}</button>`).join("");
  el.onclick=e=>{const b=e.target.closest(".chip");if(!b)return;el.querySelectorAll(".chip").forEach(t=>t.classList.toggle("on",t===b));onPick(b.dataset.k)};
}
function fillRail(el,items,cls){el.innerHTML=items.map(v=>card(v,cls)).join("");el.classList.remove("swap");void el.offsetWidth;el.classList.add("swap");el.scrollLeft=0;hydrate(el)}
const itemsOf=k=>ALL.filter(v=>v.p===k);

function renderPod(){
  const subs=P.pod.subs;
  tabs(document.getElementById("podTabs"),[["all","הכל"],...Object.entries(subs)],"all",k=>fillRail(document.getElementById("podRail"),itemsOf("pod").filter(v=>k==="all"||v.sub===k).slice(0,12),"c-port"));
  fillRail(document.getElementById("podRail"),itemsOf("pod").slice(0,12),"c-port");
}
function renderProg(){
  const progs=["hm","mm","pb","ss"];
  const chipsEl=document.getElementById("progChips"),rail=document.getElementById("progRail");
  const show=k=>{
    const p=P[k];
    if(p.subs){
      const counts=Object.fromEntries(Object.keys(p.subs).map(s=>[s,itemsOf(k).filter(v=>v.sub===s).length]));
      chipsEl.hidden=false;
      chips(chipsEl,[["all","כל הענפים",itemsOf(k).length],...Object.entries(p.subs).filter(([s])=>counts[s]).map(([s,l])=>[s,l,counts[s]])],"all",s=>fillRail(rail,itemsOf(k).filter(v=>s==="all"||v.sub===s).slice(0,12),"c-wide"));
    } else chipsEl.hidden=true;
    fillRail(rail,itemsOf(k).slice(0,12),"c-wide");
  };
  tabs(document.getElementById("progTabs"),progs.map(k=>[k,P[k].name]),"hm",show);
  show("hm");
}
function renderShorts(){
  const subs=P.vid.subs,rail=document.getElementById("shortRail");
  chips(document.getElementById("shortChips"),[["all","הכל"],...Object.entries(subs)],"all",k=>fillRail(rail,itemsOf("vid").filter(v=>k==="all"||v.sub===k),"c-reel"));
  fillRail(rail,itemsOf("vid"),"c-reel");
}
function pickRow(v){const p=P[v.p];return `<a class="pick" href="#v-${v.id}" style="--c1:${p.c1};--c2:${p.c2}">
  <div class="pt">${thumbHTML(v)}<div class="mini"><span>${ICON.play.replace('#fff','currentColor')}</span></div></div>
  <div class="tx"><small>${p.short} · ${epLabel(v)}</small><b>${v.name}</b><span>${v.role}</span></div><div class="du">${v.dur}</div></a>`}
function renderPicks(){
  const ids=["JWlvgMZqSAU","s0wL7LkvIYw","90Pi7zTmawM","YXm7r8HwLNA","CKSIILtj67I"];
  const el=document.getElementById("picks");el.innerHTML=ids.map(i=>pickRow(byId[i])).join("");hydrate(el);
}

/* ===== PROGRAMS INDEX ===== */
function renderPlist(){
  const el=document.getElementById("plist");
  el.innerHTML=ORDER.map(k=>{const p=P[k],its=itemsOf(k);return `<a class="prow" href="#p-${k}" style="--c1:${p.c1};--c2:${p.c2}">
    <div class="collage">${its.slice(0,3).map(v=>`<div>${thumbHTML(v)}</div>`).join("")}</div><div class="ov"></div>
    <div class="tx"><h3>${p.name}</h3><p>${p.desc}</p><span class="n">${its.length} ${k==="vid"?"סרטונים":"פרקים"}</span></div></a>`}).join("");
  hydrate(el);
}

/* ===== PROGRAM PAGE ===== */
function renderProgram(k){
  const p=P[k],its=itemsOf(k),el=document.getElementById("s-program");
  const total=its.reduce((s,v)=>{const t=v.dur.split(":").map(Number);return s+(t.length===3?t[0]*60+t[1]:t[0])},0);
  el.innerHTML=`<div class="phead" data-big="${p.big}" style="--c1:${p.c1};--c2:${p.c2}">
     <div class="vtop"><a class="icon-btn" href="#home" aria-label="חזרה">${ICON.back}</a></div>
     <h1>${p.name}</h1><p>${p.desc}</p>
     <div class="stats"><div><b>${its.length}</b>${k==="vid"?"סרטונים":"פרקים"}</div><div><b>${Math.round(total/60)}</b>שעות תוכן</div>${p.subs?`<div><b>${Object.keys(p.subs).length}</b>${k==="vid"?"פינות":k==="mm"?"ענפים":"נושאים"}</div>`:""}</div></div>
   ${p.subs?`<div class="chips" id="pchips" style="padding-top:16px"></div>`:""}
   <div class="grid" id="pgrid"></div>`;
  const grid=el.querySelector("#pgrid");
  const fill=s=>{const list=its.filter(v=>s==="all"||v.sub===s);
    grid.innerHTML=list.map((v,i)=>card(v,i===0?"big":"")).join("");grid.classList.remove("swap");void grid.offsetWidth;grid.classList.add("swap");hydrate(grid)};
  if(p.subs)chips(el.querySelector("#pchips"),[["all","הכל",its.length],...Object.entries(p.subs).map(([s,l])=>[s,l,its.filter(v=>v.sub===s).length]).filter(x=>x[2])],"all",fill);
  fill("all");
}

/* ===== VIDEO PAGE ===== */
let liked={};try{liked=JSON.parse(localStorage.getItem("wsp-liked")||"{}")}catch(e){}
/* favorites + history (per device). video keys = YouTube id, article keys = "a:"+slug */
const favKeys=()=>Object.keys(liked).filter(k=>liked[k]);
function toggleFav(key,on){liked[key]=on;if(!on)delete liked[key];try{localStorage.setItem("wsp-liked",JSON.stringify(liked))}catch(_){}updateFavCount();
  if(on)toast2("נשמר למועדפים","לאזור שלי","me");else toast("הוסר מהמועדפים")}
function updateFavCount(){const n=favKeys().length;document.querySelectorAll(".fav-n").forEach(b=>{b.hidden=!n;b.textContent=n})}
function pushHistory(key){let h=[];try{h=JSON.parse(localStorage.getItem("wsp-history")||"[]")}catch(_){}h=[key,...h.filter(k=>k!==key)].slice(0,40);try{localStorage.setItem("wsp-history",JSON.stringify(h))}catch(_){}}
function toast2(t,cta,key){const d=document.createElement("div");d.className="toast2";d.innerHTML=`<span>${t}</span><button>${cta}</button>`;d.querySelector("button").onclick=()=>{d.remove();go(key)};document.body.appendChild(d);setTimeout(()=>d.classList.add("out"),2600);setTimeout(()=>d.remove(),3000)}
function renderVideo(id){
  const v=byId[id];if(!v){go("home",{replace:true});return}
  mini.detach();const p=P[v.p],el=document.getElementById("s-video");el.classList.remove("playing");
  const more=itemsOf(v.p).filter(x=>x.id!==id).slice(0,10);
  const intro=v.ep?`בפרק ${v.ep} של ${p.name} מתארחת`:`ב${p.name} הפעם`;
  el.innerHTML=`<div class="vhero" style="--c1:${p.c1};--c2:${p.c2}">
      <div class="vt-img" style="position:absolute;inset:0">${thumbHTML(v)}</div><div class="shade"></div>
      <div class="vtop"><button class="icon-btn" id="vback" aria-label="חזרה">${ICON.back}</button>
        <div class="grp"><button class="icon-btn" id="vshare" aria-label="שיתוף">${ICON.share}</button></div></div>
      <button class="vplay" id="vplay" aria-label="נגן">${ICON.play}</button>
      <div class="player" id="player"></div>
    </div>
    <div class="vbody">
      <a class="kick" href="#p-${v.p}">${p.name}${v.sub&&p.subs?` · ${p.subs[v.sub]}`:""}</a>
      <h1>${v.name}</h1><p class="role">${v.role}</p>
      <div class="facts"><div><b>${v.dur}</b>אורך</div>${v.ep?`<div><b>#${v.ep}</b>פרק</div>`:""}<div><b>WSP</b>הפקה מקורית</div></div>
      <div class="vactions">
        <button class="btn btn-p" id="vplay2">${ICON.play}לצפייה עכשיו</button>
        <button class="btn btn-o${liked[id]?" liked":""}" id="vlike" aria-label="שמירה למועדפים">${ICON.heart}</button>
        <a class="btn btn-o" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener" aria-label="פתיחה ביוטיוב">${ICON.yt}</a>
      </div>
      <div class="about"><b>על ${v.ep?"הפרק":"הסרטון"}</b>${intro} ${v.name}: ${v.role}. ${p.desc}</div>
    </div>
    <div class="sec"><div class="sec-h"><div><h2>עוד <span>מ${p.short}</span></h2></div><a class="see" href="#p-${v.p}">הכל ${ICON.back.replace('M9 6l6 6-6 6','M15 6l-6 6 6 6')}</a></div>
      <div class="rail" id="moreRail">${more.map(x=>card(x,"c-port")).join("")}</div></div>`;
  hydrate(el);
  const play=()=>{const pl=el.querySelector("#player");if(pl.querySelector("iframe")){mini.dismissed=false;scrollTo({top:0,behavior:"smooth"});return}
    pl.classList.add("on");el.classList.add("playing");
    pl.innerHTML=`<iframe id="ytFrame" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(location.origin)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="${v.name}"></iframe>
      <div class="mini-ctl"><button data-mini="expand" aria-label="חזרה לנגן"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button><button data-mini="close" aria-label="סגירת הנגן הצף"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>`;
    mini.attach(el,pl);
    scrollTo({top:0,behavior:"smooth"})};
  el.querySelector("#vplay").onclick=play;el.querySelector("#vplay2").onclick=play;
  el.querySelector("#vback").onclick=()=>history.length>1&&curKey!==firstKey?history.back():go("home");
  el.querySelector("#vlike").onclick=e=>{const b=e.currentTarget,on=!liked[id];b.classList.toggle("liked",on);toggleFav(id,on)};
  el.querySelector("#vshare").onclick=async()=>{const url=location.origin+WSPSEO.keyToPath("v-"+id);
    try{if(navigator.share){await navigator.share({title:v.name,url})}else{await navigator.clipboard.writeText(url);toast("הקישור הועתק")}}catch(_){} };
}
function toast(t){const d=document.createElement("div");d.textContent=t;Object.assign(d.style,{position:"fixed",bottom:"96px",left:"50%",transform:"translateX(-50%)",background:"var(--ink)",color:"var(--bg)",padding:"10px 18px",borderRadius:"999px",fontSize:"13px",zIndex:60});document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}

/* ===== SEARCH ===== */
function renderSearch(){
  const q=document.getElementById("q"),res=document.getElementById("sres");
  chips(document.getElementById("sugg"),["כדוריד","כדורעף","אולימפית","פראלימפית","אלופת העולם","תזונה","נבחרת ישראל"].map(s=>[s,s]),null,s=>{q.value=s;run()});
  const run=()=>{const t=q.value.trim();
    const list=t?ALL.filter(v=>(v.name+" "+v.role+" "+P[v.p].name+" "+(P[v.p].subs?.[v.sub]||"")).includes(t)):ALL.slice(0,8);
    res.innerHTML=list.length?list.slice(0,30).map(v=>card(v,"")).join(""):`<div class="empty" style="grid-column:1/-1">לא מצאנו תוצאות ל"${t}". נסי שם של ספורטאית או ענף.</div>`;
    hydrate(res)};
  q.oninput=run;run();
}


/* ===== ABOUT: team, partners, form (from wsp-womensportpower.com/about-1) ===== */
const WIX=(f,w=600,h=760)=>`https://static.wixstatic.com/media/${f}/v1/fill/w_${w},h_${h},al_t,q_85,enc_auto/p.jpg`;
const LEADS=[
 {n:"נועה זליבנסקי יחזקאל",r:"מייסדת ובעלת המיזם",f:"974295_fe7489b68ecd4298b446ce7f6ef248c6~mv2.jpeg",
  roles:["מנחת הפודקאסט הרשמי","מנחת התכנית התקפה מתפרצת","שחקנית כדורסל בליגת העל"],shows:["pod","hm"],
  q:"ספורט נשים עבורי הוא אומנות. אני מודה על הזכות להציג אותה לעולם."},
 {n:"יסמין מנור",r:"עוזרת ניהול המיזם",f:"974295_108fdb59c26e429e924e050f35f7a104~mv2.jpg",
  roles:["שדרנית המבזקים השבועיים","חברת פאנל בשיחה ספורטיבית"],shows:["ss"]},
 {n:"אור אליוב הורוד",r:"פאנל שיחה ספורטיבית",f:"974295_2ba42b0a3cd94477984bf61f0f1ca23b~mv2.jpeg",
  roles:["חבר פאנל בתכנית שיחה ספורטיבית","מאמן MMA ובעלים של סטודיו לאומנויות לחימה"],shows:["ss","vid"],
  q:"הגיע הזמן שהספורטאיות בישראל יקבלו את הבמה וההכרה שמגיעה להן."}
];
const TEAM=[
 {n:"יעל כהן",g:"rep",f:"974295_d0f1273ff75b4410aa8583836529e86c~mv2.jpg",roles:["מנהלת מערך הכתבות","הכתבת הראשית"]},
 {n:"דניאלה ראובן",g:"host",f:"974295_b9d4a813ce984969b51398151fb15443~mv2.jpeg",roles:["מנחת מגרש מסכם, ספיישל כדורסל","שדרנית הכדורסל של המיזם"],shows:["mm"]},
 {n:"עינב מוחרר",g:"host",f:"974295_99355fb295b14808ba8b9bc82e1c3e3f~mv2.jpg",roles:["מנחת מגרש מסכם, ספיישל כדורעף"],shows:["mm"]},
 {n:"לורן פאר",g:"host",f:"974295_a8c6163222ee4e9f8ee987c905ff3a22~mv2.jpeg",roles:["מנחת מגרש מסכם, ספיישל כדוריד"],shows:["mm"]},
 {n:"אופיר רבינוביץ",g:"host",f:"974295_5c9451a98b5840debd96f5f6ddde1dbc~mv2.jpeg",roles:["שדרנית קווים","מנחת מגרש מסכם, ספיישל כדורגל"],shows:["mm"]},
 {n:"אליה עתאלי",g:"host",f:"974295_dc65a80566be4c089944ac06518cef88~mv2.jpeg",roles:["מנחת התכנית פצצה ביציע"],shows:["pb"]},
 {n:"אורטל אורן זאבי",g:"host",f:"974295_99072ab72ecf464b92e57771a6926b4b~mv2.jpeg",roles:["שדרנית הכדורסל של המיזם"]},
 {n:"תם שקד",g:"rep",f:"974295_7a6d89abbd064fd8bf3d14ce878e1f25~mv2.jpeg",roles:["כתבת שטח","מנחת התכנית עוברות את הגבול","האישה הראשונה בגמר נינג'ה ישראל"]},
 {n:"מאיה שרביט",g:"rep",f:"974295_b753f7f66a9a43868fc1b7b3fa8badb1~mv2.jpeg",roles:["כתבת שטח","שחקנית כדורסל בליגת העל ובנבחרת ישראל"]},
 {n:"דיאנה שנייר",g:"rep",f:"974295_b69be3d0d89d4d9597bb700baf747550~mv2.jpeg",roles:["כתבת","שחקנית נבחרת ישראל ברוגבי כסאות גלגלים"]},
 {n:"שקד עמיחי",g:"rep",f:"974295_ec70f376ecdf4bbbba80bcd79109a8d5~mv2.jpeg",roles:["כתבת","ג'ודוקא בנבחרת ישראל"]},
 {n:"נטע קומפרמן",g:"rep",f:"974295_e221d35aaf9a4b4db590b4ffdc23141d~mv2.jpeg",roles:["כתבת","מרימת משקולות אולימפית"]},
 {n:"יעל יענקו",g:"rep",f:"974295_be31fdd2fab34730bb5a4cb301da073e~mv2.jpg",roles:["כתבת שטח"]},
 {n:"מעיין זוליכאן",g:"pro",f:"974295_64a21a1c68e6400689c98b5b727e65e8~mv2.jpeg",roles:["הפיזיותרפיסטית הרשמית של המיזם","חברת פאנל בשיחה ספורטיבית"],shows:["ss","vid"]},
 {n:"אהד ווקס",g:"pro",f:"974295_7d9e3f43787145f5a5b83ea7f4f422e8~mv2.jpeg",roles:["חבר פאנל בתכנית התקפה מתפרצת"],shows:["hm"]}
];
const TGROUPS={all:"כל הצוות",host:"מנחות ושדרניות",rep:"כתבות",pro:"פאנל ומקצוע"};
const PARTNERS=[
 {n:"Arno Capital",f:"974295_176be4dda1b143cc9064187a441dc264~mv2.png"},
 {n:"WSC Sports",f:"974295_de197c37722b450daa9165379d036058~mv2.png"},
 {n:"Donna Victoria",f:"974295_bbc56b96a21541c189daf6fadae78a88~mv2.png"},
 {n:"Jasmine",f:"974295_522edc573fc24329b91aff579d4340cf~mv2.jpeg"},
 {n:"אבן אל-בר",f:"974295_c657e678d97c4e49a765234b2473c1fe~mv2.jpeg"}
];
const JOIN=[
 {k:"viewer",t:"צופים",d:"עקבו, שתפו ותנו לספורטאיות קהל",i:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'},
 {k:"donate",t:"תורמים",d:"עזרו לנו להפיק עוד תוכן",i:'<path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.3 3.7 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.5 0 5.8 3.3 4.5 6.8C19.5 15.4 12 20 12 20z"/>'},
 {k:"volunteer",t:"מתנדבים",d:"צילום, עריכה, כתיבה וסושיאל",i:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'},
 {k:"partner",t:"שותפים אסטרטגיים",d:"חסויות, קמפיינים ואירועים",i:'<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a3 3 0 0 1 3.6-.5l.6.3a3 3 0 0 0 2 .3L21 4"/><path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8"/>'}
];
const SUBJECTS=[["partner","שיתוף פעולה"],["sponsor","חסות"],["volunteer","התנדבות"],["donate","תרומה"],["guest","הצעה לאורחת"],["other","אחר"]];

function renderAbout(){
  const S=id=>document.getElementById(id);
  // fan
  S("abFan").innerHTML=[LEADS[1],LEADS[0],LEADS[2]].map(m=>`<div class="ph"><img src="${WIX(m.f,320,420)}" alt="" referrerpolicy="no-referrer"></div>`).join("")+`<div class="sticker">${TEAM.length+LEADS.length} נשים ואנשים, קול אחד</div>`;
  // stats
  const hrs=Math.round(ALL.reduce((s,v)=>{const t=v.dur.split(":").map(Number);return s+(t.length===3?t[0]*60+t[1]:t[0])},0)/60);
  const stats=[[ALL.length,"פרקים וסרטונים"],[ORDER.length,"תכניות"],[hrs,"שעות תוכן"],[TEAM.length+LEADS.length,"אנשי צוות"]];
  S("abStats").innerHTML=stats.map(([n,l])=>`<div><b data-n="${n}">0</b><span>${l}</span></div>`).join("");
  // mission words
  const m=S("abMission"),HL=["שוויון","לחינוך","המסוגלות","פודקאסטים,","ראיונות,"];
  m.innerHTML=m.textContent.split(" ").map(w=>`<span class="w${HL.includes(w)?" hl":""}">${w}</span>`).join(" ");
  // leads
  S("abLeads").innerHTML=LEADS.map((l,i)=>`<button class="lead rv" data-lead="${i}">
     <img src="${WIX(l.f,i?400:800,i?520:1000)}" alt="" referrerpolicy="no-referrer" loading="lazy">
     ${i===0?`<span class="crown"><svg viewBox="0 0 24 24" fill="#fff"><path d="M3 18h18l-1.5-10-4.5 4-3-6-3 6-4.5-4z"/></svg></span>`:""}
     <div class="lt"><span class="role">${l.r}</span><h3>${l.n}</h3>${i===0&&l.q?`<q>${l.q}</q>`:`<small>${l.roles[0]}</small>`}</div></button>`).join("");
  // team grid
  const grid=S("abTeamGrid");
  const fillTeam=g=>{grid.innerHTML=TEAM.map((t,i)=>({t,i})).filter(x=>g==="all"||x.t.g===g).map(({t,i},k)=>`<button class="tm" data-tm="${i}" style="transition-delay:${k*45}ms"><div class="tp"><img src="${WIX(t.f,300,400)}" alt="" referrerpolicy="no-referrer" loading="lazy"></div><b>${t.n}</b><span>${t.roles[0]}</span></button>`).join("");
    observe(grid.querySelectorAll(".tm"))};
  chips(S("abTeamChips"),Object.entries(TGROUPS).map(([k,l])=>[k,l,k==="all"?TEAM.length:TEAM.filter(t=>t.g===k).length]),"all",fillTeam);
  fillTeam("all");
  // join
  S("abJoin").innerHTML=JOIN.map(j=>`<button class="jt rv" data-join="${j.k}"><span class="ji"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${j.i}</svg></span><b>${j.t}</b><span>${j.d}</span></button>`).join("");
  // partners (duplicated for seamless loop)
  const pl=PARTNERS.map(p=>`<div class="plogo"><img src="${WIX(p.f,200,200).replace("al_t","al_c")}" alt="${p.n}" referrerpolicy="no-referrer" loading="lazy"><span>${p.n}</span></div>`).join("");
  S("abPartners").innerHTML=`<div class="pin">${pl}${pl}${pl}${pl}</div>`;
  // subjects
  S("cSubj").innerHTML=SUBJECTS.map(([k,l],i)=>`<button type="button" role="radio" aria-checked="${i===0}" data-subj="${k}">${l}</button>`).join("");

  // interactions
  const sec=S("s-about");
  sec.addEventListener("click",e=>{
    const sc=e.target.closest("[data-scroll]");
    if(sc){e.preventDefault();if(sc.dataset.subject)setSubj(sc.dataset.subject);S(sc.dataset.scroll).scrollIntoView({behavior:"smooth",block:"start"});return}
    const j=e.target.closest("[data-join]");
    if(j){setSubj(j.dataset.join==="viewer"?"other":j.dataset.join);if(j.dataset.join==="viewer"){go("home");return}S("abContact").scrollIntoView({behavior:"smooth"});setTimeout(()=>S("cFirst").focus({preventScroll:true}),600);return}
    const sb=e.target.closest("[data-subj]");if(sb){setSubj(sb.dataset.subj);return}
    const ld=e.target.closest("[data-lead]");if(ld){openSheet(LEADS[+ld.dataset.lead]);return}
    const tm=e.target.closest("[data-tm]");if(tm){openSheet(TEAM[+tm.dataset.tm]);return}
  });
  S("sheetBg").onclick=closeSheet;
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
  S("cform").addEventListener("submit",submitForm);
}
function setSubj(k){const has=SUBJECTS.some(s=>s[0]===k);document.querySelectorAll("#cSubj [data-subj]").forEach(b=>b.setAttribute("aria-checked",b.dataset.subj===(has?k:"other")))}
function openSheet(m){
  const sh=document.getElementById("sheet");
  sh.innerHTML=`<div class="grab"></div><button class="x" aria-label="סגירה"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
   <div class="sh"><div class="sp"><img src="${WIX(m.f,360,450)}" alt="" referrerpolicy="no-referrer"></div><div><h3 id="sheetName">${m.n}</h3><div class="tags">${m.r?`<span>${m.r}</span>`:""}${m.g?`<span>${TGROUPS[m.g]}</span>`:""}</div></div></div>
   ${m.q?`<p style="font-size:16px;line-height:1.5;margin:18px 0 0;font-weight:500">״${m.q}״</p>`:""}
   <ul>${m.roles.map(r=>`<li>${r}</li>`).join("")}</ul>
   ${m.shows?`<div class="shows">${m.shows.map(k=>`<a class="btn btn-p" href="#p-${k}" style="height:42px;font-size:13px">${ICON.play}${P[k].name}</a>`).join("")}</div>`:""}`;
  sh.hidden=false;document.getElementById("sheetBg").hidden=false;document.body.style.overflow="hidden";
  sh.querySelector(".x").onclick=closeSheet;sh.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeSheet));
}
function closeSheet(){const sh=document.getElementById("sheet");if(!sh||sh.hidden)return;sh.hidden=true;document.getElementById("sheetBg").hidden=true;document.body.style.overflow=""}

/* Contact form: validates in the page. Wire FORM_ENDPOINT to the real backend
   (e.g. a WordPress REST route / CF7 / Make webhook) before launch.               */
const FORM_ENDPOINT=null;
async function submitForm(e){
  e.preventDefault();
  const f=e.currentTarget,err=document.getElementById("cErr");
  const first=f.querySelector("#cFirst"),email=f.querySelector("#cEmail");
  f.querySelectorAll(".fld").forEach(l=>l.classList.remove("bad"));
  const bad=[];if(!first.value.trim())bad.push(first);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))bad.push(email);
  if(bad.length){bad.forEach(i=>i.closest(".fld").classList.add("bad"));err.textContent=bad.includes(first)&&bad.includes(email)?"חסרים שם פרטי וכתובת אימייל תקינה.":bad.includes(first)?"נשמח לדעת איך קוראים לך.":"כתובת האימייל לא נראית תקינה.";err.hidden=false;bad[0].focus();return}
  err.hidden=true;
  const btn=f.querySelector(".fsend");btn.classList.add("busy");btn.querySelector("span").textContent="שולחת…";
  const data=Object.fromEntries(new FormData(f));data.subject=f.querySelector('[aria-checked="true"]')?.dataset.subj;
  try{ if(FORM_ENDPOINT){const r=await fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});if(!r.ok)throw new Error(r.status)}
       else await new Promise(r=>setTimeout(r,900)); }
  catch(_){btn.classList.remove("busy");btn.querySelector("span").textContent="שליחה";err.textContent="השליחה לא הצליחה. בדקו את החיבור ונסו שוב.";err.hidden=false;return}
  document.getElementById("cDoneT").textContent=`תודה, ${first.value.trim()}!`;
  document.getElementById("cDone").hidden=false;
}

/* scroll reveals + counters + word highlight */
let io;
function observe(nodes){nodes.forEach(n=>io?io.observe(n):n.classList.add("in"))}
if("IntersectionObserver" in window){
  io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const t=en.target;t.classList.add("in");io.unobserve(t);
    if(t.id==="abStats")t.querySelectorAll("b[data-n]").forEach(b=>{const n=+b.dataset.n,t0=performance.now();const step=now=>{const k=Math.min(1,(now-t0)/1400);b.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)});
    if(t.id==="abMission")t.querySelectorAll(".w").forEach((w,i)=>setTimeout(()=>w.classList.add("on"),i*55));
  }),{threshold:.2});
}
function aboutEnter(){observe(document.querySelectorAll("#s-about .rv:not(.in),#abStats,#abMission,#s-about .tm:not(.in)"))}


/* ===== ARTICLES (wsp-womensportpower.com/blog, via its RSS feed) ===== */
const AIMG=(f,w=700,h=460)=>`https://static.wixstatic.com/media/${f}/v1/fill/w_${w},h_${h},al_c,q_85,enc_auto/a.jpg`;
const fmtDate=d=>new Date(d).toLocaleDateString("he-IL",{day:"numeric",month:"short",year:"numeric"});
const initials=n=>n.split(" ").map(x=>x[0]).slice(0,2).join("");
const byline=a=>`<div class="by"><span class="av">${initials(a.a)}</span><b>${a.a}</b>·<span>${fmtDate(a.d)}</span></div>`;
const acard=(a,i)=>`<a class="acard" href="#a-${i}"><div class="ai"><img src="${AIMG(a.img,520,320)}" alt="" loading="lazy" referrerpolicy="no-referrer"><span class="tag">${a.tag}</span></div><div class="ab"><h3>${a.t}</h3>${byline(a)}</div></a>`;
const arow=(a,i)=>`<a class="arow" href="#a-${i}"><div class="ri"><img src="${AIMG(a.img,240,220)}" alt="" loading="lazy" referrerpolicy="no-referrer"></div><div class="rt"><small>${a.tag}</small><h3>${a.t}</h3>${byline(a)}</div></a>`;
function renderArticlesHome(){document.getElementById("artRail").innerHTML=ARTICLES.slice(0,8).map(acard).join("")}
function renderArticles(){
  const tags=["הכל",...new Set(ARTICLES.map(a=>a.tag))],list=document.getElementById("artList");
  const fill=t=>{const items=ARTICLES.map((a,i)=>({a,i})).filter(x=>t==="הכל"||x.a.tag===t);
    list.innerHTML=items.map(({a,i},k)=>k===0?`<a class="afeat" href="#a-${i}"><img src="${AIMG(a.img,900,700)}" alt="" referrerpolicy="no-referrer"><div class="ft"><span class="tag">${a.tag}</span><h3>${a.t}</h3><p>${a.ex}</p>${byline(a)}</div></a>`:arow(a,i)).join("");
    list.classList.remove("swap");void list.offsetWidth;list.classList.add("swap")};
  tabs(document.getElementById("artTabs"),tags.map(t=>[t,t]),"הכל",fill);fill("הכל");
}
function esc(t){return String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function inl(t){return esc(t).replace(/\*\*(.+?)\*\*/gs,"<strong>$1</strong>").replace(/(^|\s)_(.+?)_(?=\s|$)/g,"$1<em>$2</em>").replace(/\n/g,"<br>")}
const isBoldLine=x=>/^\*\*[^*]{2,90}\*\*$/.test(x.trim());
function articleModel(a){
  const raw=(window.ARTICLE_BODIES&&ARTICLE_BODIES[a.slug]?.b)||[{t:"p",x:a.ex}];
  let blocks=raw.slice(),dek="";
  if(blocks[0]?.t==="h2"&&blocks.findIndex(b=>b.t==="p")>0){dek=blocks[0].x;blocks=blocks.slice(1)}
  let heads=blocks.filter(b=>b.t==="h2"||b.t==="h3");
  if(heads.length<2){ // promote short fully-bold paragraphs to section headings
    const cand=blocks.filter(b=>b.t==="p"&&isBoldLine(b.x));
    if(cand.length>=2)cand.forEach(b=>{b.t="h3";b.x=b.x.replace(/\*\*/g,"").trim()});
  }
  let n=0;blocks.forEach(b=>{if(b.t==="h2"||b.t==="h3")b.id="sec-"+(++n)});
  const words=blocks.reduce((s,b)=>s+(typeof b.x==="string"?b.x:(b.x||[]).join(" ")).split(/\s+/).filter(Boolean).length,0);
  return {blocks,dek,toc:blocks.filter(b=>b.id),mins:Math.max(1,Math.round(words/200))};
}
function blockHTML(b,first){
  switch(b.t){
    case "h2":return `<h2 id="${b.id}">${esc(b.x)}</h2>`;
    case "h3":return `<h3 id="${b.id}">${esc(b.x)}</h3>`;
    case "q":return `<blockquote>${inl(b.x)}</blockquote>`;
    case "ul":case "ol":return `<${b.t}>${b.x.map(li=>`<li>${inl(li)}</li>`).join("")}</${b.t}>`;
    case "img":return `<figure><button class="zoom" data-zoom="${b.src}" aria-label="הגדלת תמונה"><img src="${AIMG(b.src,1200,800).replace("fill","fit").replace(",al_c","")}" alt="${esc(b.cap||"")}" loading="lazy" referrerpolicy="no-referrer"></button>${b.cap?`<figcaption>${esc(b.cap)}</figcaption>`:""}</figure>`;
    default:{const t=b.x.trim(),quote=!first&&t.length<260&&/^["״“]/.test(t)&&/["״”][^"״”]{0,40}$/.test(t);return quote?`<blockquote class="say">${inl(t)}</blockquote>`:`<p${first?' class="first"':""}>${inl(b.x)}</p>`}
  }
}
function renderArticle(i){
  const a=ARTICLES[i];if(!a){go("articles",{replace:true});return}
  const m=articleModel(a),orig=`${SITE}/post/${encodeURIComponent(a.slug)}`,url=location.origin+WSPSEO.keyToPath("a-"+i);
  let firstP=true;const body=m.blocks.map(b=>{const f=b.t==="p"&&firstP;if(b.t==="p")firstP=false;return blockHTML(b,f)}).join("");
  const toc=m.toc.length>=2?`<nav class="toc" aria-label="תוכן העניינים"><div class="toc-h"><b>תוכן העניינים</b><span>${m.toc.length} חלקים · ${m.mins} דק׳ קריאה</span></div><ol>${m.toc.map(h=>`<li class="${h.t}"><a href="#${h.id}" data-toc="${h.id}">${esc(h.x)}</a></li>`).join("")}</ol></nav>`:"";
  const rel=ARTICLES.map((x,k)=>({x,k})).filter(o=>o.k!==i&&o.x.tag===a.tag).concat(ARTICLES.map((x,k)=>({x,k})).filter(o=>o.k!==i&&o.x.tag!==a.tag)).slice(0,6);
  const next=ARTICLES[(i+1)%ARTICLES.length];
  const fk="a:"+a.slug;const share=`<div class="share"><button data-fav="${fk}" class="${liked[fk]?"liked":""}" aria-label="שמירה למועדפים"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.3 3.7 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.5 0 5.8 3.3 4.5 6.8C19.5 15.4 12 20 12 20z"/></svg></button><button data-share="copy" aria-label="העתקת קישור"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg></button><a href="https://wa.me/?text=${encodeURIComponent(a.t+" "+url)}" target="_blank" rel="noopener" aria-label="שיתוף בוואטסאפ"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg></a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener" aria-label="שיתוף בפייסבוק"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8V6.5c0-.7.3-1.5 1.5-1.5H17V2h-2.6C11.6 2 11 4 11 5.8V8H9v3h2v11h3V11h2.6l.4-3z"/></svg></a></div>`;
  const el=document.getElementById("s-article");
  el.innerHTML=`<div class="prog" id="aprog"></div>
   <header class="ahero"><img src="${AIMG(a.img,1600,1000)}" alt="" referrerpolicy="no-referrer">
     <div class="vtop"><button class="icon-btn glass" id="aback" aria-label="חזרה"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></button>
       <div class="crumb"></div></div>
     <div class="ahead"><span class="tag">${a.tag}</span><h1>${esc(a.t)}</h1>${m.dek?`<p class="dek">${esc(m.dek)}</p>`:`<p class="dek">${esc(a.ex)}</p>`}
       <div class="by big"><span class="av">${initials(a.a)}</span><div><b>${a.a}</b><span>${fmtDate(a.d)} · ${m.mins} דק׳ קריאה</span></div></div></div>
   </header>
   <div class="reader">
     <aside class="rd-side">${toc}${share}</aside>
     <article class="prose" id="prose">${toc?`<details class="toc-m"><summary><span>תוכן העניינים</span><small>${m.toc.length} חלקים</small></summary>${toc}</details>`:""}${body}
       <footer class="aend"><div class="author"><span class="av">${initials(a.a)}</span><div><small>נכתב על ידי</small><b>${a.a}</b><span>צוות הכתבות של WSP</span></div></div>
         <div class="aend-row"><span>שתפו את הכתבה</span>${share}</div>
         <a class="nextart" href="#a-${(i+1)%ARTICLES.length}"><img src="${AIMG(next.img,700,420)}" alt="" referrerpolicy="no-referrer"><div><small>הכתבה הבאה</small><b>${esc(next.t)}</b></div></a>
         <p class="orig">פורסם במקור ב־<a href="${orig}" target="_blank" rel="noopener">WSP</a> · ${fmtDate(a.d)}</p></footer>
     </article>
   </div>
   <div class="sec"><div class="sec-h"><div><h2>עוד <span>כתבות</span></h2></div></div><div class="rail">${rel.map(o=>acard(o.x,o.k)).join("")}</div></div>
   ${toc?`<button class="toc-fab" id="tocFab" aria-label="תוכן העניינים"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg></button><div class="toc-sheet" id="tocSheet" hidden><div class="ts-in">${toc}</div></div>`:""}
   <div class="lightbox" id="lb" hidden><img alt=""><button class="icon-btn" aria-label="סגירה"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>`;
  document.getElementById("aback").onclick=()=>history.length>1&&curKey!==firstKey?history.back():go("articles");
  el.onclick=async e=>{
    const t=e.target.closest("[data-toc]");if(t){e.preventDefault();const h=document.getElementById(t.dataset.toc);scrollTo({top:h.getBoundingClientRect().top+scrollY-90,behavior:"smooth"});const sh=document.getElementById("tocSheet");if(sh)sh.hidden=true;const d=el.querySelector(".toc-m");if(d)d.open=false;return}
    if(e.target.closest("#tocFab")){const sh=document.getElementById("tocSheet");sh.hidden=!sh.hidden;return}
    if(e.target.id==="tocSheet"){e.target.hidden=true;return}
    const z=e.target.closest("[data-zoom]");if(z){const lb=document.getElementById("lb");lb.querySelector("img").src=AIMG(z.dataset.zoom,2000,1400).replace("fill","fit").replace(",al_c","");lb.hidden=false;return}
    if(e.target.closest("#lb")){document.getElementById("lb").hidden=true;return}
    const fv=e.target.closest("[data-fav]");if(fv){const on=!liked[fv.dataset.fav];el.querySelectorAll(`[data-fav="${fv.dataset.fav}"]`).forEach(b=>b.classList.toggle("liked",on));toggleFav(fv.dataset.fav,on);return}
    const sc=e.target.closest('[data-share="copy"]');if(sc){try{await navigator.clipboard.writeText(url);toast("הקישור הועתק")}catch(_){toast(url)}}
  };
  // active section in TOC
  if(articleIO)articleIO.disconnect();
  if(toc&&"IntersectionObserver" in window){
    articleIO=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)el.querySelectorAll("[data-toc]").forEach(l=>l.classList.toggle("on",l.dataset.toc===en.target.id))}),{rootMargin:"-15% 0px -75% 0px"});
    m.toc.forEach(h=>articleIO.observe(document.getElementById(h.id)));
  }
}
let articleIO;
addEventListener("scroll",()=>{const s2=document.getElementById("s-article");if(!s2.classList.contains("on"))return;const pr=document.getElementById("aprog"),pz=document.getElementById("prose");if(!pr||!pz)return;
  const r=pz.getBoundingClientRect(),k=Math.min(1,Math.max(0,(innerHeight*.35-r.top)/(r.height-innerHeight*.5)));pr.style.transform=`scaleX(${k})`;
  const f=document.getElementById("tocFab");if(f)f.classList.toggle("show",r.top<innerHeight*.3&&r.bottom>innerHeight)},{passive:true});

/* ===== AWARDS 2026 =====
   Categories come from the POWR polls on the current site. Photos: img/awards/*.jpg when available,
   otherwise a monogram card. Wire VOTE_ENDPOINT to the real vote store before launch.            */
const VOTE_ENDPOINT=null;
const AWARDS=[
 {k:"bb",t:"כדורסלנית השנה",icon:"🏀",n1:"#FF6A3D",n2:"#B4235A",noms:[
   {n:"עדן ציפל",c:"מכבי ראשון לציון"},{n:"שיר תירוש",c:"רמת גן"},{n:"אליסה בארון",c:"חולון"},{n:"גילי אייזנר",c:"רמת גן"}]},
 {k:"vb",t:"כדורעפנית השנה",icon:"🏐",n1:"#FF7AB8",n2:"#7A2A9E",noms:[
   {n:"קט זילברמן",c:"אשדוד"},{n:"מיה דונטו",c:"כפר סבא"},{n:"שיראל גיאנה",c:"פורטוגל"},{n:"מריה פרוצקין",c:"אשדוד"}]},
 {k:"hb",t:"כדורידנית השנה",icon:"🤾‍♀️",n1:"#FF3D8B",n2:"#5B0F34",noms:[
   {n:"נועם קריאף",c:"מ.כ חולון",img:"/img/awards/hb-noam-kriaf.jpg"},{n:"שיר וקרט",c:"בנות עיקו הרצליה",img:"/img/awards/hb-shir-wakert.jpg"},
   {n:"שרון אקלר",c:"מכבי ארזים רמת גן",img:"/img/awards/hb-sharon-akler.jpg"},{n:"שירה ג'רבי",c:"בנות עיקו הרצליה",img:"/img/awards/hb-shira-jerbi.jpg"}]}
];
let votes={};try{votes=JSON.parse(localStorage.getItem("wsp-votes-2026")||"{}")}catch(e){}
const saveVotes=()=>{try{localStorage.setItem("wsp-votes-2026",JSON.stringify(votes))}catch(e){}};
const CHK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7"/></svg>';
function renderAwards(){
  document.getElementById("awCatsN").textContent=AWARDS.length;
  document.getElementById("awCats").innerHTML=AWARDS.map((c,i)=>`<button data-awgo="${c.k}" class="${i===0?"on":""}">${c.icon} ${c.t}${votes[c.k]?.locked?`<span class="ok">${CHK.replace('currentColor','#2A0A1C')}</span>`:""}</button>`).join("");
  document.getElementById("awBody").innerHTML=AWARDS.map((c,ci)=>{
    const v=votes[c.k]||{};
    return `<div class="aw-cat" id="aw-${c.k}" data-cat="${c.k}">
      <div class="aw-cat-h"><div><small>קטגוריה ${ci+1} מתוך ${AWARDS.length}</small><h2>${c.t}</h2></div><span class="st${v.locked?" done":""}">${v.locked?"✓ הצבעת":"בחרו מועמדת"}</span></div>
      <div class="aw-grid${v.pick!=null?" picked":""}${v.locked?" locked":""}" role="radiogroup" aria-label="${c.t}">
        ${c.noms.map((m,i)=>`<button class="nom${v.pick===i?" sel":""}" role="radio" aria-checked="${v.pick===i}" data-nom="${i}" style="--n1:${c.n1};--n2:${c.n2};transition-delay:${i*70}ms">
          <span class="chk">${CHK.replace('currentColor','#fff')}</span>
          <div class="np">${m.img?`<img src="${m.img}" alt="${m.n}" loading="lazy">`:`<span class="mono">${initials(m.n)}</span>`}<span class="sport">${c.icon}</span></div>
          <div class="nn"><b>${m.n}</b><span>${m.c}</span></div></button>`).join("")}
      </div>
      <div class="aw-act">${v.locked
        ?`<button class="aw-btn gold" data-awnext="${ci}">${ci<AWARDS.length-1?"לקטגוריה הבאה":"לסיכום ההצבעה"} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg></button><button class="aw-btn ghost" data-awedit="${c.k}">שינוי</button>`
        :`<button class="aw-btn" data-awlock="${c.k}" ${v.pick==null?"disabled":""}>${v.pick==null?"בחרו ספורטאית":`אישור הצבעה ל${c.noms[v.pick].n}`}</button>`}</div>
    </div>`}).join("");
  updateAwardsMeta();
  if(io)document.querySelectorAll("#awBody .nom").forEach(n=>io.observe(n));else document.querySelectorAll("#awBody .nom").forEach(n=>n.classList.add("in"));
}
function updateAwardsMeta(){
  const done=AWARDS.filter(c=>votes[c.k]?.locked).length;
  document.getElementById("awDoneN").textContent=`${done}/${AWARDS.length}`;
  document.getElementById("awRing").style.strokeDasharray=`${done/AWARDS.length*100} 100`;
  const end=document.getElementById("awEnd");
  end.innerHTML=done===AWARDS.length
    ?`<div class="aw-eyebrow">תודה שהצבעת</div><h3>הקול שלך נספר</h3><p>הזוכות יוכרזו בכנס מצטיינות השנה של WSP. שתפו את הסקר ועזרו לנו להגיע לעוד אלפי מצביעים.</p>
       <div class="picks2">${AWARDS.map(c=>`<div><span>${c.t}</span><b>${c.noms[votes[c.k].pick].n}</b></div>`).join("")}</div>
       <button class="aw-btn" id="awShare">שיתוף הסקר <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg></button>`
    :`<div class="aw-eyebrow">נשארו ${AWARDS.length-done} קטגוריות</div><h3>כל קול נספר</h3><p>הצבעה בכל הקטגוריות עוזרת לנו להציב את ספורט הנשים במרכז הבמה.</p>`;
  const sh=document.getElementById("awShare");
  if(sh)sh.onclick=async()=>{const url=SITE+"/מצטיינות-השנה-2026";try{if(navigator.share)await navigator.share({title:"מצטיינות השנה 2026 | WSP",url});else{await navigator.clipboard.writeText(url);toast("הקישור הועתק")}}catch(_){}};
}
function initAwards(){
  const root=document.getElementById("s-awards");
  root.addEventListener("click",async e=>{
    const go=e.target.closest("[data-awgo]");if(go){document.getElementById("aw-"+go.dataset.awgo).scrollIntoView({behavior:"smooth"});return}
    const nom=e.target.closest("[data-nom]");
    if(nom){const cat=nom.closest("[data-cat]").dataset.cat;if(votes[cat]?.locked)return;
      votes[cat]={pick:+nom.dataset.nom};saveVotes();
      const g=nom.parentElement;g.classList.add("picked");g.querySelectorAll(".nom").forEach(n=>{const on=n===nom;n.classList.toggle("sel",on);n.setAttribute("aria-checked",on)});
      const c=AWARDS.find(x=>x.k===cat),btn=root.querySelector(`[data-awlock="${cat}"]`);btn.disabled=false;btn.textContent=`אישור הצבעה ל${c.noms[+nom.dataset.nom].n}`;
      if(navigator.vibrate)navigator.vibrate(12);return}
    const lock=e.target.closest("[data-awlock]");
    if(lock){const cat=lock.dataset.awlock,r=lock.getBoundingClientRect();lock.disabled=true;lock.textContent="שולחת…";
      try{if(VOTE_ENDPOINT)await fetch(VOTE_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({category:cat,nominee:AWARDS.find(x=>x.k===cat).noms[votes[cat].pick].n})});else await new Promise(r=>setTimeout(r,500))}
      catch(_){lock.disabled=false;lock.textContent="השליחה נכשלה. נסו שוב";return}
      votes[cat].locked=true;saveVotes();confetti(r.left+r.width/2,r.top);
      const y=scrollY;renderAwards();scrollTo(0,y);
      document.querySelectorAll(`#aw-${cat} .nom`).forEach(n=>n.classList.add("in"));
      root.querySelectorAll(".aw-cats button").forEach(b=>b.classList.toggle("on",b.dataset.awgo===cat));return}
    const ed=e.target.closest("[data-awedit]");if(ed){votes[ed.dataset.awedit].locked=false;saveVotes();const y=scrollY;renderAwards();scrollTo(0,y);document.querySelectorAll("#awBody .nom").forEach(n=>n.classList.add("in"));return}
    const nx=e.target.closest("[data-awnext]");if(nx){const i=+nx.dataset.awnext+1;(i<AWARDS.length?document.getElementById("aw-"+AWARDS[i].k):document.getElementById("awEnd")).scrollIntoView({behavior:"smooth"});return}
  });
  // highlight current category chip while scrolling
  if("IntersectionObserver" in window){const ob=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const k=en.target.dataset.cat;document.querySelectorAll(".aw-cats button").forEach(b=>{const on=b.dataset.awgo===k;b.classList.toggle("on",on);if(on)b.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"})})}}),{rootMargin:"-40% 0px -55% 0px"});
    new MutationObserver(()=>document.querySelectorAll("#awBody .aw-cat").forEach(c=>ob.observe(c))).observe(document.getElementById("awBody"),{childList:true})}
  renderAwards();
}
/* gold dust + confetti */
let dustRAF;
function startDust(){
  const cv=document.getElementById("awDust"),ctx=cv.getContext("2d");if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  const fit=()=>{cv.width=cv.offsetWidth*devicePixelRatio;cv.height=Math.min(cv.offsetHeight,1400)*devicePixelRatio};fit();
  const P2=Array.from({length:60},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.6+.4,s:Math.random()*.0006+.0002,a:Math.random()*Math.PI*2}));
  cancelAnimationFrame(dustRAF);
  const tick=()=>{ctx.clearRect(0,0,cv.width,cv.height);P2.forEach(p=>{p.y-=p.s;p.a+=.02;if(p.y<0)p.y=1;const x=(p.x+Math.sin(p.a)*.01)*cv.width,y=p.y*cv.height;ctx.globalAlpha=.35+Math.sin(p.a)*.3;ctx.fillStyle=p.r>1.3?"#FFD27A":"#FF8DC0";ctx.beginPath();ctx.arc(x,y,p.r*devicePixelRatio,0,7);ctx.fill()});
    if(document.body.dataset.mode==="awards")dustRAF=requestAnimationFrame(tick)};tick();
}
function confetti(x,y){
  if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  const c=document.createElement("canvas");c.className="confetti";c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);const ctx=c.getContext("2d");
  const cols=["#FF3D8B","#FFD27A","#FF9BC6","#fff","#C77DFF"];
  const ps=Array.from({length:90},()=>({x,y,vx:(Math.random()-.5)*12,vy:-Math.random()*13-4,w:Math.random()*8+4,h:Math.random()*5+3,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cols[Math.random()*cols.length|0]}));
  let t=0;const f=()=>{ctx.clearRect(0,0,c.width,c.height);ps.forEach(p=>{p.vy+=.38;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.globalAlpha=Math.max(0,1-t/90);ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()});
    if(++t<95)requestAnimationFrame(f);else c.remove()};f();
}


/* ===== desktop enhancements: rail arrows + hero arrows ===== */
const DESK=matchMedia("(min-width:1024px)");
function railArrows(root=document){
  root.querySelectorAll(".sec").forEach(sec=>{
    const rail=sec.querySelector(".rail"),head=sec.querySelector(".sec-h");if(!rail||!head||head.querySelector(".rail-nav"))return;
    const nav=document.createElement("div");nav.className="rail-nav";
    nav.innerHTML=`<button aria-label="הקודם" data-d="1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></button><button aria-label="הבא" data-d="-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg></button>`;
    head.appendChild(nav);
    const upd=()=>{const max=rail.scrollWidth-rail.clientWidth,x=Math.abs(rail.scrollLeft);nav.children[0].disabled=x<4;nav.children[1].disabled=x>max-4};
    nav.onclick=e=>{const b=e.target.closest("button");if(!b)return;rail.scrollBy({left:+b.dataset.d*rail.clientWidth*.8,behavior:"smooth"})};
    rail.addEventListener("scroll",upd,{passive:true});new ResizeObserver(upd).observe(rail);new MutationObserver(()=>setTimeout(upd,60)).observe(rail,{childList:true});upd();
  });
}
function heroArrows(){
  const h=document.getElementById("hero");if(h.querySelector(".hero-arrows"))return;
  const d=document.createElement("div");d.className="hero-arrows";
  d.innerHTML=`<button aria-label="הקודם"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></button><button aria-label="הבא"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg></button>`;
  d.children[0].onclick=()=>heroGo(hi-1);d.children[1].onclick=()=>heroGo(hi+1);h.appendChild(d);
}
/* vertical mouse wheel scrolls rails horizontally when hovering them (desktop) */
document.addEventListener("wheel",e=>{if(!DESK.matches||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;const r=e.target.closest(".rail");if(!r||r.closest("#s-video"))return;
  const max=r.scrollWidth-r.clientWidth,x=Math.abs(r.scrollLeft);if((e.deltaY>0&&x>=max-2)||(e.deltaY<0&&x<=2))return;e.preventDefault();r.scrollLeft-=e.deltaY},{passive:false});


/* ===== PWA: install + push notifications =====
   Push delivery needs a backend: set PUSH.vapidPublicKey (VAPID) and PUSH.subscribeUrl
   (endpoint that stores the subscription + chosen topics). Without them the app still
   asks permission, saves topics and can show local notifications.                    */
const PUSH={vapidPublicKey:"",subscribeUrl:""};
const ua=navigator.userAgent;
const isIOS=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
const isAndroid=/android/i.test(ua);
const inApp=/Instagram|FBAN|FBAV|Line\/|TikTok/i.test(ua);
const isStandalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
let deferredPrompt=null,swReg=null;
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

if("serviceWorker" in navigator&&location.protocol.startsWith("http")){
  addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").then(r=>swReg=r).catch(()=>{}));
}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;refreshInstallUI()});
addEventListener("appinstalled",()=>{deferredPrompt=null;LS.set("wsp-installed",true);closeOv("install");toast("האפליקציה הותקנה 🎉");refreshInstallUI()});

function refreshInstallUI(){
  const show=!isStandalone()&&!LS.get("wsp-installed",false);
  document.querySelectorAll(".inst-btn").forEach(b=>b.hidden=!show);
}

/* ---------- overlays ---------- */
function openOv(id){const o=document.getElementById(id);o.hidden=false;document.body.style.overflow="hidden";if(id==="notif")renderNotif();if(id==="install")renderInstall();setTimeout(()=>o.querySelector("[data-close]")?.focus(),50)}
function closeOv(id){const o=document.getElementById(id);if(!o||o.hidden)return;o.hidden=true;if(!document.querySelector(".mov:not([hidden])"))document.body.style.overflow="";if(id==="install")clearInterval(stepTimer)}
document.addEventListener("click",e=>{
  const op=e.target.closest("[data-open]");if(op){e.preventDefault();if(op.dataset.open==="install")closeOv("notif");openOv(op.dataset.open);return}
  const cl=e.target.closest("[data-close]");if(cl){closeOv(cl.closest(".mov").id);return}
  if(e.target.classList.contains("mov"))closeOv(e.target.id);
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".mov:not([hidden])").forEach(o=>closeOv(o.id))});

/* ---------- notifications center ---------- */
const TOPICS=[
 {k:"pod",i:"🎙️",t:"פרקים חדשים בפודקאסט",d:"כל שבוע אורחת חדשה"},
 {k:"shows",i:"📺",t:"התכניות שלנו",d:"התקפה מתפרצת, מגרש מסכם ועוד"},
 {k:"articles",i:"📰",t:"כתבות וראיונות",d:"ידיעות ודעות מצוות הכתבות"},
 {k:"awards",i:"🏆",t:"מצטיינות השנה",d:"פתיחת הצבעה והכרזה על הזוכות"},
 {k:"events",i:"📅",t:"אירועים וכנסים",d:"מפגשים, כנסים ושידורים חיים"}];
const FEED=[
 {id:"f-pod54",k:"pod",href:"#v-I-wK8blhLkY",yt:"I-wK8blhLkY",l:"פרק חדש בפודקאסט",t:"#54: גל חמרני",s:"קפטנית נבחרת הכדורשער"},
 {id:"f-aw26",k:"awards",href:"#awards",em:"🏆",l:"מצטיינות השנה 2026",t:"ההצבעה פתוחה",s:"בחרו את ספורטאיות השנה"},
 {id:"f-art0",k:"articles",href:"#a-0",wix:ARTICLES[0].img,l:"כתבה חדשה",t:ARTICLES[0].t,s:ARTICLES[0].a},
 {id:"f-hm38",k:"shows",href:"#v-5HFdgbtaxAI",yt:"5HFdgbtaxAI",l:"התקפה מתפרצת",t:"פרק 38: מייקל גילת",s:"מהכדורסל המקצועני למסע של שינוי"},
 {id:"f-mm24",k:"shows",href:"#v-POlooD7GplM",yt:"POlooD7GplM",l:"מגרש מסכם",t:"פרק 24: דניאל ברנובסקי",s:"ספיישל כדוריד"}];
let topics=LS.get("wsp-topics",{pod:true,shows:true,articles:true,awards:true,events:false});
const seen=new Set(LS.get("wsp-seen",[]));
function updateBellDot(){const unread=FEED.some(f=>!seen.has(f.id));document.querySelectorAll(".icon-btn.dot").forEach(b=>b.classList.toggle("has",unread));document.querySelectorAll(".nt-dot").forEach(d=>d.hidden=!unread)}
function pushState(){
  if(isIOS&&!isStandalone())return "ios-install";
  if(!("Notification" in window)||!("serviceWorker" in navigator))return "unsupported";
  return Notification.permission; // default | granted | denied
}
const BELL='<div class="bell"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg><i>3</i></div>';
function renderNotif(){
  const st=pushState(),c=document.getElementById("pushCard");
  const on=LS.get("wsp-push-on",false)&&st==="granted";
  c.innerHTML=BELL+({
    "default":`<h3>אל תפספסו אף פרק</h3><p>קבלו התראה ברגע שעולה פרק, כתבה או הצבעה חדשה. רק על מה שתבחרו.</p><button class="btn btn-w" id="pushOn">הפעלת התראות</button>`,
    "granted":on?`<h3>ההתראות פעילות</h3><p>נעדכן אותך לפי הנושאים שבחרת למטה.</p><div class="row"><button class="btn btn-w" id="pushTest">שליחת התראת ניסיון</button><button class="btn btn-wo" id="pushOff">כיבוי</button></div>`
                :`<h3>אל תפספסו אף פרק</h3><p>הדפדפן כבר מאשר התראות. נשאר רק להפעיל.</p><button class="btn btn-w" id="pushOn">הפעלת התראות</button>`,
    "denied":`<h3>ההתראות חסומות</h3><p>חסמת התראות מהאתר. כדי לאפשר: לחצו על סמל המנעול ליד הכתובת, בחרו "הרשאות" ואפשרו "התראות", ואז רעננו את הדף.</p>`,
    "ios-install":`<h3>באייפון זה עובד מהאפליקציה</h3><p>אפל מאפשרת התראות רק אחרי שמוסיפים את WSP למסך הבית. זה לוקח 10 שניות.</p><button class="btn btn-w" data-open="install">איך מתקינים</button>`,
    "unsupported":`<h3>הדפדפן לא תומך בהתראות</h3><p>נסו לפתוח את האתר בכרום או בספארי מעודכנים.</p>`
  }[st]);
  const pOn=document.getElementById("pushOn");if(pOn)pOn.onclick=enablePush;
  const pOff=document.getElementById("pushOff");if(pOff)pOff.onclick=disablePush;
  const pT=document.getElementById("pushTest");if(pT)pT.onclick=()=>localNotify("WSP","ככה תיראה התראה על פרק חדש 🎙️","#p-pod");
  document.getElementById("topics").innerHTML=TOPICS.map(t=>`<label class="topic"><span class="ti">${t.i}</span><div><b>${t.t}</b><span>${t.d}</span></div><span class="sw"><input type="checkbox" id="tp-${t.k}" data-topic="${t.k}" ${topics[t.k]?"checked":""}><i></i></span></label>`).join("");
  document.querySelectorAll("[data-topic]").forEach(i=>i.onchange=()=>{topics[i.dataset.topic]=i.checked;LS.set("wsp-topics",topics);syncSubscription()});
  document.getElementById("feed").innerHTML=FEED.map(f=>`<a class="fi${seen.has(f.id)?"":" new"}" href="${f.href}" data-feed="${f.id}"><span class="fth">${f.yt?`<img src="https://i.ytimg.com/vi/${f.yt}/mqdefault.jpg" alt="" referrerpolicy="no-referrer">`:f.wix?`<img src="${AIMG(f.wix,120,120)}" alt="" referrerpolicy="no-referrer">`:`<em>${f.em}</em>`}</span><div><small>${f.l}</small><b>${f.t}</b><span>${f.s}</span></div></a>`).join("");
  document.querySelectorAll("[data-feed]").forEach(a=>a.onclick=()=>{seen.add(a.dataset.feed);LS.set("wsp-seen",[...seen]);updateBellDot();closeOv("notif")});
}
const b64u=s=>{const p="=".repeat((4-s.length%4)%4),r=atob((s+p).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from([...r].map(c=>c.charCodeAt(0)))};
async function enablePush(){
  try{
    const perm=await Notification.requestPermission();
    if(perm!=="granted"){renderNotif();return}
    const reg=swReg||await navigator.serviceWorker.ready;
    if(PUSH.vapidPublicKey){
      const sub=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(PUSH.vapidPublicKey)});
      LS.set("wsp-sub",sub.toJSON());await syncSubscription();
    }
    LS.set("wsp-push-on",true);renderNotif();
    localNotify("ההתראות הופעלו ✓","מעכשיו נעדכן אותך על תוכן חדש מ־WSP","#home");
  }catch(err){toast("לא הצלחנו להפעיל התראות. נסו שוב.")}
}
async function disablePush(){
  try{const reg=swReg||await navigator.serviceWorker.ready;const sub=await reg.pushManager.getSubscription();if(sub)await sub.unsubscribe()}catch(_){}
  LS.set("wsp-push-on",false);renderNotif();toast("ההתראות כובו");
}
async function syncSubscription(){
  const sub=LS.get("wsp-sub",null);if(!PUSH.subscribeUrl||!sub)return;
  try{await fetch(PUSH.subscribeUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subscription:sub,topics:Object.keys(topics).filter(k=>topics[k])})})}catch(_){}
}
async function localNotify(title,body,url){
  try{const reg=swReg||await navigator.serviceWorker?.ready;if(reg&&Notification.permission==="granted"){reg.showNotification(title,{body,icon:"/icons/icon-192.png",badge:"/icons/badge-96.png",dir:"rtl",lang:"he",data:{url}});return}}catch(_){}
  toast(title);
}

/* ---------- install guide ---------- */
const SHARE_I='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
const PLUS_I='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
const DOTS_I='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>';
const INST_I='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 8v6M9 11l3 3 3-3M8 21h8"/></svg>';
const HOME=`<div class="m-home">${'<i></i>'.repeat(6)}<span class="me"><img src="/icons/icon-192.png" alt=""></span>${'<i></i>'.repeat(5)}</div>`;
const SITE_M='<div class="m-site"><i></i><i></i><i></i><i></i><i></i></div>';
const GUIDES={
 ios:{desk:false,steps:[
   {t:`לחצו על כפתור השיתוף`,d:`בסרגל התחתון של ספארי: <span class="kbd">${SHARE_I} שיתוף</span>`},
   {t:`בחרו "הוסף למסך הבית"`,d:`גללו מעט ברשימה ולחצו על <span class="kbd">${PLUS_I} הוסף למסך הבית</span>`},
   {t:`לחצו "הוסף"`,d:`בפינה העליונה. האייקון של WSP יופיע במסך הבית`}],
  scenes:[
   `${SITE_M}<div class="m-bar"><b></b><b></b><span class="hl" style="width:16px;height:16px;display:grid;place-items:center">${SHARE_I.replace('<svg','<svg width="14" height="14"')}</span><b></b><b></b></div>`,
   `${SITE_M}<div class="m-sheet"><span>העתקה <b></b></span><span>הוספה לרשימת הקריאה</span><span class="go">הוסף למסך הבית ${PLUS_I}</span><span>סימון</span></div>`,
   `${SITE_M}<div class="m-dlg"><div class="r"><span>ביטול</span><b class="hl">הוסף</b></div><div class="ic"><img src="/icons/icon-192.png" alt="">WSP</div></div>`,
   HOME],
  note:"זמין בספארי באייפון ובאייפד. אחרי ההתקנה פתחו את WSP מהמסך הראשי והפעילו התראות."},
 android:{desk:false,steps:[
   {t:`פתחו את התפריט`,d:`בכרום לחצו על <span class="kbd">${DOTS_I}</span> בפינה העליונה`},
   {t:`בחרו "התקנת האפליקציה"`,d:`או "הוספה למסך הבית" בגרסאות מסוימות`},
   {t:`אשרו "התקנה"`,d:`WSP תופיע במסך הבית וברשימת האפליקציות`}],
  scenes:[
   `<div class="m-top"><div class="url"></div><span class="hl" style="display:grid;place-items:center;width:12px;height:14px;color:#555">${DOTS_I.replace('<svg','<svg width="12" height="12"')}</span></div>${SITE_M}`,
   `<div class="m-top"><div class="url"></div><b></b></div>${SITE_M}<div class="m-dlg" style="inset:22px 6px auto 30%"><div class="m-sheet" style="position:static;transform:none;height:auto;background:none;padding:0"><span>כרטיסייה חדשה</span><span>היסטוריה</span><span class="go">התקנת האפליקציה ${INST_I}</span><span>הגדרות</span></div></div>`,
   `${SITE_M}<div class="m-dlg" style="inset:auto 6px 30% 6px"><div class="ic"><img src="/icons/icon-192.png" alt="">להתקין את האפליקציה?</div><div class="btns"><span>ביטול</span><b class="hl">התקנה</b></div></div>`,
   HOME],
  note:"עובד בכרום, סמסונג אינטרנט ואדג'."},
 desktop:{desk:true,steps:[
   {t:`לחצו על סמל ההתקנה`,d:`בקצה שורת הכתובת בכרום או באדג': <span class="kbd">${INST_I}</span>`},
   {t:`אשרו "התקנה"`,d:`בחלונית שנפתחת`},
   {t:`פתחו מהמחשב`,d:`WSP תיפתח בחלון משלה, ותופיע בתפריט התחל או ב־Dock`}],
  scenes:[
   `<div class="m-top"><div class="url"></div><span class="hl" style="display:grid;place-items:center;width:12px;height:12px;color:#555">${INST_I.replace('<svg','<svg width="11" height="11"')}</span></div>${SITE_M}`,
   `<div class="m-top"><div class="url"></div><b></b></div><div class="m-dlg"><div class="ic"><img src="/icons/icon-192.png" alt="">להתקין את WSP?</div><div class="btns"><span>ביטול</span><b class="hl">התקנה</b></div></div>`,
   HOME],
  note:"בספארי במק: תפריט קובץ ← \"הוספה ל־Dock\"."}
};
let plat=isIOS?"ios":isAndroid?"android":"desktop",step=0,stepTimer;
function renderInstall(){
  document.getElementById("inappNote").hidden=!inApp;
  document.getElementById("inappBrowser").textContent=isIOS?"ספארי":"כרום";
  document.querySelectorAll("#platTabs button").forEach(b=>{b.classList.toggle("on",b.dataset.plat===plat);b.onclick=()=>{plat=b.dataset.plat;renderInstall()}});
  const g=GUIDES[plat],mock=document.getElementById("mock");
  mock.className="mock"+(g.desk?" desk":"");
  mock.innerHTML=`<div class="scr">${g.scenes.map((sc,i)=>`<div class="scn" data-s="${i}">${sc}</div>`).join("")}</div>`;
  const st=document.getElementById("steps");
  st.innerHTML=g.steps.map((x,i)=>`<li data-step="${i}"><div><b>${x.t}</b><span>${x.d}</span></div></li>`).join("");
  st.onclick=e=>{const li=e.target.closest("[data-step]");if(li){goStep(+li.dataset.step);restart()}};
  const nowBtn=document.getElementById("installNow"),canPrompt=!!deferredPrompt&&plat!=="ios";
  nowBtn.hidden=!canPrompt;
  nowBtn.onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();const r=await deferredPrompt.userChoice;deferredPrompt=null;if(r.outcome!=="accepted")toast("אפשר להתקין בכל זמן מהתפריט");refreshInstallUI();renderInstall()};
  document.getElementById("inNote").textContent=isStandalone()?"WSP כבר מותקנת במכשיר הזה ✓":(canPrompt?"או לפי השלבים למעלה. ":"")+g.note;
  step=0;goStep(0);restart();
}
function goStep(i){
  const g=GUIDES[plat],n=g.scenes.length;step=(i+n)%n;
  document.querySelectorAll("#mock .scn").forEach(s=>s.classList.toggle("on",+s.dataset.s===step));
  document.querySelectorAll("#steps li").forEach(li=>li.classList.toggle("on",+li.dataset.step===Math.min(step,g.steps.length-1)));
}
function restart(){clearInterval(stepTimer);if(!matchMedia("(prefers-reduced-motion:reduce)").matches)stepTimer=setInterval(()=>goStep(step+1),2600)}

/* ---------- smart banner (mobile, not installed) ---------- */
function maybeBanner(){
  if(isStandalone()||matchMedia("(min-width:1024px)").matches)return;
  const until=LS.get("wsp-ban-until",0);if(Date.now()<until)return;
  const visits=LS.get("wsp-visits",0)+1;LS.set("wsp-visits",visits);
  setTimeout(()=>{if(document.querySelector(".mov:not([hidden])"))return;document.getElementById("appBanner").hidden=false},visits>1?4000:15000);
}
document.getElementById("banX").onclick=()=>{document.getElementById("appBanner").hidden=true;LS.set("wsp-ban-until",Date.now()+14*864e5)};
document.querySelector("#appBanner [data-open]").addEventListener("click",()=>document.getElementById("appBanner").hidden=true);


/* ===== search: close, clear, focus ===== */
let searchFrom="home";
function closeSearch(){go(searchFrom&&searchFrom!=="search"?searchFrom:"home")}
document.getElementById("searchClose").onclick=closeSearch;
document.getElementById("qClear").onclick=()=>{const q=document.getElementById("q");q.value="";q.dispatchEvent(new Event("input"));q.focus()};
document.getElementById("q").addEventListener("input",e=>document.getElementById("qClear").hidden=!e.target.value);
document.getElementById("q").addEventListener("keydown",e=>{if(e.key==="Enter")e.target.blur()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.getElementById("s-search").classList.contains("on")&&!document.querySelector(".mov:not([hidden])"))closeSearch()});



/* ===== personal area: favorites + recently viewed ===== */
let meTab="fav";
function renderMe(){
  let hist=[];try{hist=JSON.parse(localStorage.getItem("wsp-history")||"[]")}catch(_){}
  const favs=favKeys(),vids=favs.filter(k=>!k.startsWith("a:")&&byId[k]).map(k=>byId[k]),arts=favs.filter(k=>k.startsWith("a:")).map(k=>ARTICLES.findIndex(a=>"a:"+a.slug===k)).filter(i=>i>=0);
  const hv=hist.filter(k=>k.startsWith("v-")&&byId[k.slice(2)]),ha=hist.filter(k=>k.startsWith("a-")&&ARTICLES[+k.slice(2)]);
  document.getElementById("meStats").innerHTML=`<div><b>${vids.length}</b><span>פרקים שמורים</span></div><div><b>${arts.length}</b><span>כתבות שמורות</span></div><div><b>${hv.length+ha.length}</b><span>נצפו לאחרונה</span></div>`;
  tabs(document.getElementById("meTabs"),[["fav","מועדפים"],["hist","נצפו לאחרונה"],["set","הגדרות"]],meTab,k=>{meTab=k;renderMe()});
  const body=document.getElementById("meBody");
  const empty=(icon,t,d,cta,key)=>`<div class="me-empty"><div class="ei">${icon}</div><b>${t}</b><p>${d}</p><button class="btn btn-p" data-go="${key}">${cta}</button></div>`;
  const favBtn=k=>`<button class="unfav" data-unfav="${k}" aria-label="הסרה מהמועדפים">${ICON.heart}</button>`;
  if(meTab==="fav"){
    if(!vids.length&&!arts.length){body.innerHTML=empty("🤍","עוד לא שמרת כלום","לחצו על הלב בעמוד של פרק או כתבה, והם יחכו לכם כאן.","לפרקים בפודקאסט","p-pod");return}
    body.innerHTML=(vids.length?`<div class="sec-h me-h"><h2>פרקים <span>ששמרת</span></h2></div><div class="grid me-grid">${vids.map(v=>`<div class="favwrap">${card(v,"")}${favBtn(v.id)}</div>`).join("")}</div>`:"")+
      (arts.length?`<div class="sec-h me-h"><h2>כתבות <span>ששמרת</span></h2></div><div class="alist">${arts.map(i=>`<div class="favwrap">${arow(ARTICLES[i],i)}${favBtn("a:"+ARTICLES[i].slug)}</div>`).join("")}</div>`:"");
  }else if(meTab==="hist"){
    if(!hv.length&&!ha.length){body.innerHTML=empty("🕘","עוד לא צפית בכלום","פרקים וכתבות שתפתחו יופיעו כאן, כדי שיהיה קל לחזור אליהם.","לעמוד הבית","home");return}
    body.innerHTML=(hv.length?`<div class="sec-h me-h"><h2>פרקים <span>אחרונים</span></h2></div><div class="rail">${hv.map(k=>card(byId[k.slice(2)],"c-port")).join("")}</div>`:"")+
      (ha.length?`<div class="sec-h me-h"><h2>כתבות <span>אחרונות</span></h2></div><div class="alist">${ha.map(k=>arow(ARTICLES[+k.slice(2)],+k.slice(2))).join("")}</div>`:"")+
      `<div class="me-clear"><button class="btn btn-ghost" id="clearHist">ניקוי ההיסטוריה</button></div>`;
    document.getElementById("clearHist").onclick=()=>{try{localStorage.removeItem("wsp-history")}catch(_){}renderMe();toast("ההיסטוריה נוקתה")};
  }else{
    const pushOn=LS.get("wsp-push-on",false)&&("Notification" in window)&&Notification.permission==="granted";
    body.innerHTML=`<div class="me-set">
      <button class="me-row" data-open="notif"><span class="ri">🔔</span><div><b>התראות</b><span>${pushOn?"פעילות":"כבויות"} · בחירת נושאים</span></div><i>‹</i></button>
      ${isStandalone()?"":`<button class="me-row" data-open="install"><span class="ri">📲</span><div><b>התקנת האפליקציה</b><span>WSP במסך הבית שלך</span></div><i>‹</i></button>`}
      <button class="me-row" data-go="awards"><span class="ri">🏆</span><div><b>ההצבעות שלי</b><span>מצטיינות השנה 2026</span></div><i>‹</i></button>
      <p class="me-note">המועדפים וההיסטוריה נשמרים במכשיר הזה בלבד.</p></div>`;
  }
  hydrate(body);realLinks(body);
  body.querySelectorAll("[data-unfav]").forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();const w=b.closest(".favwrap");w.classList.add("bye");setTimeout(()=>{toggleFav(b.dataset.unfav,false);renderMe()},280)});
}

/* ===== floating mini player: video follows the reader while it is playing ===== */
const mini={state:-1,heroVisible:true,dismissed:false,floating:false,el:null,pl:null,io:null,
  attach(el,pl){this.detach();this.el=el;this.pl=pl;this.state=1;this.dismissed=false;
    const f=pl.querySelector("iframe");
    const hello=()=>{try{f.contentWindow.postMessage(JSON.stringify({event:"listening",id:"wsp",channel:"widget"}),"*");f.contentWindow.postMessage(JSON.stringify({event:"command",func:"addEventListener",args:["onStateChange"],id:"wsp",channel:"widget"}),"*")}catch(_){}};
    f.addEventListener("load",()=>{hello();setTimeout(hello,800)});
    this.io=new IntersectionObserver(([en])=>{this.heroVisible=en.intersectionRatio>.35;if(this.heroVisible)this.dismissed=false;this.update()},{threshold:[0,.35,.6,1]});
    this.io.observe(el.querySelector(".vhero"));
    pl.querySelector(".mini-ctl").onclick=e=>{const b=e.target.closest("[data-mini]");if(!b)return;e.stopPropagation();
      if(b.dataset.mini==="expand"){this.dismissed=true;this.update();scrollTo({top:0,behavior:"smooth"})}
      else{this.cmd("pauseVideo");this.dismissed=true;this.update()}};
  },
  detach(){if(this.io)this.io.disconnect();this.io=null;if(this.el)this.el.classList.remove("mini");document.body.classList.remove("has-mini");this.floating=false;this.el=this.pl=null},
  cmd(func){try{this.pl.querySelector("iframe").contentWindow.postMessage(JSON.stringify({event:"command",func,args:[],id:"wsp",channel:"widget"}),"*")}catch(_){}},
  update(){if(!this.el)return;
    const playing=this.state===1||this.state===3;
    const want=!this.heroVisible&&!this.dismissed&&(playing||(this.floating&&this.state===2));
    if(want!==this.floating){this.floating=want;this.el.classList.toggle("mini",want);document.body.classList.toggle("has-mini",want)}}
};
addEventListener("message",e=>{
  if(!mini.el||!/(^|\.)youtube(-nocookie)?\.com$/.test((()=>{try{return new URL(e.origin).hostname}catch(_){return""}})()))return;
  let d;try{d=typeof e.data==="string"?JSON.parse(e.data):e.data}catch(_){return}
  if(d&&d.event==="infoDelivery"&&d.info&&typeof d.info.playerState==="number"){mini.state=d.info.playerState;mini.update()}
  else if(d&&d.event==="onStateChange"){mini.state=typeof d.info==="number"?d.info:d.info?.playerState;mini.update()}
});

/* ===== ROUTER (real URLs via History API) + SEO meta + breadcrumbs ===== */
const SEO=window.WSPSEO;
const screens=[...document.querySelectorAll(".screen")];
let lastTap=null,curKey=null,firstKey=null;
document.getElementById("seo-static")?.remove();
function keyFromLocation(){
  const h=decodeURIComponent(location.hash.slice(1));
  if(h&&SEO.isKey(h))return h; // legacy #links
  return SEO.pathToKey(location.pathname)||"home";
}
function go(key,{replace=false}={}){
  const path=SEO.keyToPath(key)+(key==="about-contact"?"#contact":key==="about-team"?"#team":"");
  history[replace?"replaceState":"pushState"]({key},"",path);navigate(key);
}
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-vt]");if(t)lastTap=t;
  const g=e.target.closest("[data-go]");if(g){e.preventDefault();go(g.dataset.go);return}
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest("a[href]");if(!a||a.target==="_blank"||a.hasAttribute("download"))return;
  const href=a.getAttribute("href");
  if(href.startsWith("#")){const k=decodeURIComponent(href.slice(1));if(SEO.isKey(k)){e.preventDefault();go(k)}return}
  if(href.startsWith("/")&&!/\.[a-z0-9]{2,5}$/i.test(href.split(/[?#]/)[0])){const k=SEO.pathToKey(href.split(/[?#]/)[0]);if(k){e.preventDefault();go(k)}}
});
/* turn generated "#key" links into real crawlable URLs */
function realLinks(root=document){root.querySelectorAll('a[href^="#"]').forEach(a=>{const k=decodeURIComponent(a.getAttribute("href").slice(1));if(SEO.isKey(k))a.setAttribute("href",SEO.keyToPath(k))})}
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('a[href^="#"]'))realLinks(n.parentNode||document);else realLinks(n)}}))).observe(document.body,{childList:true,subtree:true});

function setMeta(info){
  if(!info)return;
  const url=location.origin+SEO.keyToPath(info.key);
  document.title=info.title;
  const meta=(attr,name,val)=>{let m=document.head.querySelector(`meta[${attr}="${name}"]`);if(!m){m=document.createElement("meta");m.setAttribute(attr,name);document.head.appendChild(m)}m.setAttribute("content",val)};
  meta("name","description",info.desc);meta("name","robots",info.noindex?"noindex,follow":"index,follow,max-image-preview:large");
  meta("property","og:title",info.title);meta("property","og:description",info.desc);meta("property","og:url",url);meta("property","og:image",info.image);meta("property","og:type",info.type);
  meta("name","twitter:card","summary_large_image");meta("name","twitter:title",info.title);meta("name","twitter:description",info.desc);meta("name","twitter:image",info.image);
  let c=document.head.querySelector('link[rel="canonical"]');if(!c){c=document.createElement("link");c.rel="canonical";document.head.appendChild(c)}c.href=url;
  let ld=document.getElementById("ld");if(!ld){ld=document.createElement("script");ld.type="application/ld+json";ld.id="ld";document.head.appendChild(ld)}
  ld.textContent=JSON.stringify(SEO.jsonLd(info,location.origin));
}
/* breadcrumbs: one slot per screen */
const CRUMB_SLOT={me:["#s-me",".top","after"],programs:["#s-programs",".top","after"],articles:["#s-articles",".top","after"],search:["#s-search",".top","after"],about:["#s-about",null,"prepend"],
  awards:["#s-awards",".aw-top","after",1],program:["#s-program",".vtop","after",1],video:["#s-video",".vbody","prepend"],article:["#s-article",".ahero .crumb","inside",1]};
function mountCrumbs(scr,info){
  document.querySelectorAll(".screen:not(#s-"+scr+") .crumbs-slot").forEach(n=>n.innerHTML="");
  const cfg=CRUMB_SLOT[scr];if(!cfg||!info)return;
  const [sel,anchor,where,light]=cfg,root=document.querySelector(sel);if(!root)return;
  let slot=root.querySelector(":scope .crumbs-slot");
  if(!slot){slot=document.createElement("div");slot.className="crumbs-slot";
    const an=anchor?root.querySelector(anchor):null;
    if(where==="inside"&&an)an.appendChild(slot);else if(where==="after"&&an)an.after(slot);else if(where==="prepend"&&an)an.prepend(slot);else root.prepend(slot)}
  slot.innerHTML=SEO.crumbsHTML(info,{light:!!light});
}
function route(h){
  let scr="home",tab=h;
  if(h.startsWith("v-")){scr="video";renderVideo(h.slice(2));tab=""}
  else if(h.startsWith("p-")){const k=h.slice(2);if(!P[k]){go("home",{replace:true});return}scr="program";renderProgram(k);tab=k==="pod"?"p-pod":"programs"}
  else if(h.startsWith("a-")){scr="article";renderArticle(+h.slice(2));tab="articles"}
  else if(["programs","search","about","home","articles","awards","me"].includes(h))scr=h;
  else if(h==="about-contact"||h==="about-team"){scr="about";tab="about"}
  closeSheet();
  if(scr!=="video"){mini.detach();const pl=document.querySelector("#s-video .player");if(pl){pl.innerHTML="";pl.classList.remove("on")}document.getElementById("s-video").classList.remove("playing")}
  screens.forEach(s=>s.classList.toggle("on",s.id==="s-"+scr));
  document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("on",b.dataset.tab===tab));
  window.scrollTo(0,0);
  if(scr==="me")renderMe();if(h.startsWith("v-")||h.startsWith("a-"))pushHistory(h);
  const info=SEO.pageInfo(h);setMeta(info);mountCrumbs(scr,info);realLinks(document.getElementById("s-"+scr));
  if(scr==="about"){requestAnimationFrame(aboutEnter);if(h!=="about")setTimeout(()=>document.getElementById(h==="about-contact"?"abContact":"abTeam")?.scrollIntoView({behavior:"smooth"}),300)}
  if(scr==="search"){const q=new URLSearchParams(location.search).get("q");const qi=document.getElementById("q");if(q){qi.value=q;qi.dispatchEvent(new Event("input"))}setTimeout(()=>qi.focus({preventScroll:true}),350)}
  if(scr==="video"||scr==="article")railArrows(document.getElementById("s-"+scr));
  const was=document.body.dataset.mode;document.body.dataset.mode=scr==="awards"?"awards":"";
  if(scr==="awards"&&was!=="awards"){requestAnimationFrame(()=>{startDust();document.querySelectorAll("#awBody .nom").forEach(n=>io?io.observe(n):n.classList.add("in"))})}
}
function navigate(key=keyFromLocation()){
  const prev=curKey;curKey=key;if(key==="search"&&prev&&prev!=="search")searchFrom=prev;
  const goingVideo=key.startsWith("v-")&&lastTap&&document.startViewTransition&&!matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(goingVideo){const th=lastTap.querySelector(".th");if(th)th.style.viewTransitionName="vthumb";
    document.startViewTransition(()=>{if(th)th.style.viewTransitionName="";route(key);const n=document.querySelector("#s-video .vt-img");if(n){n.style.viewTransitionName="vthumb";requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>n.style.viewTransitionName="",600)))}});lastTap=null}
  else route(key);
}
addEventListener("popstate",()=>navigate());
addEventListener("hashchange",()=>{const h=decodeURIComponent(location.hash.slice(1));if(SEO.isKey(h)){history.replaceState({key:h},"",SEO.keyToPath(h));navigate(h)}});

renderStories();renderHero();renderPod();renderProg();renderPicks();renderShorts();renderPlist();renderSearch();renderAbout();renderArticlesHome();renderArticles();initAwards();railArrows();heroArrows();refreshInstallUI();updateBellDot();maybeBanner();updateFavCount();
hydrate();
(function boot(){const k=keyFromLocation();firstKey=k;
  if(location.hash&&SEO.isKey(decodeURIComponent(location.hash.slice(1))))history.replaceState({key:k},"",SEO.keyToPath(k)+location.search);
  realLinks();navigate(k)})();
