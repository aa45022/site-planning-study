import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/* ═══ CONFIG ═══ */
// 密碼驗證在伺服器端，前端不存密碼

/* ═══ SEED DATA ═══ */
const SEED = [
  { id:"s1",type:"exam",year:2024,category:"韌性城市",title:"韌性城市與防災敷地計畫",question:"",tags:["防災","韌性","氣候調適"],framework:"垂直分層 × 雙模設計",keyPoints:["地下層：滯洪池、雨水貯留、地下調節池、停車場轉運","地面層：透水鋪面、生態草溝、避難廣場、救災動線","屋頂層：綠屋頂、太陽能、雨水收集、避難平台","平時模式：開放空間、社區活動、景觀休憩","災時模式：避難收容、物資集散、緊急醫療站"],theory:"Kevin Lynch 五元素：路徑(Path)、邊緣(Edge)、區域(District)、節點(Node)、地標(Landmark)",essayTips:"答題時先畫出「三層剖面圖」標註平時/災時功能切換，再以 Lynch 五元素組織空間敘述，最後用表格對比平時與災時的機能配置。",notes:"",source:"模擬題" },
  { id:"s2",type:"exam",year:2024,category:"TOD",title:"TOD 大眾運輸導向發展",question:"",tags:["TOD","交通","混合使用"],framework:"同心圓分區 × 步行可及性",keyPoints:["核心區(0-200m)：站體、轉運設施、高密度商業","混合區(200-400m)：商住混合、公共設施、開放空間","住宅區(400-800m)：中低密度住宅、社區公園、學校","步行優先：人行道≧3m、自行車道、無障礙設計","密度梯度：由核心向外遞減，容積獎勵引導開發"],theory:"Peter Calthorpe TOD 理論：以公共運輸站點為中心，步行可及範圍內混合土地使用",essayTips:"畫同心圓配置圖標示密度梯度，搭配剖面圖呈現建築量體與開放空間關係，強調「最後一哩」接駁策略。",notes:"",source:"歷屆考題" },
  { id:"s3",type:"exam",year:2023,category:"綠色基盤",title:"綠色基盤設施與生態都市",question:"",tags:["生態","綠建築","海綿城市"],framework:"藍綠網絡 × 生態廊道",keyPoints:["藍色系統：雨水花園、生態滯留池、透水層、濕地","綠色系統：行道樹、綠帶、公園綠地、屋頂農園","廊道串連：生態跳島、綠色通廊、風廊、視覺軸線","LID 低衝擊開發：源頭減量、入滲增加、延遲排放","生物多樣性：棲地營造、原生植栽、生態池"],theory:"Ian McHarg《Design with Nature》適地適性規劃；海綿城市六字訣：滲、滯、蓄、淨、用、排",essayTips:"以全區配置圖標示藍綠網絡系統，用箭頭表示水文循環路徑，搭配量化指標（透水率、綠覆率、保水量）強化說服力。",notes:"",source:"歷屆考題" },
  { id:"s4",type:"exam",year:2023,category:"都市更新",title:"都市更新與歷史保存",question:"",tags:["都更","歷史","活化再生"],framework:"保存層級 × 介入強度",keyPoints:["全面保存：古蹟指定、歷史建築登錄、原貌修復","部分保存：立面保存、結構補強、內部更新","意象延續：量體退縮、材料呼應、天際線協調","新舊對話：新建築謙遜姿態、空間留白、視覺通透","社區參與：居民工作坊、在地記憶保存、漸進式更新"],theory:"都市縫合(Urban Stitching)理論；Aldo Rossi 都市建築學：集體記憶與場所精神",essayTips:"繪製新舊建築關係圖，用剖面表現高度退縮與天際線，標註保存元素與新建元素的材質對比策略。",notes:"",source:"模擬題" },
  { id:"s5",type:"exam",year:2022,category:"社區營造",title:"社區規劃與鄰里單元",question:"",tags:["社區","鄰里","公共空間"],framework:"鄰里單元 × 公共性層級",keyPoints:["Clarence Perry 鄰里單元：步行5分鐘範圍、小學為中心","公共空間層級：私密→半私密→半公共→公共","社區核心：活動中心、市場、廣場、綠地","安全監控：街道之眼(Eyes on the Street)、通視性","通用設計：無障礙、高齡友善、兒童安全"],theory:"Jane Jacobs《偉大城市的誕生與衰亡》四條件：混合使用、短街廓、新舊建築混合、高密度",essayTips:"從鄰里單元配置圖出發，標註步行圈與服務半徑，再以空間層級剖面圖說明公共到私密的過渡設計。",notes:"",source:"歷屆考題" },
  { id:"s6",type:"exam",year:2022,category:"氣候調適",title:"氣候調適與永續敷地",question:"",tags:["永續","減碳","微氣候"],framework:"被動設計 × 微氣候調節",keyPoints:["日照分析：建築座向、日影模擬、冬暖夏涼","通風設計：風廊規劃、建築間距、壓力差通風","遮陽策略：騎樓、遮陽板、植栽遮蔭、深窗","熱島緩解：透水面、植栽、高反射材料、水體","碳中和策略：再生能源、碳匯綠地、低碳交通"],theory:"Olgyay 生物氣候設計法；被動式設計(Passive Design)原則：適應氣候而非對抗氣候",essayTips:"繪製基地微氣候分析圖（風向、日照、溫度分布），以此推導配置邏輯，展現「因地制宜」的設計思維。",notes:"",source:"模擬題" },
];

const ALL_COLUMNS = [
  { key:"type",label:"類型" },{ key:"year",label:"年份" },{ key:"category",label:"類別" },
  { key:"title",label:"題目" },{ key:"tags",label:"標籤" },{ key:"framework",label:"答題框架" },
  { key:"source",label:"來源" },{ key:"question",label:"考題原文" },
  { key:"theory",label:"理論基礎" },{ key:"notes",label:"個人筆記" },
];
const DEFAULT_COLS = ["type","year","category","title","tags","framework","source"];
const CATEGORIES = ["韌性城市","TOD","綠色基盤","都市更新","社區營造","氣候調適","敷地分析","都市設計","景觀規劃","其他"];
const SOURCES = ["歷屆考題","模擬題","補習班","自整理","其他"];
const TYPE_OPTIONS = [
  { key:"exam", label:"📝 考古題", color:"#c9a44a" },
  { key:"knowledge", label:"📚 知識文章", color:"#4a9cc9" },
];

const genId = () => "t"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);

/* ═══ STORAGE LAYER — fetch API ═══ */
async function sGet(k) {
  try {
    const res = await fetch('/api/data/' + encodeURIComponent(k));
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}
async function sSet(k, v) {
  try {
    await fetch('/api/data/' + encodeURIComponent(k), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v),
    });
  } catch {}
}
function fmtSize(s){const b=new Blob([s]).size;return b<1024?b+" B":b<1048576?(b/1024).toFixed(1)+" KB":(b/1048576).toFixed(2)+" MB";}

/* ═══ THEME ═══ */
const themes = {
  dark: {
    bg:"#0f1114",bgAlt:"#181b20",bgCard:"#1e2228",bgPanel:"#171a1f",
    ink:"#e8e6e1",inkLight:"#9da3ab",inkMuted:"#5c6370",
    accent:"#c9a44a",accentLight:"#dfc477",
    green:"#5ea87a",blue:"#4a9cc9",red:"#c95a4a",
    border:"#2a2e35",borderLight:"#22262c",
    shadow:"rgba(0,0,0,0.3)",
    examBg:"#2a2518",examColor:"#c9a44a",
    knowBg:"#182230",knowColor:"#4a9cc9",
  },
  light: {
    bg:"#f4f0e8",bgAlt:"#eae5da",bgCard:"#fffdf8",bgPanel:"#faf8f3",
    ink:"#1a2420",inkLight:"#5a6660",inkMuted:"#9aa59e",
    accent:"#b74a2e",accentLight:"#d4704f",
    green:"#4a7c5e",blue:"#2e6b8b",red:"#c0392b",
    border:"#d4cfc4",borderLight:"#e5e0d6",
    shadow:"rgba(0,0,0,0.06)",
    examBg:"#f5edd8",examColor:"#8b6f47",
    knowBg:"#dbeaf5",knowColor:"#2e6b8b",
  },
};

