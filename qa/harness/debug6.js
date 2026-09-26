// Exact harness greedy replica INCLUDING auto-bounty claims, then scrub(0)
const fs = require("fs");
const path = require("path");
const BUILD_UNDER_TEST = process.argv[2] || path.join(__dirname, "..", "..", "musegarden-beta-slice.html");
const html = fs.readFileSync(BUILD_UNDER_TEST, "utf8");
let script = html.split("<script>")[1].split("</script>")[0];
script = script.replace("var journal = [];", "var journal = [];\n      window.__J = function(){ return journal.map(function(a){ return {type:a.type, q:a.questId||null, b:a.bountyId||null, t:(a.time-8*3600*1000)/86400000, o:a.order}; }); };");
let now = 1_700_000_000_000;
Date.now = () => now;
function makeClassList(){const s=new Set();return{add(...c){c.forEach(x=>s.add(x));},remove(...c){c.forEach(x=>s.delete(x));},toggle(c,f){if(f===undefined){s.has(c)?s.delete(c):s.add(c);}else{if(f)s.add(c);else s.delete(c);}return s.has(c);},contains(c){return s.has(c);}};}
class El{constructor(id){this.id=id;this.innerHTML="";this.textContent="";this.className="";this.classList=makeClassList();this.style={setProperty:(k,v)=>{this.style[k]=v;}};this.disabled=false;this.value="";this.dataset={};this.listeners={};this.scrollHeight=1000;this.scrollTop=0;this.clientHeight=100;this.attrs={};}
addEventListener(t,f){(this.listeners[t]=this.listeners[t]||[]).push(f);}setAttribute(k,v){this.attrs[k]=v;}closest(){return null;}}
const els={};const getEl=(id)=>els[id]||(els[id]=new El(id));
const speedBtns=[0,1,60,240,1440].map(s=>{const e=new El("s"+s);e.dataset.speed=String(s);return e;});
global.document={getElementById:(id)=>getEl(id),querySelector:(sel)=>sel===".speed-control"?getEl("sc"):new El("x"),querySelectorAll:(sel)=>sel===".speed-btn"?speedBtns:[]};
global.window=global;global.setInterval=(fn)=>0;global.setTimeout=()=>0;global.clearTimeout=()=>{};
eval(script);
function fire(el,type,evt){(el.listeners[type]||[]).forEach(f=>f(evt||{stopPropagation(){},target:el}));}
const fakeEv=(t,sel)=>({stopPropagation(){},target:{closest:(s)=>s===sel?t:null}});
function clickQuest(id){const b=new El("qb");b.dataset.quest=id;b.disabled=false;fire(getEl("questList"),"click",fakeEv(b,".quest"));}
function clickBounty(id){const b=new El("bb");b.dataset.bounty=id;b.disabled=false;fire(getEl("bountyList"),"click",fakeEv(b,".bounty"));}
function scrub(d){getEl("timelineSlider").value=String(d);fire(getEl("timelineSlider"),"input");}
function setSpeed(s){const b=speedBtns.find(x=>x.dataset.speed===String(s));fire(b,"click");}
function bountyState(id){const m=getEl("bountyList").innerHTML.match(new RegExp('data-bounty="'+id+'"[^>]*>.*?<span class="quest-state">([A-Z]+)</span>'));return m?m[1]:"?";}

fire(getEl("resetBtn"),"click");
fire(getEl("seedCard"),"click"); fire(getEl("treeButton"),"click"); fire(getEl("treeButton"),"click");
setSpeed(0);
clickBounty("first-planting");
for (let d = 0; d <= 45; d += 0.5) {
  scrub(d);
  clickQuest("tend"); clickQuest("journal");
  const ws = getEl("waterStatus").textContent;
  if (ws === "Thirsty" || ws === "Withering") fire(getEl("treeButton"),"click");
  if (bountyState("three-waterings") === "CLAIM") clickBounty("three-waterings");
  if (bountyState("sprout-emerges") === "CLAIM") clickBounty("sprout-emerges");
}
const J = global.__J();
console.log("total:", J.length);
const d0 = J.filter(a=>a.t<=0.0001);
console.log("actions with t<=~0:", JSON.stringify(d0.map(a=>[a.type,a.q||a.b||"",a.t,a.o])));
scrub(0);
console.log("scrub(0): res=", getEl("reservoirValue").textContent, "xp=", getEl("xpCount").textContent);
console.log("events:", [...getEl("eventLog").innerHTML.matchAll(/<span class="event-text">([^<]*)<\/span>/g)].map(m=>m[1]).join(" | "));
