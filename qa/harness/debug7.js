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
global.window=global;global.setInterval=(fn)=>0;global.setTimeout=()=>0;global.clearTimeout=()=>{};
eval(script);
function fire(el,type,evt){(el.listeners[type]||[]).forEach(f=>f(evt||{stopPropagation(){},target:el}));}
const fakeEv=(t,sel)=>({stopPropagation(){},target:{closest:(s)=>s===sel?t:null}});
console.log("treeStage after load:", JSON.stringify(getEl("treeStage").textContent));
fire(getEl("resetBtn"),"click");
console.log("treeStage after reset:", JSON.stringify(getEl("treeStage").textContent));
// real-button simulation: disabled=true like the real rendered button
const b=new El("st"); b.dataset.stage="3"; b.disabled=true;
fire(getEl("treeMeta"),"click",fakeEv(b,".stage-jump-btn"));
console.log("treeStage after disabled stage click:", JSON.stringify(getEl("treeStage").textContent));
// hostile: enabled fake (bypass) while unplanted
const b2=new El("st"); b2.dataset.stage="3"; b2.disabled=false;
fire(getEl("treeMeta"),"click",fakeEv(b2,".stage-jump-btn"));
console.log("treeStage after enabled-fake stage click while unplanted:", JSON.stringify(getEl("treeStage").textContent));
console.log("treeMeta html has stage buttons:", (getEl("treeMeta").innerHTML.match(/stage-jump-btn/g)||[]).length);
