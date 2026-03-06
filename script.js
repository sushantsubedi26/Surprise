
// ══════════════════════════════════════════
//  CURSOR
// ══════════════════════════════════════════
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
let mx = -100, my = -100;
document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + "px";
  cursor.style.top  = my + "px";
  ring.style.left   = mx + "px";
  ring.style.top    = my + "px";
});
document.querySelectorAll("button").forEach(b => {
  b.addEventListener("mouseenter", () => { cursor.style.width = "28px"; cursor.style.height = "28px"; });
  b.addEventListener("mouseleave", () => { cursor.style.width = "18px"; cursor.style.height = "18px"; });
});

// ══════════════════════════════════════════
//  ANIMATED BACKGROUND CANVAS
// ══════════════════════════════════════════
const bgC = document.getElementById("bg-canvas");
const bgX = bgC.getContext("2d");
bgC.width = window.innerWidth; bgC.height = window.innerHeight;
window.addEventListener("resize", () => { bgC.width = window.innerWidth; bgC.height = window.innerHeight; });

const stars = Array.from({length:120}, () => ({
  x: Math.random()*window.innerWidth,
  y: Math.random()*window.innerHeight,
  r: Math.random()*1.5+0.3,
  a: Math.random(),
  speed: Math.random()*0.008+0.002,
  hue: Math.random()*40+330
}));

function drawBg() {
  bgX.clearRect(0,0,bgC.width,bgC.height);
  // Deep gradient bg
  const grad = bgX.createRadialGradient(bgC.width/2, bgC.height/2, 0, bgC.width/2, bgC.height/2, bgC.width*0.8);
  grad.addColorStop(0, "#1a0020");
  grad.addColorStop(1, "#060008");
  bgX.fillStyle = grad;
  bgX.fillRect(0,0,bgC.width,bgC.height);
  // Mouse glow
  if (mx > 0) {
    const mg = bgX.createRadialGradient(mx,my,0,mx,my,300);
    mg.addColorStop(0, "rgba(255,107,157,0.06)");
    mg.addColorStop(1, "transparent");
    bgX.fillStyle = mg;
    bgX.fillRect(0,0,bgC.width,bgC.height);
  }
  // Twinkling stars
  stars.forEach(s => {
    s.a += s.speed;
    const alpha = (Math.sin(s.a)*0.5+0.5)*0.8;
    bgX.beginPath();
    bgX.arc(s.x,s.y,s.r,0,Math.PI*2);
    bgX.fillStyle = `hsla(${s.hue},80%,80%,${alpha})`;
    bgX.fill();
  });
  requestAnimationFrame(drawBg);
}
drawBg();

// ══════════════════════════════════════════
//  HEART TRAIL CANVAS
// ══════════════════════════════════════════
const tc = document.getElementById("heartTrail");
const tx = tc.getContext("2d");
tc.width = window.innerWidth; tc.height = window.innerHeight;
window.addEventListener("resize", () => { tc.width=window.innerWidth; tc.height=window.innerHeight; });

let trailParticles = [];
const EMOJIS = ["💖","✨","💕","🌸","💗","⭐","🌟"];
document.addEventListener("mousemove", e => {
  if(Math.random()>0.45) return;
  trailParticles.push({
    x:e.clientX, y:e.clientY,
    size: Math.random()*16+8,
    speedX:(Math.random()-0.5)*2.5,
    speedY:-Math.random()*3-1,
    opacity:1,
    emoji: EMOJIS[Math.floor(Math.random()*EMOJIS.length)]
  });
});
function drawTrail() {
  tx.clearRect(0,0,tc.width,tc.height);
  for(let i=trailParticles.length-1;i>=0;i--) {
    const p=trailParticles[i];
    tx.globalAlpha=p.opacity;
    tx.font=`${p.size}px serif`;
    tx.fillText(p.emoji,p.x,p.y);
    p.x+=p.speedX; p.y+=p.speedY; p.opacity-=0.03;
    if(p.opacity<=0) trailParticles.splice(i,1);
  }
  requestAnimationFrame(drawTrail);
}
drawTrail();

// ══════════════════════════════════════════
//  FLOATING BACKGROUND HEARTS
// ══════════════════════════════════════════
function spawnHeart() {
  const h = document.createElement("span");
  h.className="floatHeart";
  h.textContent=["💗","💖","💓","🌸","✨","🌷","💝"][Math.floor(Math.random()*7)];
  h.style.left=Math.random()*100+"vw";
  const dur=Math.random()*5+6;
  h.style.animationDuration=dur+"s";
  h.style.fontSize=(Math.random()*1.2+0.5)+"rem";
  document.body.appendChild(h);
  setTimeout(()=>h.remove(),dur*1000);
}
setInterval(spawnHeart,700);

// ══════════════════════════════════════════
//  SOUND
// ══════════════════════════════════════════
function playPop(freq=600,type="sine") {
  try {
    const ac=new AudioContext();
    const o=ac.createOscillator(), g=ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.frequency.value=freq; o.type=type;
    g.gain.setValueAtTime(0.25,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.25);
    o.start(); o.stop(ac.currentTime+0.25);
  } catch(e){}
}
function playSuccess() {
  [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playPop(f,"sine"),i*110));
}
function playNope() { playPop(200,"sawtooth"); }

