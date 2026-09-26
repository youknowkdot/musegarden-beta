const fs = require("fs");
const path = require("path");
const BUILD_UNDER_TEST = process.argv[2] || path.join(__dirname, "..", "..", "musegarden-beta-slice.html");
const html = fs.readFileSync(BUILD_UNDER_TEST, "utf8");
const script = html.split("<script>")[1].split("</script>")[0];
let now = 1_700_000_000_000; Date.now = () => now;
function makeClassList(){const s=new Set();return{add(...c){c.forEach(x=>s.add(x));},remove(...c){c.forEach(x=>s.delete(x));},toggle(c,f){if(f===undefined){s.has(c)?s.delete(c):s.add(c);}else{if(f)s.add(c);else s.delete(c);}return s.has(c);},contains(c){return s.has(c);}};}
class El{constructor(id){this.id=id;this.innerHTML="";this.textContent="";this.className="";this.classList=makeClassList();this.style={setProperty:(k,v)=>{this.style[k]=v;}};this.disabled=false;this.value="";this.dataset={};this.listeners={};this.scrollHeight=1000;this.scrollTop=0;this.clientHeight=100;this.attrs={};}
addEventListener(t,f){(this.listeners[t]=this.listeners[t]||[]).push(f);}setAttribute(k,v){this.attrs[k]=v;}closest(){return null;}}
const els={};const getEl=(id)=>els[id]||(els[id]=new El(id));
const speedBtns=[0,1,60,240,1440].map(s=>{const e=new El("s"+s);e.dataset.speed=String(s);return e;});
global.document={getElementById:(id)=>getEl(id),querySelector:(sel)=>sel===".speed-control"?getEl("sc"):new El("x"),querySelectorAll:(sel)=>sel===".speed-btn"?speedBtns:[]};
global.window=global;let intervalFn=null;global.setInterval=(fn)=>{intervalFn=fn;return 1;};global.setTimeout=()=>0;global.clearTimeout=()=>{};
eval(script);
function fire(el,type,evt){(el.listeners[type]||[]).forEach(f=>f(evt||{stopPropagation(){},target:el}));}
const fakeEv=(t,sel)=>({stopPropagation(){},target:{closest:(s)=>s===sel?t:null}});
function clickStage(i){const b=new El("st");b.dataset.stage=String(i);b.disabled=false;fire(getEl("treeMeta"),"click",fakeEv(b,".stage-jump-btn"));}
function scrub(d){getEl("timelineSlider").value=String(d);fire(getEl("timelineSlider"),"input");}
function setSpeed(s){fire(speedBtns.find(x=>x.dataset.speed===String(s)),"click");}
function tick(n){for(let i=0;i<n;i++){now+=1000;intervalFn();}}
const R=[];
function check(n,ok,det){R.push((ok?"PASS":"FAIL")+": "+n+(ok?"":"\n    "+det));}
const stage=()=>getEl("stageReadout").textContent;
const prog=()=>{const m=getEl("treeMeta").innerHTML.match(/--progress:([\d.]+)%/);return m?parseFloat(m[1]):null;};

// E2 redo: stage jump while unplanted (guarded by !planted AND disabled attr)
fire(getEl("resetBtn"),"click");
check("E2a unplanted readout", stage()==="UNPLANTED", stage());
clickStage(3); // hostile enabled-fake click; app guard !sim.plant.planted must stop it
check("E2b guarded stage click while unplanted: still UNPLANTED", stage()==="UNPLANTED", stage());
check("E2c real buttons rendered disabled while unplanted", /disabled/.test(getEl("treeMeta").innerHTML), "");

// E3 redo: slider to 45 does NOT force-pause (tick path does)
fire(getEl("resetBtn"),"click"); fire(getEl("seedCard"),"click"); fire(getEl("treeButton"),"click");
setSpeed(60); scrub(45);
const pausedAt45 = speedBtns[0].classList.contains("active");
check("E3a slider-to-45 forces pause like tick-path does", pausedAt45, "speed60 active="+speedBtns[2].classList.contains("active"));
const c0=getEl("demoClock").textContent; tick(5);
check("E3b time frozen at 45 even with 60x showing", getEl("demoClock").textContent===c0, c0+" -> "+getEl("demoClock").textContent);

// E8 redo: progress var advances
fire(getEl("resetBtn"),"click"); fire(getEl("seedCard"),"click"); fire(getEl("treeButton"),"click"); fire(getEl("treeButton"),"click");
setSpeed(0); const p0=prog(); scrub(1); const p1=prog(); scrub(1.99); const p2=prog();
check("E8 germination progress advances", p0<p1 && p1<p2, p0+" -> "+p1+" -> "+p2);

// E1b redo: boundary logic from source
check("E1b block is reservoir+0.0001 < 1.5 (==1.5 allowed)", /reservoir \+ 0\.0001 < TREE\.appetite/.test(script), "");

// E9: water button disabled while unplanted (real UI)
fire(getEl("resetBtn"),"click");
check("E9 tree button disabled while unplanted", getEl("treeButton").disabled===true, String(getEl("treeButton").disabled));

// E10: toast clears? (fake timers never fire; document only)
console.log(R.join("\n"));
console.log("EDGE2: "+R.filter(r=>r.startsWith("PASS")).length+" pass, "+R.filter(r=>r.startsWith("FAIL")).length+" fail");