function getCSS(t){return `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:${t.bg};color:${t.ink};transition:background .3s,color .3s}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:${t.border};border-radius:3px}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
@keyframes dropIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
input::placeholder,textarea::placeholder{color:${t.inkMuted}}
button:hover{opacity:.88}
.nav-item{position:relative;cursor:pointer}
.nav-item .nav-label{padding:14px 14px;font-size:13px;font-family:'IBM Plex Mono',monospace;font-weight:500;color:${t.inkLight};border:none;background:transparent;cursor:pointer;transition:color .15s,border-bottom .15s;border-bottom:2px solid transparent;white-space:nowrap;display:flex;align-items:center;gap:4px}
.nav-item:hover .nav-label,.nav-item .nav-label.active{color:${t.accent};border-bottom-color:${t.accent}}
.nav-item .nav-drop{display:none;position:absolute;top:100%;left:0;min-width:180px;background:${t.bgCard};border:1px solid ${t.border};border-radius:0 0 6px 6px;box-shadow:0 8px 30px ${t.shadow};z-index:300;animation:dropIn .15s ease;padding:6px 0}
.nav-item:hover .nav-drop{display:block}
.nav-drop-item{display:block;width:100%;padding:9px 18px;font-size:12px;font-family:'Noto Serif TC',Georgia,serif;color:${t.inkLight};background:transparent;border:none;text-align:left;cursor:pointer;transition:background .1s,color .1s;white-space:nowrap}
.nav-drop-item:hover{background:${t.accent}18;color:${t.accent}}
.nav-drop-item.active-item{color:${t.accent};font-weight:600}
.nav-divider{height:1px;background:${t.border};margin:4px 12px}
`;}

/* ═══ PRIMITIVES ═══ */
const mono = "'IBM Plex Mono',monospace";
const serif = "'Noto Serif TC',Georgia,serif";

