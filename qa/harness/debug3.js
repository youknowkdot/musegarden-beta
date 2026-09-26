const fs = require("fs");
const path = require("path");
const BUILD_UNDER_TEST = process.argv[2] || path.join(__dirname, "..", "..", "musegarden-beta-slice.html");
const html = fs.readFileSync(BUILD_UNDER_TEST, "utf8");
let script = html.split("<script>")[1].split("</script>")[0];
script += "\n;global.__dbg = function(){ return { t: new Date(currentTime).toISOString(), j: journal.map(function(a){ return [a.type, a.questId||a.bountyId||'', new Date(a.time).toISOString(), a.order]; }) }; };";
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
function clickQuest(id){const b=new El("qb");b.dataset.quest=id;b.disabled=false;fire(getEl("questList"),"click",{stopPropagation(){},target:{closest:(s)=>s===".quest"?b:null}});}
function clickBounty(id){const b=new El("bb");b.dataset.bounty=id;b.disabled=false;fire(getEl("bountyList"),"click",{stopPropagation(){},target:{closest:(s)=>s===".bounty"?b:null}});}
function scrub(d){getEl("timelineSlider").value=String(d);fire(getEl("timelineSlider"),"input");}
fire(getEl("resetBtn"),"click");
fire(getEl("seedCard"),"click"); fire(getEl("treeButton"),"click"); fire(getEl("treeButton"),"click");
clickBounty("first-planting");
for (let d = 0; d <= 1; d += 0.5) {
  scrub(d);
  clickQuest("tend"); clickQuest("journal");
}
const dbg = global.__dbg();
console.log("currentTime:", dbg.t);
console.log("journal:", JSON.stringify(dbg.j, null, 0));