// ══════════════════════════════════════════
//  CONFETTI
// ══════════════════════════════════════════
function launchConfetti() {
  const colors=["#ff6b9d","#ff9de2","#fff","#ffd6e7","#ffb3c6","#ff85a1","#ffcc02"];
  for(let i=0;i<140;i++) {
    setTimeout(()=>{
      const p=document.createElement("div");
      p.className="confetti-piece";
      const size=Math.random()*10+5;
      const isCircle=Math.random()>0.4;
      p.style.cssText=`width:${size}px;height:${isCircle?size:size*0.4}px;background:${colors[Math.floor(Math.random()*colors.length)]};
        border-radius:${isCircle?"50%":"2px"};top:50%;left:50%;opacity:1;transition:all ${Math.random()*1.2+0.8}s ease-out;`;
      document.body.appendChild(p);
      requestAnimationFrame(()=>{
        const a=Math.random()*Math.PI*2;
        const d=Math.random()*Math.max(window.innerWidth,window.innerHeight)*0.65+80;
        p.style.transform=`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px)) rotate(${Math.random()*720}deg)`;
        p.style.opacity="0";
      });
      setTimeout(()=>p.remove(),2500);
    },i*10);
  }
}

// ══════════════════════════════════════════
//  RIPPLE ON CLICK
// ══════════════════════════════════════════
document.querySelectorAll("button").forEach(btn=>{
  btn.addEventListener("click",function(e){
    const r=document.createElement("span");
    r.className="ripple";
    const rect=btn.getBoundingClientRect();
    const size=Math.max(rect.width,rect.height);
    r.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    btn.style.position="relative";
    btn.style.overflow="hidden";
    btn.appendChild(r);
    setTimeout(()=>r.remove(),600);
  });
});

// ══════════════════════════════════════════
//  SLIDE TRANSITION
// ══════════════════════════════════════════
function slideOut(sel,cb) {
  const el=document.querySelector(sel);
  gsap.to(el,{ x:"-110%",opacity:0,duration:0.8,ease:"power3.inOut",
    onComplete:()=>{ el.classList.add("hidden"); gsap.set(el,{x:0,opacity:1}); if(cb)cb(); }
  });
}
function popIn(sel) {
  const el=document.querySelector(sel);
  el.classList.remove("hidden");
  gsap.fromTo(el,{opacity:0,scale:0.75,y:30},{opacity:1,scale:1,y:0,duration:0.6,ease:"back.out(1.8)"});
}

// ══════════════════════════════════════════
//  NO BUTTON LOGIC
// ══════════════════════════════════════════
const yesBtn=document.getElementById("yesbutton");
const noBtn=document.getElementById("nobutton");
const hearts=document.querySelectorAll(".hp");
let noCount=0;
const noMsgs=["Nah try again 😏","Come onnnn 😩","Seriously? 😤","Your loss! 😤","Still no?? 😱","Last chance 👀"];

// No button RUN AWAY on hover
noBtn.addEventListener("mouseenter",()=>{
  if(noCount>=3) {
    const card=document.getElementById("thirdcard");
    const cRect=card.getBoundingClientRect();
    const bRect=noBtn.getBoundingClientRect();
    let nx=bRect.left+(Math.random()-0.5)*200;
    let ny=bRect.top+(Math.random()-0.5)*150;
    nx=Math.max(cRect.left+10, Math.min(cRect.right-80, nx));
    ny=Math.max(cRect.top+10, Math.min(cRect.bottom-50, ny));
    gsap.to(noBtn,{left:nx-cRect.left+"px",top:ny-cRect.top+"px",duration:0.3,ease:"power2.out",
      onStart:()=>{ noBtn.style.position="absolute"; }
    });
  }
});

noBtn.addEventListener("click",()=>{
  playNope();
  noCount++;

  // Shake card
  const card=document.getElementById("thirdcard");
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");

  // Grow yes button
  const yh=yesBtn.offsetHeight, yw=yesBtn.offsetWidth;
  yesBtn.style.height=(yh*1.12)+"px";
  yesBtn.style.width=(yw*1.12)+"px";
  yesBtn.style.fontSize=parseFloat(getComputedStyle(yesBtn).fontSize)*1.05+"px";

  // Shrink no button
  noBtn.style.transform=`scale(${Math.max(0.3,1-noCount*0.12)})`;
  noBtn.textContent=noMsgs[Math.min(noCount-1,noMsgs.length-1)];

  // Activate hearts
  if(noCount<=5) {
    hearts[5-noCount].textContent="💖";
    hearts[5-noCount].classList.add("active");
  }

  // Hide after 6 clicks
  if(noCount>=6) noBtn.style.display="none";
});

// ══════════════════════════════════════════
//  YES BUTTON
// ══════════════════════════════════════════
yesBtn.addEventListener("click",()=>{
  playSuccess();
  launchConfetti();
  slideOut("#page3",()=>{
    const vp=document.querySelector("#videopage");
    const vid=vp.querySelector("video");
    vp.classList.remove("hidden");
    gsap.fromTo(vp,{opacity:0,scale:0.7},{opacity:1,scale:1,duration:0.5,ease:"back.out(1.7)"});
    vid.play();
    setTimeout(()=>{
      gsap.to(vp,{opacity:0,scale:0.8,duration:0.4,ease:"power2.in",
        onComplete:()=>{
          vp.classList.add("hidden");
          gsap.set(vp,{opacity:1,scale:1});
          popIn("#page4");
          launchConfetti(); // second burst!
        }
      });
    },2500);
  });
});

// ══════════════════════════════════════════
//  PAGE NAV
// ══════════════════════════════════════════
document.getElementById("first-button").addEventListener("click",()=>{ playPop(); slideOut("#page1",()=>popIn("#page2")); });
document.getElementById("second-button").addEventListener("click",()=>{ playPop(700); slideOut("#page2",()=>popIn("#page3")); });

// ══════════════════════════════════════════
//  INITIAL ENTRANCE
// ══════════════════════════════════════════
gsap.fromTo("#page1 .card",{opacity:0,scale:0.6,y:60},{opacity:1,scale:1,y:0,duration:0.9,ease:"back.out(2)",delay:0.2});