function Tag({children,active,onClick,accent,t}){
  const bg = active?(accent||t.ink):"transparent";
  const bd = active?(accent||t.ink):t.border;
  const c = active?(accent?"#fff":t.bg):t.inkMuted;
  return <button onClick={onClick} style={{padding:"2px 10px",fontSize:"11px",fontFamily:mono,fontWeight:500,lineHeight:"22px",border:"1px solid "+bd,borderRadius:"2px",background:bg,color:c,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>{children}</button>;
}

function Btn({children,v,sz,onClick,disabled,sx,t}){
  const th = t || themes.dark;
  const vs={
    default:{background:th.bgAlt,color:th.inkLight,border:"1px solid "+th.border},
    primary:{background:th.accent,color:"#111",border:"1px solid "+th.accent},
    accent:{background:th.red||th.accent,color:"#fff",border:"1px solid "+(th.red||th.accent)},
    ghost:{background:"transparent",color:th.inkMuted,border:"1px solid transparent"},
    danger:{background:"transparent",color:th.red,border:"1px solid "+th.red+"44"},
  };
  const szs={sm:{padding:"4px 12px",fontSize:"11px"},md:{padding:"7px 16px",fontSize:"12px"},lg:{padding:"10px 24px",fontSize:"13px"}};
  return <button onClick={onClick} disabled={disabled} style={{fontFamily:mono,fontWeight:500,cursor:disabled?"not-allowed":"pointer",borderRadius:"4px",transition:"all .15s",opacity:disabled?.4:1,display:"inline-flex",alignItems:"center",gap:"6px",whiteSpace:"nowrap",...szs[sz||"md"],...vs[v||"default"],...(sx||{})}}>{children}</button>;
}

function Sect({label,color,t,children}){
  return <section style={{marginBottom:"28px"}}><h4 id={"sect-"+label} style={{fontSize:"11px",fontFamily:mono,fontWeight:600,color,letterSpacing:"1.5px",borderBottom:"1px solid "+t.border,paddingBottom:"6px",marginBottom:"14px",scrollMarginTop:"80px"}}>{"■ "+label}</h4>{children}</section>;
}

function StatCard({label,value,sub,t,icon}){
  return <div style={{padding:"16px 18px",background:t.bgCard,border:"1px solid "+t.border,borderRadius:"6px",flex:"1 1 140px",minWidth:"130px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
      <span style={{fontSize:"10px",fontFamily:mono,color:t.inkMuted,fontWeight:600,letterSpacing:"1px"}}>{label}</span>
      {icon && <span style={{fontSize:"16px",opacity:.5}}>{icon}</span>}
    </div>
    <div style={{fontSize:"26px",fontWeight:900,fontFamily:mono,color:t.accent,lineHeight:1}}>{value}</div>
    {sub && <div style={{fontSize:"10px",fontFamily:mono,color:t.inkMuted,marginTop:"4px"}}>{sub}</div>}
  </div>;
}

/* ═══ TOC ═══ */
function TableOfContents({topic,t}){
  const sections = [];
  if(topic.question) sections.push({id:"sect-考題原文",label:"考題原文"});
  sections.push({id:"sect-核心要點",label:"核心要點"});
  if(topic.theory) sections.push({id:"sect-理論基礎",label:"理論基礎"});
  if(topic.essayTips) sections.push({id:"sect-答題策略",label:"答題策略"});
  if(topic.notes) sections.push({id:"sect-個人筆記",label:"個人筆記"});

  if(sections.length <= 1) return null;

  const [open,setOpen] = useState(true);
  return <div style={{marginBottom:"24px",border:"1px solid "+t.border,borderRadius:"6px",background:t.bgAlt,overflow:"hidden"}}>
    <button onClick={()=>setOpen(!open)} style={{width:"100%",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"transparent",border:"none",cursor:"pointer",color:t.inkLight,fontFamily:mono,fontSize:"11px",fontWeight:600,letterSpacing:"1px"}}>
      <span>📑 內容目錄</span>
      <span style={{transform:open?"rotate(90deg)":"none",transition:".2s",fontSize:"10px"}}>▶</span>
    </button>
    {open && <div style={{padding:"0 16px 12px",display:"flex",flexDirection:"column",gap:"2px"}}>
      {sections.map((s,i)=>(
        <a key={s.id} href={"#"+s.id} onClick={(e)=>{e.preventDefault();document.getElementById(s.id)?.scrollIntoView({behavior:"smooth",block:"start"});}}
          style={{padding:"6px 10px",fontSize:"12px",color:t.inkLight,textDecoration:"none",borderRadius:"3px",transition:"background .15s",display:"flex",alignItems:"center",gap:"8px",fontFamily:serif}}
          onMouseEnter={e=>e.currentTarget.style.background=t.bgCard}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <span style={{fontFamily:mono,fontSize:"10px",color:t.accent,fontWeight:600,minWidth:"18px"}}>{String(i+1).padStart(2,"0")}</span>
          {s.label}
        </a>
      ))}
    </div>}
  </div>;
}

/* ═══ STATS DASHBOARD ═══ */
function StatsDashboard({topics,t,filterType,setFilterType}){
  const examCount = topics.filter(x=>(x.type||"exam")==="exam").length;
  const knowCount = topics.filter(x=>x.type==="knowledge").length;
  const years = [...new Set(topics.map(x=>x.year))].sort((a,b)=>b-a);
  const cats = [...new Set(topics.map(x=>x.category))];
  const yearDist = {};
  topics.forEach(x=>{yearDist[x.year]=(yearDist[x.year]||0)+1;});
  const maxY = Math.max(...Object.values(yearDist),1);

  return <div style={{padding:"16px 24px",borderBottom:"1px solid "+t.border,background:t.bgPanel}}>
    {/* Summary cards */}
    <div style={{display:"flex",gap:"12px",flexWrap:"wrap",marginBottom:"14px"}}>
      <StatCard label="總資料數" value={topics.length} sub={examCount+" 考古題 · "+knowCount+" 知識"} t={t} icon="📊" />
      <StatCard label="年份跨度" value={years.length>0?(years[years.length-1]+"–"+years[0]):"—"} sub={years.length+" 個年份"} t={t} icon="📅" />
      <StatCard label="類別數" value={cats.length} sub={cats.slice(0,3).join("、")+(cats.length>3?" ...":" ")} t={t} icon="🏷" />
    </div>
    {/* Mini bar chart */}
    {years.length > 0 && <div style={{display:"flex",gap:"6px",alignItems:"flex-end",height:"40px"}}>
      <span style={{fontSize:"9px",fontFamily:mono,color:t.inkMuted,alignSelf:"flex-end",marginRight:"4px"}}>年份分布</span>
      {[...years].reverse().map(y=>{
        const h = Math.max(8,(yearDist[y]||0)/maxY*36);
        return <div key={y} title={y+": "+yearDist[y]+"筆"} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",cursor:"pointer"}}
          onClick={()=>setFilterType(null)}>
          <div style={{width:"24px",height:h+"px",background:t.accent,borderRadius:"2px 2px 0 0",opacity:.7,transition:"height .3s"}} />
          <span style={{fontSize:"8px",fontFamily:mono,color:t.inkMuted}}>{String(y).slice(2)}</span>
        </div>;
      })}
    </div>}
  </div>;
}

/* ═══ LOGIN ═══ */
function LoginScreen({onLogin,t}){
  const [pw,setPw]=useState("");const [err,setErr]=useState(false);const [shake,setShake]=useState(false);const [checking,setChecking]=useState(false);
  async function go(){
    setChecking(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (data.ok) { onLogin(); }
      else { setErr(true); setShake(true); setTimeout(()=>setShake(false),500); }
    } catch {
      setErr(true); setShake(true); setTimeout(()=>setShake(false),500);
    }
    setChecking(false);
  }
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .3s"}}>
    <div style={{background:t.bgCard,borderRadius:"8px",padding:"40px 36px",width:"380px",maxWidth:"90vw",boxShadow:"0 20px 60px rgba(0,0,0,.4)",animation:shake?"shake .4s":"slideUp .3s",textAlign:"center",border:"1px solid "+t.border}}>
      <div style={{fontSize:"28px",marginBottom:"6px"}}>🔐</div>
      <h2 style={{fontSize:"18px",fontWeight:700,marginBottom:"4px",color:t.ink}}>後台管理登入</h2>
      <p style={{fontSize:"11px",fontFamily:mono,color:t.inkMuted,marginBottom:"24px"}}>僅限管理員存取</p>
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}} onKeyDown={e=>{if(e.key==="Enter")go();}}
        placeholder="請輸入管理密碼" autoFocus
        style={{width:"100%",padding:"10px 12px",textAlign:"center",fontSize:"15px",letterSpacing:"2px",marginBottom:"8px",border:err?"1.5px solid "+t.red:"1px solid "+t.border,borderRadius:"4px",background:t.bgAlt,color:t.ink,outline:"none",fontFamily:serif,boxSizing:"border-box"}} />
      {err&&<p style={{fontSize:"11px",color:t.red,marginBottom:"8px"}}>密碼錯誤</p>}
      <div style={{display:"flex",gap:"8px",marginTop:"16px"}}>
        <Btn v="ghost" sz="lg" sx={{flex:1}} onClick={()=>onLogin("cancel")} t={t}>取消</Btn>
        <Btn v="primary" sz="lg" sx={{flex:1}} onClick={go} disabled={checking} t={t}>{checking?"驗證中...":"登入管理"}</Btn>
      </div>
    </div>
  </div>;
}

/* ═══ DATA MODAL ═══ */
function DataModal({topics,onImport,onClose,t}){
  const [tab,setTab]=useState("export");const [imp,setImp]=useState("");const [impErr,setImpErr]=useState("");const [preview,setPreview]=useState(null);const [mode,setMode]=useState("merge");
  const json=JSON.stringify(topics,null,2);
  const inputS={width:"100%",padding:"9px 12px",border:"1px solid "+t.border,borderRadius:"4px",background:t.bgAlt,fontSize:"14px",color:t.ink,outline:"none",fontFamily:serif,boxSizing:"border-box"};
  function parse(){setImpErr("");setPreview(null);try{const d=JSON.parse(imp);if(!Array.isArray(d)){setImpErr("JSON 必須是陣列格式");return;}if(!d.every(x=>x.title&&x.year&&x.category&&Array.isArray(x.keyPoints))){setImpErr("部分資料缺少必填欄位");return;}setPreview(d);}catch(e){setImpErr("JSON 格式錯誤："+e.message);}}
  function doImport(){if(!preview)return;const c=preview.map(d=>({id:d.id||genId(),type:d.type||"exam",year:Number(d.year),category:d.category,title:d.title,question:d.question||"",tags:Array.isArray(d.tags)?d.tags:[],framework:d.framework||"",keyPoints:Array.isArray(d.keyPoints)?d.keyPoints:[],theory:d.theory||"",essayTips:d.essayTips||"",notes:d.notes||"",source:d.source||""}));onImport(c,mode);}
  function dl(){const b=new Blob([json],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="site-planning-"+new Date().toISOString().slice(0,10)+".json";a.click();URL.revokeObjectURL(u);}

  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .2s"}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:t.bgCard,borderRadius:"8px",width:"640px",maxWidth:"92vw",maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,.3)",animation:"slideUp .25s",border:"1px solid "+t.border}}>
      <div style={{padding:"16px 20px",borderBottom:"1px solid "+t.border,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><h3 style={{fontSize:"16px",fontWeight:700,color:t.ink}}>資料管理</h3><p style={{fontSize:"10px",fontFamily:mono,color:t.inkMuted}}>匯出備份 · 匯入更新</p></div>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:"18px",cursor:"pointer",color:t.inkMuted}}>✕</button>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid "+t.border}}>
        {[["export","📤 匯出"],["import","📥 匯入"]].map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"10px",fontSize:"12px",fontFamily:mono,fontWeight:tab===k?600:400,background:tab===k?t.bgAlt:"transparent",color:tab===k?t.ink:t.inkMuted,border:"none",borderBottom:tab===k?"2px solid "+t.accent:"2px solid transparent",cursor:"pointer"}}>{l}</button>)}
      </div>
      <div style={{flex:1,overflow:"auto",padding:"20px"}}>
        {tab==="export"&&<div>
          <div style={{display:"flex",gap:"8px",marginBottom:"12px",alignItems:"center"}}>
            <Btn v="primary" sz="sm" onClick={dl} t={t}>⬇ 下載 JSON</Btn>
            <Btn sz="sm" onClick={()=>navigator.clipboard.writeText(json).catch(()=>{})} t={t}>📋 複製</Btn>
            <span style={{fontSize:"10px",fontFamily:mono,color:t.inkMuted,marginLeft:"auto"}}>{topics.length} 筆 · {fmtSize(json)}</span>
          </div>
          <textarea readOnly value={json} style={{...inputS,height:"300px",resize:"vertical",fontSize:"11px",fontFamily:mono,lineHeight:1.5}} />
        </div>}
        {tab==="import"&&<div>
          <textarea value={imp} onChange={e=>{setImp(e.target.value);setImpErr("");setPreview(null);}}
            placeholder={'[\n  {\n    "type": "exam",\n    "year": 2024,\n    "category": "韌性城市",\n    "title": "題目",\n    "question": "",\n    "tags": ["標籤"],\n    "keyPoints": ["要點"]\n  }\n]'}
            style={{...inputS,height:"180px",resize:"vertical",fontSize:"12px",fontFamily:mono,lineHeight:1.5}} />
          <div style={{display:"flex",gap:"8px",marginTop:"12px",alignItems:"center",flexWrap:"wrap"}}>
            <Btn v="primary" sz="sm" onClick={parse} disabled={!imp.trim()} t={t}>🔍 驗證</Btn>
            <Tag active={mode==="merge"} onClick={()=>setMode("merge")} accent={t.accent} t={t}>合併</Tag>
            <Tag active={mode==="replace"} onClick={()=>setMode("replace")} accent={t.accent} t={t}>取代</Tag>
          </div>
          {impErr&&<div style={{marginTop:"10px",padding:"10px 14px",background:t.red+"15",border:"1px solid "+t.red+"33",borderRadius:"4px",fontSize:"12px",color:t.red}}>{impErr}</div>}
          {preview&&<div style={{marginTop:"14px"}}>
            <div style={{padding:"10px 14px",background:t.green+"15",border:"1px solid "+t.green+"33",borderRadius:"4px",marginBottom:"10px"}}>
              <span style={{fontSize:"12px",fontWeight:600,color:t.green}}>✓ 驗證通過 — {preview.length} 筆</span>
            </div>
            <div style={{marginTop:"12px",textAlign:"right"}}><Btn v="primary" onClick={doImport} t={t}>✓ 確認匯入</Btn></div>
          </div>}
        </div>}
      </div>
    </div>
  </div>;
}

/* ═══ FORM ═══ */
function TopicForm({initial,onSave,onCancel,t}){
  const isEdit=!!initial;
  const [f,setF]=useState({type:initial?.type||"exam",year:initial?.year||new Date().getFullYear(),category:initial?.category||"",title:initial?.title||"",question:initial?.question||"",tags:initial?.tags?.join("、")||"",framework:initial?.framework||"",keyPoints:initial?.keyPoints?.join("\n")||"",theory:initial?.theory||"",essayTips:initial?.essayTips||"",notes:initial?.notes||"",source:initial?.source||""});
  const [errs,setErrs]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const inputS={width:"100%",padding:"9px 12px",border:"1px solid "+t.border,borderRadius:"4px",background:t.bgAlt,fontSize:"14px",color:t.ink,outline:"none",fontFamily:serif,boxSizing:"border-box"};
  const lbl=(text,req)=><label style={{display:"block",fontSize:"11px",fontFamily:mono,fontWeight:600,color:t.accent,letterSpacing:"1px",marginBottom:"6px"}}>{text}{req&&<span style={{color:t.red,marginLeft:"3px"}}>*</span>}</label>;
  const eSt={fontSize:"11px",color:t.red,fontFamily:mono,marginTop:"3px"};
  function submit(){
    const e={};if(!f.title.trim())e.title="必填";if(!f.category)e.category="必填";if(!f.year)e.year="必填";if(!f.keyPoints.trim())e.keyPoints="至少一項";setErrs(e);if(Object.keys(e).length)return;
    onSave({type:f.type,year:Number(f.year),category:f.category,title:f.title.trim(),question:f.question.trim(),tags:f.tags.split(/[、,，\s]+/).map(s=>s.trim()).filter(Boolean),framework:f.framework.trim(),keyPoints:f.keyPoints.split("\n").map(s=>s.trim()).filter(Boolean),theory:f.theory.trim(),essayTips:f.essayTips.trim(),notes:f.notes.trim(),source:f.source});
  }
  return <div style={{flex:1,overflow:"auto",animation:"fadeIn .2s"}}>
    <div style={{padding:"14px 24px",borderBottom:"1px solid "+t.border,background:t.bgPanel,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div><h2 style={{fontSize:"16px",fontWeight:700,color:t.ink}}>{isEdit?"編輯資料":"新增資料"}</h2></div>
      <Btn v="ghost" onClick={onCancel} t={t}>← 返回</Btn>
    </div>
    <div style={{maxWidth:"720px",margin:"0 auto",padding:"28px 24px"}}>
      <div style={{marginBottom:"16px"}}>{lbl("資料類型",true)}
        <div style={{display:"flex",gap:"8px"}}>{TYPE_OPTIONS.map(opt=><button key={opt.key} onClick={()=>set("type",opt.key)} style={{flex:1,padding:"10px 16px",border:f.type===opt.key?"2px solid "+opt.color:"1px solid "+t.border,borderRadius:"4px",background:f.type===opt.key?opt.color+"18":t.bgAlt,cursor:"pointer",fontSize:"14px",fontWeight:f.type===opt.key?700:400,color:f.type===opt.key?opt.color:t.inkMuted,transition:"all .15s",fontFamily:serif}}>{opt.label}</button>)}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px",marginBottom:"16px"}}>
        <div>{lbl("年份",true)}<input type="number" value={f.year} onChange={e=>set("year",e.target.value)} min="2000" max="2030" style={inputS}/>{errs.year&&<div style={eSt}>{errs.year}</div>}</div>
        <div>{lbl("類別",true)}<select value={f.category} onChange={e=>set("category",e.target.value)} style={{...inputS,cursor:"pointer"}}><option value="">請選擇</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>{errs.category&&<div style={eSt}>{errs.category}</div>}</div>
        <div>{lbl("來源")}<select value={f.source} onChange={e=>set("source",e.target.value)} style={{...inputS,cursor:"pointer"}}><option value="">請選擇</option>{SOURCES.map(s=><option key={s}>{s}</option>)}</select></div>
      </div>
      <div style={{marginBottom:"16px"}}>{lbl("題目",true)}<input value={f.title} onChange={e=>set("title",e.target.value)} placeholder="例：韌性城市與防災敷地計畫" style={inputS}/>{errs.title&&<div style={eSt}>{errs.title}</div>}</div>
      {f.type==="exam"&&<div style={{marginBottom:"16px"}}>{lbl("考題原文")}<textarea value={f.question} onChange={e=>set("question",e.target.value)} placeholder="貼上考題完整文字..." style={{...inputS,resize:"vertical",minHeight:"80px",lineHeight:1.7}}/></div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
        <div>{lbl("標籤（頓號分隔）")}<input value={f.tags} onChange={e=>set("tags",e.target.value)} placeholder="防災、韌性" style={inputS}/></div>
        <div>{lbl("答題框架")}<input value={f.framework} onChange={e=>set("framework",e.target.value)} placeholder="垂直分層 × 雙模設計" style={inputS}/></div>
      </div>
      <div style={{marginBottom:"16px"}}>{lbl("核心要點（每行一項）",true)}<textarea value={f.keyPoints} onChange={e=>set("keyPoints",e.target.value)} placeholder={"地下層：滯洪池\n地面層：透水鋪面"} style={{...inputS,resize:"vertical",minHeight:"130px",lineHeight:1.7}}/>{errs.keyPoints&&<div style={eSt}>{errs.keyPoints}</div>}</div>
      <div style={{marginBottom:"16px"}}>{lbl("理論基礎")}<textarea value={f.theory} onChange={e=>set("theory",e.target.value)} style={{...inputS,resize:"vertical",minHeight:"80px",lineHeight:1.7}}/></div>
      <div style={{marginBottom:"16px"}}>{lbl("答題策略")}<textarea value={f.essayTips} onChange={e=>set("essayTips",e.target.value)} style={{...inputS,resize:"vertical",minHeight:"80px",lineHeight:1.7}}/></div>
      <div style={{marginBottom:"16px"}}>{lbl("個人筆記")}<textarea value={f.notes} onChange={e=>set("notes",e.target.value)} style={{...inputS,resize:"vertical",minHeight:"100px",lineHeight:1.7}}/></div>
      <div style={{display:"flex",gap:"10px",justifyContent:"flex-end",paddingTop:"20px",borderTop:"1px solid "+t.border}}>
        <Btn v="default" sz="lg" onClick={onCancel} t={t}>取消</Btn>
        <Btn v="primary" sz="lg" onClick={submit} t={t}>{isEdit?"✓ 儲存":"＋ 新增"}</Btn>
      </div>
    </div>
  </div>;
}

/* ═══ CELL RENDERER ═══ */
function CellContent({topic:tt,colKey,t}){
  switch(colKey){
    case"type":{const isE=(tt.type||"exam")==="exam";return <span style={{fontSize:"10px",fontFamily:mono,fontWeight:600,color:isE?t.examColor:t.knowColor,background:isE?t.examBg:t.knowBg,padding:"2px 8px",borderRadius:"2px"}}>{isE?"考古題":"知識"}</span>;}
    case"year":return <span style={{fontFamily:mono,fontWeight:700,color:t.ink}}>{tt.year}</span>;
    case"category":return <span style={{fontSize:"11px",fontFamily:mono,color:t.green,fontWeight:600}}>{tt.category}</span>;
    case"title":return <span style={{fontWeight:600,color:t.ink}}>{tt.title}</span>;
    case"tags":return <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>{tt.tags.map(x=><span key={x} style={{fontSize:"10px",fontFamily:mono,color:t.inkMuted,background:t.bgAlt,padding:"1px 5px",borderRadius:"1px"}}>{x}</span>)}</div>;
    case"framework":return tt.framework?<span style={{fontSize:"11px",fontFamily:mono,background:t.accent,color:"#111",padding:"2px 8px",borderRadius:"2px",whiteSpace:"nowrap"}}>{tt.framework}</span>:<span style={{color:t.inkMuted}}>—</span>;
    case"source":return <span style={{fontSize:"12px",color:t.inkLight}}>{tt.source||"—"}</span>;
    case"question":return <span style={{fontSize:"12px",color:t.inkLight,maxWidth:"220px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{tt.question||"—"}</span>;
    case"theory":return <span style={{fontSize:"12px",color:t.inkLight,maxWidth:"220px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{tt.theory||"—"}</span>;
    case"notes":return <span style={{fontSize:"12px",color:t.inkLight,maxWidth:"180px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{tt.notes||"—"}</span>;
    default:return null;
  }
}

/* ═══ MAIN APP ═══ */
export default function App(){
  const [topics,setTopics]=useState([]);const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);
  const [dark,setDark]=useState(true);
  const t = dark ? themes.dark : themes.light;
  const [isAdmin,setIsAdmin]=useState(false);const [showLogin,setShowLogin]=useState(false);const [showData,setShowData]=useState(false);
  const [view,setView]=useState("browse");const [selectedId,setSelectedId]=useState(null);const [editId,setEditId]=useState(null);
  const [searchQ,setSearchQ]=useState("");const [filterYear,setFilterYear]=useState(null);const [filterCat,setFilterCat]=useState(null);const [filterTag,setFilterTag]=useState(null);const [filterType,setFilterType]=useState(null);
  const [sortBy,setSortBy]=useState("year-desc");const [visibleCols,setVisibleCols]=useState(DEFAULT_COLS);const [showColPk,setShowColPk]=useState(false);const [dispMode,setDispMode]=useState("card");
  const [bookmarks,setBookmarks]=useState([]);
  const [showBkmk,setShowBkmk]=useState(false);
  const [toast,setToast]=useState(null);const toastT=useRef(null);
  const flash=useCallback((m,tp)=>{setToast({m,t:tp||"ok"});if(toastT.current)clearTimeout(toastT.current);toastT.current=setTimeout(()=>setToast(null),2500);},[]);

  const inputS={width:"100%",padding:"9px 12px",border:"1px solid "+t.border,borderRadius:"4px",background:t.bgAlt,fontSize:"14px",color:t.ink,outline:"none",fontFamily:serif,boxSizing:"border-box"};

  /* ── 隱藏管理入口：網址加 ?admin 或按 Ctrl+Shift+L ── */
  useEffect(()=>{
    // 偵測 URL 參數
    const params = new URLSearchParams(window.location.search);
    if(params.has("admin")){
      setShowLogin(true);
    }
    // 鍵盤快捷鍵
    function handleKey(e){
      if(e.ctrlKey && e.shiftKey && e.key === "L"){
        e.preventDefault();
        if(!isAdmin) setShowLogin(true);
      }
    }
    window.addEventListener("keydown",handleKey);
    return ()=>window.removeEventListener("keydown",handleKey);
  },[isAdmin]);

  useEffect(()=>{(async()=>{
    const d=await sGet("sp-topics");const s=await sGet("sp-settings");const bk=await sGet("sp-bookmarks");
    setTopics(d&&d.length?d:SEED);if(!d||!d.length)await sSet("sp-topics",SEED);
    if(s){s.vc&&setVisibleCols(s.vc);s.dm&&setDispMode(s.dm);s.sb&&setSortBy(s.sb);if(s.dk!==undefined)setDark(s.dk);}
    if(bk)setBookmarks(bk);
    setLoading(false);
  })();},[]);

  const persist=useCallback(async nt=>{setTopics(nt);setSaving(true);await sSet("sp-topics",nt);setSaving(false);},[]);
  useEffect(()=>{if(!loading)sSet("sp-settings",{vc:visibleCols,dm:dispMode,sb:sortBy,dk:dark});},[visibleCols,dispMode,sortBy,dark,loading]);
  useEffect(()=>{if(!loading)sSet("sp-bookmarks",bookmarks);},[bookmarks,loading]);

  const toggleBookmark=(id)=>{setBookmarks(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);};
  const isBookmarked=(id)=>bookmarks.includes(id);

  const years=[...new Set(topics.map(x=>x.year))].sort((a,b)=>b-a);
  const allTags=[...new Set(topics.flatMap(x=>x.tags))].sort();
  const allCats=[...new Set(topics.map(x=>x.category))];

  const filtered=useMemo(()=>{
    let arr = showBkmk ? topics.filter(x=>bookmarks.includes(x.id)) : topics;
    return arr.filter(x=>{
      if(filterType&&(x.type||"exam")!==filterType)return false;
      if(filterYear&&x.year!==filterYear)return false;
      if(filterCat&&x.category!==filterCat)return false;
      if(filterTag&&!x.tags.includes(filterTag))return false;
      if(searchQ){const q=searchQ.toLowerCase();return[x.title,x.category,x.framework,x.theory,x.notes||"",x.question||""].some(s=>s.toLowerCase().includes(q))||x.tags.some(tg=>tg.includes(q))||x.keyPoints.some(p=>p.toLowerCase().includes(q));}
      return true;
    }).sort((a,b)=>{
      if(sortBy==="year-desc")return b.year-a.year||a.title.localeCompare(b.title);
      if(sortBy==="year-asc")return a.year-b.year||a.title.localeCompare(b.title);
      if(sortBy==="category")return a.category.localeCompare(b.category)||b.year-a.year;
      return a.title.localeCompare(b.title);
    });
  },[topics,showBkmk,bookmarks,filterType,filterYear,filterCat,filterTag,searchQ,sortBy]);

  const grouped={};filtered.forEach(x=>{if(!grouped[x.year])grouped[x.year]=[];grouped[x.year].push(x);});
  const sortedYears=Object.keys(grouped).sort((a,b)=>sortBy==="year-asc"?a-b:b-a);
  const sel=topics.find(x=>x.id===selectedId);

  async function deleteTopic(id){await persist(topics.filter(x=>x.id!==id));flash("已刪除");if(selectedId===id){setSelectedId(null);setView(isAdmin?"admin":"browse");}}
  async function saveTopic(data){let nt;if(editId){nt=topics.map(x=>x.id===editId?{...data,id:editId}:x);flash("已更新");}else{nt=[...topics,{...data,id:genId()}];flash("已新增");}await persist(nt);setView("admin");setEditId(null);}
  async function handleImport(data,mode){let nt;if(mode==="replace")nt=data;else{const ids=new Set(topics.map(x=>x.id));const tls=new Set(topics.map(x=>x.year+x.title));nt=[...topics,...data.filter(d=>!ids.has(d.id)&&!tls.has(d.year+d.title))];}await persist(nt);flash("已匯入 "+data.length+" 筆");setShowData(false);}

  const goD=id=>{setSelectedId(id);setView("detail");};const goE=id=>{setEditId(id);setView("form");};const goN=()=>{setEditId(null);setView("form");};
  const onLogin=r=>{if(r==="cancel")setShowLogin(false);else{setIsAdmin(true);setShowLogin(false);setView("admin");flash("已登入管理模式");}};
  const tableCols=ALL_COLUMNS.filter(c=>visibleCols.includes(c.key)&&!((sortBy==="year-desc"||sortBy==="year-asc")&&c.key==="year"));

  if(loading)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:t.bg}}><style>{getCSS(t)}</style><div style={{fontFamily:mono,color:t.inkMuted,animation:"pulse 1.5s infinite"}}>載入中...</div></div>;

  return <div style={{minHeight:"100vh",background:t.bg,display:"flex",flexDirection:"column",fontFamily:serif,color:t.ink,transition:"background .3s,color .3s"}}>
    <style>{getCSS(t)}</style>
    {showLogin&&<LoginScreen onLogin={onLogin} t={t}/>}
    {showData&&<DataModal topics={topics} onImport={handleImport} onClose={()=>setShowData(false)} t={t}/>}

    {/* ═══ NAVBAR ═══ */}
    <header style={{borderBottom:"1px solid "+t.border,background:t.bgPanel,position:"sticky",top:0,zIndex:200}}>
      <div style={{display:"flex",alignItems:"stretch",justifyContent:"space-between",maxWidth:"100%",padding:"0 20px"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",cursor:"pointer",padding:"10px 16px 10px 0",borderRight:"1px solid "+t.borderLight,marginRight:"4px"}} onClick={()=>{setView("browse");setSelectedId(null);setShowBkmk(false);setFilterType(null);setFilterCat(null);setFilterTag(null);setFilterYear(null);}}>
          <div>
            <h1 style={{fontSize:"16px",fontWeight:900,letterSpacing:"1.5px",lineHeight:1.1,color:t.accent}}>敷地計畫</h1>
            <p style={{fontSize:"8px",fontFamily:mono,color:t.inkMuted,letterSpacing:"0.5px",marginTop:"1px"}}>SITE PLANNING</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{display:"flex",alignItems:"stretch",flex:1,overflow:"visible"}}>
          {/* 首頁 */}
          <div className="nav-item">
            <button className={"nav-label"+(view==="browse"&&!filterType&&!showBkmk?" active":"")}
              onClick={()=>{setView("browse");setSelectedId(null);setShowBkmk(false);setFilterType(null);setFilterCat(null);setFilterTag(null);setFilterYear(null);setSearchQ("");}}>
              首頁
            </button>
          </div>

          {/* 瀏覽 */}
          <div className="nav-item">
            <button className="nav-label">瀏覽 ▾</button>
            <div className="nav-drop">
              <button className={"nav-drop-item"+((!filterType&&!showBkmk&&view==="browse")?" active-item":"")}
                onClick={()=>{setView("browse");setFilterType(null);setShowBkmk(false);}}>全部資料</button>
              <button className={"nav-drop-item"+(filterType==="exam"?" active-item":"")}
                onClick={()=>{setView("browse");setFilterType("exam");setShowBkmk(false);}}>📝 考古題</button>
              <button className={"nav-drop-item"+(filterType==="knowledge"?" active-item":"")}
                onClick={()=>{setView("browse");setFilterType("knowledge");setShowBkmk(false);}}>📚 知識文章</button>
              <div className="nav-divider"/>
              <button className={"nav-drop-item"+(showBkmk?" active-item":"")}
                onClick={()=>{setView("browse");setShowBkmk(true);}}>⭐ 我的收藏 ({bookmarks.length})</button>
            </div>
          </div>

          {/* 年份 */}
          {years.length > 0 && <div className="nav-item">
            <button className={"nav-label"+(filterYear?" active":"")}>年份 ▾</button>
            <div className="nav-drop">
              <button className={"nav-drop-item"+(!filterYear?" active-item":"")}
                onClick={()=>{setView("browse");setFilterYear(null);}}>全部年份</button>
              <div className="nav-divider"/>
              {years.map(y=><button key={y} className={"nav-drop-item"+(filterYear===y?" active-item":"")}
                onClick={()=>{setView("browse");setFilterYear(y);}}>{y} 年</button>)}
            </div>
          </div>}

          {/* 類別 */}
          <div className="nav-item">
            <button className={"nav-label"+(filterCat?" active":"")}>類別 ▾</button>
            <div className="nav-drop">
              <button className={"nav-drop-item"+(!filterCat?" active-item":"")}
                onClick={()=>{setView("browse");setFilterCat(null);}}>全部類別</button>
              <div className="nav-divider"/>
              {allCats.map(c=><button key={c} className={"nav-drop-item"+(filterCat===c?" active-item":"")}
                onClick={()=>{setView("browse");setFilterCat(c);}}>{c}</button>)}
            </div>
          </div>

          {/* 顯示 */}
          <div className="nav-item">
            <button className="nav-label">顯示 ▾</button>
            <div className="nav-drop">
              <button className={"nav-drop-item"+(dispMode==="card"?" active-item":"")} onClick={()=>setDispMode("card")}>🃏 卡片檢視</button>
              <button className={"nav-drop-item"+(dispMode==="table"?" active-item":"")} onClick={()=>setDispMode("table")}>📋 表格檢視</button>
              <div className="nav-divider"/>
              <button className={"nav-drop-item"+(sortBy==="year-desc"?" active-item":"")} onClick={()=>setSortBy("year-desc")}>排序：新→舊</button>
              <button className={"nav-drop-item"+(sortBy==="year-asc"?" active-item":"")} onClick={()=>setSortBy("year-asc")}>排序：舊→新</button>
              <button className={"nav-drop-item"+(sortBy==="category"?" active-item":"")} onClick={()=>setSortBy("category")}>排序：類別</button>
            </div>
          </div>
        </nav>

        {/* Right side controls */}
        <div style={{display:"flex",alignItems:"center",gap:"8px",paddingLeft:"12px",borderLeft:"1px solid "+t.borderLight}}>
          {saving&&<span style={{fontSize:"10px",fontFamily:mono,color:t.green,animation:"pulse 1s infinite"}}>●</span>}
          <span style={{fontSize:"10px",fontFamily:mono,color:t.inkMuted}}>{topics.length} 筆</span>
          <button onClick={()=>setDark(!dark)} style={{background:t.bgAlt,border:"1px solid "+t.border,borderRadius:"4px",padding:"5px 10px",cursor:"pointer",fontSize:"13px",color:t.inkLight,transition:"all .15s"}} title={dark?"切換亮色":"切換深色"}>
            {dark?"☀️":"🌙"}
          </button>
        </div>
      </div>
    </header>

    {toast&&<div style={{position:"fixed",top:"60px",right:"24px",zIndex:999,padding:"10px 20px",borderRadius:"6px",background:toast.t==="ok"?t.green:t.red,color:"#fff",fontSize:"13px",fontFamily:mono,fontWeight:500,boxShadow:"0 4px 20px "+t.shadow,animation:"slideUp .25s"}}>{toast.m}</div>}

    {/* ═══ ADMIN FLOATING BAR（僅登入後可見，訪客完全看不到）═══ */}
    {isAdmin && (
      <div style={{
        position:"fixed",bottom:"20px",left:"50%",transform:"translateX(-50%)",zIndex:300,
        display:"flex",alignItems:"center",gap:"8px",
        padding:"8px 16px",borderRadius:"8px",
        background:t.bgCard,border:"1px solid "+t.accent+"44",
        boxShadow:"0 8px 32px "+t.shadow+", 0 0 0 1px "+t.accent+"22",
        animation:"slideUp .3s",
        backdropFilter:"blur(12px)",
      }}>
        <span style={{fontSize:"11px",fontFamily:mono,color:t.accent,fontWeight:600}}>🔧 管理模式</span>
        <div style={{width:"1px",height:"16px",background:t.border}}/>
        <Btn sz="sm" v={view==="admin"?"primary":"default"} onClick={()=>setView("admin")} t={t}>管理列表</Btn>
        <Btn sz="sm" v="primary" onClick={goN} t={t}>＋ 新增</Btn>
        <Btn sz="sm" onClick={()=>setShowData(true)} t={t}>📦 匯入匯出</Btn>
        <Btn sz="sm" v="danger" onClick={()=>{
          if(confirm("確定重置為預設資料？")){persist(SEED);flash("已重置");}
        }} t={t}>重置</Btn>
        <div style={{width:"1px",height:"16px",background:t.border}}/>
        <Btn sz="sm" v="ghost" onClick={()=>{setIsAdmin(false);setView("browse");flash("已登出管理");}} t={t}>登出</Btn>
      </div>
    )}

    {/* ═══ BROWSE ═══ */}
    {view==="browse"&&<div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <StatsDashboard topics={topics} t={t} filterType={filterType} setFilterType={setFilterType} />

      {/* Compact toolbar: search + tags + active filter badges */}
      <div style={{padding:"8px 24px",borderBottom:"1px solid "+t.border,background:t.bgPanel,display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}>
        {/* Search */}
        <div style={{position:"relative",flex:"1 1 200px",maxWidth:"340px"}}>
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="搜尋題目、關鍵字、理論..." style={{...inputS,paddingLeft:"28px",fontSize:"12px"}} />
          <span style={{position:"absolute",left:"9px",top:"50%",transform:"translateY(-50%)",fontSize:"13px",color:t.inkMuted,pointerEvents:"none"}}>⌕</span>
        </div>
        {/* Active filter badges */}
        {filterType && <span style={{fontSize:"10px",fontFamily:mono,color:filterType==="exam"?t.examColor:t.knowColor,background:filterType==="exam"?t.examBg:t.knowBg,padding:"3px 10px",borderRadius:"3px",fontWeight:600}}>
          {filterType==="exam"?"📝 考古題":"📚 知識"} <button onClick={()=>setFilterType(null)} style={{background:"none",border:"none",cursor:"pointer",color:"inherit",fontSize:"10px",marginLeft:"2px"}}>✕</button>
        </span>}
        {filterYear && <span style={{fontSize:"10px",fontFamily:mono,color:t.accent,background:t.accent+"18",padding:"3px 10px",borderRadius:"3px",fontWeight:600}}>
          {filterYear}年 <button onClick={()=>setFilterYear(null)} style={{background:"none",border:"none",cursor:"pointer",color:"inherit",fontSize:"10px",marginLeft:"2px"}}>✕</button>
        </span>}
        {filterCat && <span style={{fontSize:"10px",fontFamily:mono,color:t.green,background:t.green+"18",padding:"3px 10px",borderRadius:"3px",fontWeight:600}}>
          {filterCat} <button onClick={()=>setFilterCat(null)} style={{background:"none",border:"none",cursor:"pointer",color:"inherit",fontSize:"10px",marginLeft:"2px"}}>✕</button>
        </span>}
        {showBkmk && <span style={{fontSize:"10px",fontFamily:mono,color:t.accent,background:t.accent+"18",padding:"3px 10px",borderRadius:"3px",fontWeight:600}}>
          ⭐ 收藏 <button onClick={()=>setShowBkmk(false)} style={{background:"none",border:"none",cursor:"pointer",color:"inherit",fontSize:"10px",marginLeft:"2px"}}>✕</button>
        </span>}
        {(filterYear||filterCat||filterTag||filterType||searchQ||showBkmk) && <Btn sz="sm" v="ghost" onClick={()=>{setFilterYear(null);setFilterCat(null);setFilterTag(null);setFilterType(null);setSearchQ("");setShowBkmk(false);}} t={t} sx={{color:t.red,fontSize:"10px"}}>全部清除</Btn>}
        <div style={{flex:1}}/>
        {/* Column picker for table mode */}
        {dispMode==="table"&&<div style={{position:"relative"}}>
          <Btn sz="sm" onClick={()=>setShowColPk(!showColPk)} t={t}>欄位 ▾</Btn>
          {showColPk&&<div style={{position:"absolute",top:"100%",right:0,marginTop:"4px",padding:"10px 14px",background:t.bgCard,border:"1px solid "+t.border,borderRadius:"6px",boxShadow:"0 8px 30px "+t.shadow,zIndex:50,minWidth:"160px",animation:"fadeIn .15s"}}>
            {ALL_COLUMNS.map(c=><label key={c.key} style={{display:"flex",alignItems:"center",gap:"8px",padding:"3px 0",cursor:"pointer",fontSize:"12px",color:t.inkLight}}>
              <input type="checkbox" checked={visibleCols.includes(c.key)} onChange={()=>setVisibleCols(p=>p.includes(c.key)?p.filter(k=>k!==c.key):[...p,c.key])} style={{accentColor:t.accent}}/>{c.label}
            </label>)}
            <div style={{borderTop:"1px solid "+t.border,marginTop:"6px",paddingTop:"6px"}}><Btn sz="sm" v="ghost" onClick={()=>setShowColPk(false)} t={t}>完成</Btn></div>
          </div>}
        </div>}
      </div>

      {/* Tag quick-filter */}
      {allTags.length>0 && <div style={{padding:"5px 24px",display:"flex",gap:"4px",flexWrap:"wrap",alignItems:"center",borderBottom:"1px solid "+t.borderLight}}>
        <span style={{fontSize:"9px",fontFamily:mono,color:t.inkMuted,marginRight:"2px"}}>標籤</span>
        {allTags.map(x=><Tag key={x} active={filterTag===x} onClick={()=>setFilterTag(filterTag===x?null:x)} t={t}>{x}</Tag>)}
        {filterTag && <button onClick={()=>setFilterTag(null)} style={{fontSize:"10px",fontFamily:mono,color:t.red,background:"none",border:"none",cursor:"pointer",marginLeft:"4px"}}>✕ 清除標籤</button>}
      </div>}

      {/* Content: Blog-style layout */}
      <div style={{flex:1,overflow:"auto",padding:"24px"}}>
        {filtered.length===0 ? (
          <div style={{textAlign:"center",padding:"60px",color:t.inkMuted}}>
            <div style={{fontSize:"32px",marginBottom:"10px",opacity:.4}}>{showBkmk?"⭐":"🔍"}</div>
            <div style={{fontSize:"14px",fontWeight:600,color:t.inkLight}}>{showBkmk?"尚無收藏的項目":"找不到符合條件的資料"}</div>
          </div>
        ) : (
          <div style={{display:"flex",gap:"24px",alignItems:"flex-start"}}>
            {/* ── Main: Article cards ── */}
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
                <h2 style={{fontSize:"18px",fontWeight:900,color:t.ink}}>
                  {showBkmk ? "⭐ 我的收藏" : filterType==="exam" ? "📝 考古題" : filterType==="knowledge" ? "📚 知識文章" : "所有文章"}
                </h2>
                <span style={{fontSize:"11px",fontFamily:mono,color:t.inkMuted}}>共 {filtered.length} 筆</span>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"16px"}}>
                {filtered.map((item,idx) => (
                  <div key={item.id} onClick={()=>goD(item.id)}
                    style={{
                      border:"1px solid "+t.border,borderRadius:"8px",background:t.bgCard,
                      cursor:"pointer",transition:"all .2s",overflow:"hidden",
                      animation:"slideUp .3s",animationDelay:(Math.min(idx,8)*40)+"ms",
                      animationFillMode:"both",
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px "+t.shadow;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}
                  >
                    {/* Color top accent bar */}
                    <div style={{height:"3px",background:(item.type||"exam")==="exam"?t.examColor:t.knowColor}} />

                    <div style={{padding:"16px 18px"}}>
                      {/* Top row: type + category + year + bookmark */}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
                        <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                          <span style={{fontSize:"10px",fontFamily:mono,fontWeight:600,color:(item.type||"exam")==="exam"?t.examColor:t.knowColor,background:(item.type||"exam")==="exam"?t.examBg:t.knowBg,padding:"2px 8px",borderRadius:"3px"}}>
                            {(item.type||"exam")==="exam"?"考古題":"知識"}
                          </span>
                          <span style={{fontSize:"11px",fontFamily:mono,color:t.green,fontWeight:600}}>{item.category}</span>
                        </div>
                        <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                          <span style={{fontSize:"10px",fontFamily:mono,color:t.inkMuted}}>{item.year}</span>
                          <button onClick={e=>{e.stopPropagation();toggleBookmark(item.id);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:"14px",opacity:isBookmarked(item.id)?1:.3,transition:"opacity .15s"}}>{isBookmarked(item.id)?"⭐":"☆"}</button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 style={{fontSize:"16px",fontWeight:700,margin:"0 0 10px",lineHeight:1.45,color:t.ink}}>{item.title}</h3>

                      {/* Framework badge */}
                      {item.framework && (
                        <div style={{display:"inline-block",padding:"3px 10px",background:t.accent,color:"#111",fontSize:"10px",fontFamily:mono,fontWeight:600,borderRadius:"3px",marginBottom:"10px"}}>{item.framework}</div>
                      )}

                      {/* Tags */}
                      <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"10px"}}>
                        {item.tags.map(x => (
                          <span key={x} style={{fontSize:"10px",fontFamily:mono,color:t.inkMuted,border:"1px solid "+t.borderLight,padding:"2px 8px",borderRadius:"3px"}}>{x}</span>
                        ))}
                      </div>

                      {/* Bottom row: source + preview */}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"8px",borderTop:"1px solid "+t.borderLight}}>
                        <span style={{fontSize:"10px",fontFamily:mono,color:t.inkMuted}}>{item.source||""}</span>
                        <span style={{fontSize:"11px",fontFamily:mono,color:t.accent,fontWeight:500}}>閱讀 →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside style={{width:"260px",flexShrink:0,position:"sticky",top:"70px",display:"flex",flexDirection:"column",gap:"16px"}}>
              {/* Random recommendations */}
              <div style={{background:t.bgCard,border:"1px solid "+t.border,borderRadius:"8px",padding:"16px"}}>
                <h4 style={{fontSize:"13px",fontWeight:700,color:t.ink,marginBottom:"12px"}}>🎯 隨機推薦</h4>
                {topics.length > 0 && (() => {
                  const shuffled = [...topics].sort(() => 0.5 - Math.random()).slice(0, 4);
                  return shuffled.map(r => (
                    <div key={r.id} onClick={()=>goD(r.id)}
                      style={{padding:"8px 0",borderBottom:"1px solid "+t.borderLight,cursor:"pointer",transition:"color .15s"}}
                      onMouseEnter={e=>e.currentTarget.querySelector('span').style.color=t.accent}
                      onMouseLeave={e=>e.currentTarget.querySelector('span').style.color=t.inkLight}>
                      <span style={{fontSize:"12px",lineHeight:1.5,color:t.inkLight,display:"block",transition:"color .15s"}}>{r.title}</span>
                      <span style={{fontSize:"9px",fontFamily:mono,color:t.inkMuted}}>{r.category} · {r.year}</span>
                    </div>
                  ));
                })()}
              </div>

              {/* Quick stats */}
              <div style={{background:t.bgCard,border:"1px solid "+t.border,borderRadius:"8px",padding:"16px"}}>
                <h4 style={{fontSize:"13px",fontWeight:700,color:t.ink,marginBottom:"12px"}}>📊 資料統計</h4>
                {[
                  ["考古題",topics.filter(x=>(x.type||"exam")==="exam").length+"筆",t.examColor],
                  ["知識文章",topics.filter(x=>x.type==="knowledge").length+"筆",t.knowColor],
                  ["類別",[...new Set(topics.map(x=>x.category))].length+"種",t.green],
                  ["收藏",bookmarks.length+"筆",t.accent],
                ].map(([label,val,color])=>(
                  <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+t.borderLight}}>
                    <span style={{fontSize:"12px",color:t.inkLight}}>{label}</span>
                    <span style={{fontSize:"12px",fontFamily:mono,fontWeight:600,color}}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Tags cloud */}
              <div style={{background:t.bgCard,border:"1px solid "+t.border,borderRadius:"8px",padding:"16px"}}>
                <h4 style={{fontSize:"13px",fontWeight:700,color:t.ink,marginBottom:"12px"}}>🏷 標籤</h4>
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                  {allTags.map(x=>(
                    <button key={x} onClick={()=>setFilterTag(filterTag===x?null:x)}
                      style={{fontSize:"10px",fontFamily:mono,padding:"3px 8px",borderRadius:"3px",cursor:"pointer",transition:"all .15s",border:"1px solid "+(filterTag===x?t.accent:t.borderLight),background:filterTag===x?t.accent+"22":"transparent",color:filterTag===x?t.accent:t.inkMuted}}>
                      {x}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>}

    {/* ═══ DETAIL ═══ */}
    {view==="detail"&&sel&&<div style={{flex:1,overflow:"auto",animation:"fadeIn .2s"}}>
      <div style={{padding:"10px 24px",borderBottom:"1px solid "+t.border,background:t.bgPanel,display:"flex",alignItems:"center",gap:"8px",fontSize:"12px",fontFamily:mono,color:t.inkMuted}}>
        <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>setView("browse")}>瀏覽</span><span>›</span>
        <span style={{color:t.accent}}>{sel.year}</span><span>›</span><span style={{color:t.inkLight}}>{sel.title}</span>
        <div style={{flex:1}}/>
        <button onClick={()=>toggleBookmark(sel.id)} style={{background:"none",border:"1px solid "+t.border,borderRadius:"4px",padding:"4px 10px",cursor:"pointer",fontSize:"13px",color:isBookmarked(sel.id)?t.accent:t.inkMuted}}>
          {isBookmarked(sel.id)?"⭐ 已收藏":"☆ 收藏"}
        </button>
        {isAdmin&&<Btn sz="sm" onClick={()=>goE(sel.id)} t={t}>✎ 編輯</Btn>}
        <Btn sz="sm" v="ghost" onClick={()=>setView("browse")} t={t}>← 返回</Btn>
      </div>
      <div style={{maxWidth:"800px",margin:"0 auto",padding:"32px 24px"}}>
        <div style={{display:"flex",gap:"12px",alignItems:"center",marginBottom:"6px",flexWrap:"wrap"}}>
          <span style={{fontSize:"11px",fontFamily:mono,fontWeight:600,color:(sel.type||"exam")==="exam"?t.examColor:t.knowColor,background:(sel.type||"exam")==="exam"?t.examBg:t.knowBg,padding:"3px 10px",borderRadius:"3px"}}>{(sel.type||"exam")==="exam"?"📝 考古題":"📚 知識文章"}</span>
          <span style={{fontSize:"24px",fontWeight:900,background:t.accent,color:"#111",padding:"2px 14px",borderRadius:"3px",fontFamily:mono}}>{sel.year}</span>
          <span style={{fontSize:"12px",fontFamily:mono,color:t.green,fontWeight:600}}>{sel.category}</span>
          {sel.source&&<span style={{fontSize:"11px",fontFamily:mono,color:t.inkMuted}}>｜{sel.source}</span>}
        </div>
        <h2 style={{fontSize:"26px",fontWeight:900,lineHeight:1.35,margin:"8px 0 16px",color:t.ink}}>{sel.title}</h2>
        {sel.framework&&<div style={{display:"inline-block",padding:"6px 16px",background:t.accent,color:"#111",fontSize:"13px",fontFamily:mono,fontWeight:600,borderRadius:"3px",marginBottom:"24px"}}>框架：{sel.framework}</div>}

        <TableOfContents topic={sel} t={t} />

        {sel.question&&<Sect label="考題原文" color={t.examColor} t={t}>
          <div style={{fontSize:"14px",lineHeight:1.8,padding:"16px 18px",background:t.examBg,border:"1px solid "+t.examColor+"33",borderLeft:"3px solid "+t.examColor,borderRadius:"4px",whiteSpace:"pre-wrap",fontStyle:"italic",color:t.inkLight}}>{sel.question}</div>
        </Sect>}

        <Sect label="核心要點" color={t.accent} t={t}>
          {sel.keyPoints.map((p,i)=><div key={i} style={{display:"flex",gap:"12px",marginBottom:"10px",lineHeight:1.7,fontSize:"14.5px"}}>
            <span style={{fontFamily:mono,color:t.red||t.accent,fontSize:"11px",fontWeight:600,flexShrink:0,marginTop:"4px"}}>{String(i+1).padStart(2,"0")}</span>
            <span style={{color:t.ink}}>{p}</span>
          </div>)}
        </Sect>

        {sel.theory&&<Sect label="理論基礎" color={t.accent} t={t}>
          <div style={{fontSize:"14.5px",lineHeight:1.8,padding:"16px 18px",background:t.bgCard,border:"1px solid "+t.border,borderLeft:"3px solid "+t.accent,borderRadius:"4px",color:t.ink}}>{sel.theory}</div>
        </Sect>}

        {sel.essayTips&&<Sect label="答題策略" color={t.red} t={t}>
          <div style={{fontSize:"14.5px",lineHeight:1.8,padding:"16px 18px",background:t.red+"08",border:"1px solid "+t.red+"22",borderLeft:"3px solid "+t.red,borderRadius:"4px",color:t.ink}}>{sel.essayTips}</div>
        </Sect>}

        {sel.notes&&<Sect label="個人筆記" color={t.green} t={t}>
          <div style={{fontSize:"14px",lineHeight:1.8,padding:"16px 18px",background:t.green+"08",border:"1px solid "+t.green+"22",borderLeft:"3px solid "+t.green,borderRadius:"4px",whiteSpace:"pre-wrap",color:t.ink}}>{sel.notes}</div>
        </Sect>}

        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",paddingTop:"16px",borderTop:"1px solid "+t.border}}>
          {sel.tags.map(x=><span key={x} onClick={()=>{setFilterTag(x);setView("browse");}} style={{fontSize:"11px",fontFamily:mono,color:t.inkLight,border:"1px solid "+t.border,padding:"3px 10px",borderRadius:"2px",cursor:"pointer"}}>#{x}</span>)}
        </div>
      </div>
    </div>}

    {/* ═══ ADMIN ═══ */}
    {view==="admin"&&isAdmin&&<div style={{flex:1,overflow:"auto",animation:"fadeIn .2s"}}>
      <div style={{padding:"14px 24px",borderBottom:"1px solid "+t.border,background:t.bgPanel,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <h2 style={{fontSize:"16px",fontWeight:700,color:t.ink}}>後台管理</h2>
          <p style={{fontSize:"11px",fontFamily:mono,color:t.inkMuted}}>共 {topics.length} 筆資料 · 訪客看不到此頁面</p>
        </div>
      </div>
      <div style={{padding:"18px 24px",paddingBottom:"80px"}}>
        {topics.length===0?<div style={{textAlign:"center",padding:"60px",color:t.inkMuted}}><div style={{fontSize:"32px",opacity:.4}}>📝</div><Btn v="primary" onClick={goN} t={t} sx={{marginTop:"12px"}}>＋ 新增</Btn></div>
        :<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
          <thead><tr>{["類型","年份","類別","題目","來源","操作"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:"10px",fontFamily:mono,fontWeight:600,color:t.accent,letterSpacing:"1px",borderBottom:"2px solid "+t.accent,background:t.bgPanel,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>{[...topics].sort((a,b)=>b.year-a.year||a.title.localeCompare(b.title)).map((item,i)=><tr key={item.id} style={{background:i%2===0?t.bgCard:t.bgPanel}}>
            <td style={{padding:"10px 12px",borderBottom:"1px solid "+t.borderLight}}><CellContent topic={item} colKey="type" t={t}/></td>
            <td style={{padding:"10px 12px",borderBottom:"1px solid "+t.borderLight,fontFamily:mono,fontWeight:700,color:t.ink}}>{item.year}</td>
            <td style={{padding:"10px 12px",borderBottom:"1px solid "+t.borderLight}}><span style={{fontSize:"11px",fontFamily:mono,color:t.green,fontWeight:600}}>{item.category}</span></td>
            <td style={{padding:"10px 12px",borderBottom:"1px solid "+t.borderLight,fontWeight:600,maxWidth:"280px",color:t.ink}}>{item.title}</td>
            <td style={{padding:"10px 12px",borderBottom:"1px solid "+t.borderLight,fontSize:"12px",color:t.inkLight}}>{item.source||"—"}</td>
            <td style={{padding:"10px 12px",borderBottom:"1px solid "+t.borderLight}}>
              <div style={{display:"flex",gap:"6px"}}>
                <Btn sz="sm" onClick={()=>goD(item.id)} t={t}>檢視</Btn>
                <Btn sz="sm" v="primary" onClick={()=>goE(item.id)} t={t}>編輯</Btn>
                <Btn sz="sm" v="danger" onClick={()=>{if(confirm("刪除「"+item.title+"」？"))deleteTopic(item.id);}} t={t}>刪除</Btn>
              </div>
            </td>
          </tr>)}</tbody>
        </table></div>}
      </div>
    </div>}

    {/* ═══ FORM ═══ */}
    {view==="form"&&isAdmin&&<TopicForm initial={editId?topics.find(x=>x.id===editId):null} onSave={saveTopic} onCancel={()=>{setView("admin");setEditId(null);}} t={t}/>}

    {/* Footer */}
    <footer style={{borderTop:"1px solid "+t.border,padding:"10px 24px",fontSize:"10px",fontFamily:mono,color:t.inkMuted,display:"flex",justifyContent:"space-between",background:t.bgPanel}}>
      <span>敷地計畫與都市設計 — 建築師考試申論題知識庫</span>
      <span>資料自動儲存 · 僅供學習參考</span>
    </footer>
  </div>;
}
