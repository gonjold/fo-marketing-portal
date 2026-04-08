import { useState, useEffect, useCallback, useRef } from "react";
import { loadState, saveState, uploadImage } from "./firebase";

const RED = "#EB0A1E";
const DK = "#141414";
const G50 = "#F9FAFB"; const G100 = "#F3F4F6"; const G200 = "#E5E7EB"; const G300="#D1D5DB";
const G400 = "#9CA3AF"; const G500 = "#6B7280"; const G700 = "#374151"; const G800 = "#1F2937";
const GR = "#16A34A"; const BL = "#2563EB"; const AM = "#D97706"; const PU = "#7C3AED"; const TL = "#0D9488"; const RS = "#E11D48";

const CHANNELS = ["Email","Mail","SMS","Digital","Call","Text"];
const CC = {
  Email:{bg:"#EFF6FF",tx:"#1E40AF",bd:"#BFDBFE"}, Mail:{bg:"#F5F3FF",tx:"#5B21B6",bd:"#DDD6FE"},
  SMS:{bg:"#ECFDF5",tx:"#047857",bd:"#A7F3D0"}, Digital:{bg:"#FFFBEB",tx:"#92400E",bd:"#FDE68A"},
  Call:{bg:"#FEF2F2",tx:"#B91C1C",bd:"#FECACA"}, Text:{bg:"#F0FDF4",tx:"#15803D",bd:"#BBF7D0"},
};
const SC = { Active:GR, "At Risk":AM, Inactive:AM, Lost:RED, Conquest:G500 };
const VCOLS = [RED,BL,PU,TL,AM,RS,GR,G500];
const uid = () => Math.random().toString(36).slice(2,8);

const initV = [
  {id:"v1",name:"TVi",color:RED,desc:"OEM/SET lifecycle program. Handles 0-7 DOFU communications including Welcome, ToyotaCare, and scheduled service triggers."},
  {id:"v2",name:"OneVoicePlus",color:PU,desc:"OEM lifecycle program covering both DOFU windows. Works alongside TVi for comprehensive lifecycle coverage."},
  {id:"v3",name:"AutoPoint",color:BL,desc:"Core email and mail vendor. Integrated with Advanced Service for automated ASRs. Primary 8+ DOFU vendor."},
  {id:"v4",name:"Reynolds",color:TL,desc:"Monthly email blasts to entire database. No-cost baseline, blanket sends."},
  {id:"v5",name:"Innovative Direct",color:AM,desc:"DMS and Conquest VIN targeting including service pump-outs. Monthly e-blast."},
  {id:"v6",name:"CRM / BDC",color:G500,desc:"Internal team outbound calls, texts, and emails through CRM software."},
];

const initS = [
  { id:"s1",range:"<30 Days RDR",label:"New Owner",segment:"Active",
    goal:"Introduce service center, build relationship, activate ToyotaCare benefits.",
    vc:{v1:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Welcome, New Owner, ToyotaCare Intro"},v2:{on:false,ch:[],note:""},v3:{on:false,ch:[],note:""},v4:{on:false,ch:[],note:""},v5:{on:false,ch:[],note:""},v6:{on:true,ch:["Call","Text","Email"],note:"Sales Follow-Up, Service Intro"}},
    creatives:[{id:"c1",title:"Welcome / New Owner Kit",channels:"Mail + Email",desc:"Introduction to service center, ToyotaCare overview, first-visit incentive",img:""},{id:"c2",title:"ToyotaCare Activation",channels:"Email + SMS",desc:"Complimentary maintenance plan benefits and first service scheduling",img:""}],
    offers:["$35.55 Full Synthetic Oil Change","Complimentary Multi-Point Inspection","Free Shuttle"],
    financing:["Sunbit: 3-month 0% APR, 97% approval","Morgan Platinum: 6-month deferred interest"]},
  { id:"s2",range:"<30 Days RO",label:"After Service",segment:"Active",
    goal:"Capture declined/deferred work, reinforce positive experience, drive CSI.",
    vc:{v1:{on:true,ch:["Email","SMS"],note:"ASR, Service Recommendation"},v2:{on:false,ch:[],note:""},v3:{on:false,ch:[],note:""},v4:{on:false,ch:[],note:""},v5:{on:false,ch:[],note:""},v6:{on:true,ch:["Call","Text","Email"],note:"Declined/Deferred Follow-Up, CSI"}},
    creatives:[{id:"c3",title:"After Service Review (ASR)",channels:"Email + SMS",desc:"Automated post-RO follow-up with service recommendations",img:""},{id:"c4",title:"Declined Service Reminder",channels:"Email",desc:"Follow up on declined services with pricing and urgency",img:""}],
    offers:["Declined service discount","Free re-inspection"],financing:["Sunbit: 3-month 0% APR"]},
  { id:"s3",range:"5-6 Months RO",label:"Scheduled Service Due",segment:"Active",
    goal:"Proactive reminder before overdue. Highest-conversion retention window.",
    vc:{v1:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Scheduled Service Due, ToyotaCare"},v2:{on:false,ch:[],note:""},v3:{on:false,ch:[],note:""},v4:{on:true,ch:["Email"],note:"Monthly e-blast"},v5:{on:true,ch:["Mail","Email"],note:"Service reminder mailer"},v6:{on:true,ch:["Call","Text","Email"],note:"Appointment scheduling"}},
    creatives:[{id:"c5",title:"Service Due Reminder",channels:"Mail + Email",desc:"Your Toyota is due for scheduled maintenance",img:""},{id:"c6",title:"ToyotaCare Reminder",channels:"Email + SMS",desc:"Use complimentary maintenance before expiration",img:""}],
    offers:["$35.55 Oil Change","$99 4-Wheel Alignment","Buy 3 Tires Get 4th for $1"],financing:[]},
  { id:"s4",range:"6-8 Months RO",label:"Service Follow-Up",segment:"Active",
    goal:"Second touch for non-responders. Additional vendors activate here.",
    vc:{v1:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Non-Responder, Scheduled Due 2"},v2:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Service Retention"},v3:{on:true,ch:["Mail","Email","SMS"],note:"Retention mailer + email"},v4:{on:true,ch:["Email"],note:"Monthly e-blast"},v5:{on:true,ch:["Mail","Email"],note:"Service reminder"},v6:{on:true,ch:["Call","Text","Email"],note:"Outbound follow-up"}},
    creatives:[{id:"c7",title:"Overdue Service Reminder",channels:"Mail + Email + SMS",desc:"Escalated messaging for overdue maintenance",img:""},{id:"c8",title:"ToyotaCare Non-Responder",channels:"Email + SMS",desc:"Final ToyotaCare usage reminder",img:""}],
    offers:["$35.55 Oil Change","$99 Alignment","Tire Promo","Price Match"],financing:["Sunbit: 3-month 0% APR"]},
  { id:"s5",range:"8-12 Months RO",label:"At Risk",segment:"At Risk",
    goal:"Critical window. Maximum vendor saturation and strongest offers to prevent defection.",
    vc:{v1:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Past Due, TLE At Risk, Last Chance"},v2:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Business Opp Maintain"},v3:{on:true,ch:["Mail","Email","Call","SMS"],note:"At Risk retention"},v4:{on:true,ch:["Email"],note:"Monthly e-blast"},v5:{on:true,ch:["Mail","Email"],note:"Retention mailer"},v6:{on:true,ch:["Call","Text","Email"],note:"Priority outbound"}},
    creatives:[{id:"c9",title:"Last Chance / Past Due",channels:"Mail + Email + SMS",desc:"Escalated urgency before going inactive",img:""},{id:"c10",title:"At Risk Special Offer",channels:"Mail + Email",desc:"Enhanced discount to prevent defection",img:""}],
    offers:["$35.55 Oil Change","$99 Alignment","Tire Promo","Price Match","Free MPI"],financing:["Sunbit: 3-month 0% APR","Morgan Platinum: 6-month deferred"]},
  { id:"s6",range:"12-24 Months",label:"Inactive",segment:"Inactive",
    goal:"Re-engagement with aggressive offers before permanent defection.",
    vc:{v1:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Inactive, TLE Inactive, Recovery"},v2:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Business Opp Improve"},v3:{on:true,ch:["Mail","Email","Call","SMS"],note:"Re-engagement campaign"},v4:{on:true,ch:["Email"],note:"Monthly e-blast"},v5:{on:true,ch:["Mail","Email"],note:"Win-back mailer"},v6:{on:true,ch:["Call","Text","Email"],note:"Recovery outbound"}},
    creatives:[{id:"c11",title:"We Miss You",channels:"Mail + Email + SMS",desc:"Personalized return offer with vehicle info",img:""},{id:"c12",title:"Exclusive Return Offer",channels:"Mail",desc:"Higher-value printed mailer with coupon",img:""}],
    offers:["Enhanced service discount","Price Match","Free inspection"],financing:["Sunbit: 3-month 0% APR","Morgan Platinum: 6-month deferred"]},
  { id:"s7",range:"25-60 Months",label:"Lost / Recovery",segment:"Lost",
    goal:"Long-shot recovery or pivot to sales conquest for aging vehicles.",
    vc:{v1:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Lost, Recovery, Conquest"},v2:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Conquest, Not Engaged"},v3:{on:true,ch:["Mail","Email","SMS"],note:"Conquest campaign"},v4:{on:true,ch:["Email"],note:"Monthly e-blast"},v5:{on:true,ch:["Mail","Email"],note:"Conquest mailer"},v6:{on:true,ch:["Call","Text","Email"],note:"Conquest outbound"}},
    creatives:[{id:"c13",title:"Win-Back Campaign",channels:"Mail + Email",desc:"Aggressive pricing, competitive positioning",img:""},{id:"c14",title:"Trade-In Opportunity",channels:"Mail + Email + Digital",desc:"Vehicle aging pivot to sales with trade evaluation",img:""}],
    offers:["Major service discount","Free inspection","Trade-in evaluation"],financing:["Sunbit: 3-month 0% APR","Morgan Platinum: 6-month deferred"]},
  { id:"s8",range:"Never Serviced",label:"Conquest / Not Engaged",segment:"Conquest",
    goal:"Net-new acquisition targeting customers who have never visited the dealership.",
    vc:{v1:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Conquest, New VIN"},v2:{on:true,ch:["Email","Mail","SMS","Digital"],note:"Conquest"},v3:{on:true,ch:["Mail","Email","SMS","Digital"],note:"Conquest targeting"},v4:{on:true,ch:["Email"],note:"Database blast"},v5:{on:true,ch:["Mail","Email"],note:"Conquest VIN mailer"},v6:{on:false,ch:[],note:""}},
    creatives:[{id:"c15",title:"First Visit Incentive",channels:"Mail + Email + Digital",desc:"Intro offer for new-to-dealership customers",img:""},{id:"c16",title:"Conquest Pricing",channels:"Mail + Digital",desc:"Competitive pricing to pull from other dealers",img:""}],
    offers:["$35.55 Oil Change","$99 Alignment","Free MPI","Price Match"],financing:[]},
];

const GLOSS = [
  {t:"TLE Active",d:"Purchased or serviced at PMA dealer in last 12 months."},
  {t:"TLE Cross Active",d:"Serviced 2x at dealership outside PMA in last 12 months."},
  {t:"TLE Inactive",d:"No purchase/service at PMA dealer in last 12 months."},
  {t:"TLE Not Engaged",d:"Never purchased or serviced at PMA dealer."},
  {t:"DOFU",d:"Date of First Use. 0-7 = TVi/OV+ window. 8+ = AutoPoint activates."},
  {t:"ASR",d:"After Service Review. Automated post-RO follow-up."},
  {t:"RO / RDR",d:"Repair Order / Retail Delivery Report."},
  {t:"PMA",d:"Primary Market Area."},
  {t:"MPI",d:"Multi-Point Inspection."},
];

// --- Micro-components ---
const ChT = ({ch,sm}) => { const c=CC[ch]||CC.Email; return <span style={{display:"inline-block",fontSize:sm?9:10,fontWeight:600,padding:sm?"1px 5px":"2px 7px",borderRadius:4,background:c.bg,color:c.tx,border:`1px solid ${c.bd}`,marginRight:3,marginBottom:2}}>{ch}</span>; };
const SB = ({s}) => { const c=SC[s]||G500; return <span style={{fontSize:10,fontWeight:700,color:c,background:c+"12",padding:"3px 10px",borderRadius:99,border:`1px solid ${c}22`}}>{s}</span>; };
const Btn = ({children,onClick,primary,small,danger,ghost,disabled,sx})=><button disabled={disabled} onClick={onClick} style={{padding:small?"4px 10px":"7px 16px",fontSize:small?11:12,fontWeight:600,borderRadius:6,cursor:disabled?"default":"pointer",border:ghost?`1px solid ${G200}`:"none",opacity:disabled?.4:1,background:danger?"#FEE2E2":primary?RED:ghost?"#fff":G100,color:danger?"#B91C1C":primary?"#fff":G700,transition:"all .15s",...sx}}>{children}</button>;
const Inp = ({value,onChange,placeholder,sx,...r})=><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{padding:"7px 10px",border:`1px solid ${G200}`,borderRadius:6,fontSize:13,width:"100%",fontFamily:"inherit",...sx}} {...r}/>;
const TA = ({value,onChange,placeholder,rows=2})=><textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{padding:"7px 10px",border:`1px solid ${G200}`,borderRadius:6,fontSize:12,width:"100%",fontFamily:"inherit",resize:"vertical"}}/>;

const Modal = ({title,onClose,children,wide})=>(
  <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:40}}>
    <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)"}}/>
    <div style={{position:"relative",background:"#fff",borderRadius:14,padding:0,width:wide?760:520,maxWidth:"94vw",maxHeight:"85vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,.25)"}}>
      <div style={{position:"sticky",top:0,background:"#fff",padding:"16px 24px",borderBottom:`1px solid ${G200}`,display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:1,borderRadius:"14px 14px 0 0"}}>
        <h3 style={{fontSize:16,fontWeight:700,margin:0,color:DK}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,color:G400,cursor:"pointer",lineHeight:1}}>x</button>
      </div>
      <div style={{padding:"16px 24px 24px"}}>{children}</div>
    </div>
  </div>
);

// Loading skeleton
const LoadingSkeleton = () => (
  <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>
    <header style={{background:"#fff",borderBottom:`3px solid ${RED}`,padding:"12px 24px",display:"flex",alignItems:"center",gap:14}}>
      <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${RED},#ff3040)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13}}>FO</div>
      <div>
        <div style={{fontSize:10,fontWeight:700,color:RED,letterSpacing:2,textTransform:"uppercase"}}>Toyota of Coconut Creek</div>
        <div style={{fontSize:18,fontWeight:800,color:DK}}>Customer Communication Journey</div>
      </div>
    </header>
    <div style={{padding:"40px 24px",textAlign:"center"}}>
      <div style={{display:"inline-block",width:24,height:24,border:`3px solid ${G200}`,borderTopColor:RED,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <div style={{fontSize:13,color:G400,marginTop:12}}>Loading portal data...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  </div>
);

// Save toast
const Toast = ({show}) => (
  <div style={{
    position:"fixed",bottom:24,right:24,zIndex:3000,
    background:"#065F46",color:"#fff",padding:"8px 18px",borderRadius:8,
    fontSize:12,fontWeight:600,boxShadow:"0 4px 12px rgba(0,0,0,.15)",
    opacity:show?1:0,transform:show?"translateY(0)":"translateY(10px)",
    transition:"all .3s",pointerEvents:"none",
  }}>Saved</div>
);

// ===================== MAIN =====================
export default function App() {
  const [V, setV] = useState(initV);
  const [S, setS] = useState(initS);
  const [tab, setTab] = useState("journey");
  const [mod, setMod] = useState(null);
  const [edit, setEdit] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [exp, setExp] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const EDIT_PW = "tocc2026";
  const saveTimer = useRef(null);

  const tryUnlock = () => {
    if (pw === EDIT_PW) { setEdit(true); setShowPwModal(false); setPw(""); setPwErr(false); }
    else { setPwErr(true); }
  };
  const lockUp = () => { setEdit(false); setShowPwModal(false); setPw(""); };

  // Load from Firestore on mount
  useEffect(()=>{
    (async()=>{
      const data = await loadState();
      if(data){
        if(data.vendors) setV(data.vendors);
        if(data.stages) setS(data.stages);
      }
      setLoading(false);
    })();
  },[]);

  // Debounced save to Firestore (300ms)
  const sv = useCallback((v,s)=>{
    if(saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async ()=>{
      await saveState(v,s);
      setShowToast(true);
      setTimeout(()=>setShowToast(false),2000);
    },300);
  },[]);

  const uV=v=>{setV(v);sv(v,S);}; const uS=s=>{setS(s);sv(V,s);};

  const saveStage=d=>{if(S.find(s=>s.id===d.id)){uS(S.map(s=>s.id===d.id?d:s));}else{uS([...S,d]);}setMod(null);};
  const delStage=id=>{uS(S.filter(s=>s.id!==id));setMod(null);};
  const saveVendor=d=>{if(V.find(v=>v.id===d.id)){uV(V.map(v=>v.id===d.id?d:v));}else{uV([...V,d]);uS(S.map(s=>({...s,vc:{...s.vc,[d.id]:{on:false,ch:[],note:""}}})));}setMod(null);};
  const delVendor=id=>{uV(V.filter(v=>v.id!==id));uS(S.map(s=>{const vc={...s.vc};delete vc[id];return{...s,vc};}));setMod(null);};

  if(loading) return <LoadingSkeleton/>;

  return (
    <div style={{minHeight:"100vh",background:"#fff",color:DK,fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>
      <style>{`*{box-sizing:border-box}input,textarea,select{font-family:inherit}::selection{background:${RED}30}.tl-card:hover{box-shadow:0 2px 16px rgba(0,0,0,.06)}`}</style>

      {/* HEADER */}
      <header style={{background:"#fff",borderBottom:`3px solid ${RED}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${RED},#ff3040)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13,letterSpacing:-1}}>FO</div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:RED,letterSpacing:2,textTransform:"uppercase"}}>Toyota of Coconut Creek</div>
            <div style={{fontSize:18,fontWeight:800,color:DK,letterSpacing:-.5}}>Customer Communication Journey</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {edit ? (
            <button onClick={lockUp} title="Lock editing" style={{background:"none",border:`1px solid ${RED}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:RED,fontSize:12,fontWeight:600}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Lock
            </button>
          ) : (
            <button onClick={()=>setShowPwModal(true)} title="Unlock editing" style={{background:"none",border:`1px solid ${G200}`,borderRadius:8,padding:"7px 8px",cursor:"pointer",display:"flex",alignItems:"center"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={G400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </button>
          )}
        </div>
      </header>

      {/* TABS */}
      <nav style={{borderBottom:`1px solid ${G200}`,padding:"0 24px",display:"flex"}}>
        {[{id:"journey",l:"Journey"},{id:"creatives",l:"Creative Gallery"},{id:"vendors",l:"Vendors"}].map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setExp(null);}} style={{padding:"11px 18px",fontSize:13,fontWeight:600,cursor:"pointer",background:"none",border:"none",marginBottom:-1,color:tab===t.id?RED:G500,borderBottom:tab===t.id?`2px solid ${RED}`:"2px solid transparent"}}>{t.l}</button>
        ))}
      </nav>

      <div style={{display:"flex"}}>
        <main style={{flex:1,padding:"20px 24px",minWidth:0}}>

          {/* ========== JOURNEY ========== */}
          {tab==="journey"&&(
            <div style={{margin:"0 -8px"}}>
              {/* Legend — compact strip */}
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10,padding:"5px 12px",background:G50,borderRadius:6,border:`1px solid ${G100}`,alignItems:"center"}}>
                {V.map(v=><div key={v.id} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:2,background:v.color}}/><span style={{fontSize:11,fontWeight:600,color:G800}}>{v.name}</span></div>)}
                <div style={{marginLeft:"auto",display:"flex",gap:3,flexWrap:"wrap"}}>{CHANNELS.map(ch=><ChT key={ch} ch={ch} sm/>)}</div>
              </div>

              {/* Matrix Table */}
              <div style={{overflowX:"auto",borderRadius:8,border:`1px solid ${G200}`}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:700}}>
                  <thead>
                    <tr style={{background:G50}}>
                      <th style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:G500,textTransform:"uppercase",letterSpacing:1,borderBottom:`2px solid ${G200}`,minWidth:150}}>Stage</th>
                      {V.map(v=>(
                        <th key={v.id} style={{padding:"8px 6px",textAlign:"center",fontSize:10,fontWeight:700,color:G700,borderBottom:`2px solid ${G200}`,whiteSpace:"nowrap"}}>
                          <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
                            <div style={{width:8,height:8,borderRadius:2,background:v.color,flexShrink:0}}/>
                            {v.name}
                          </div>
                        </th>
                      ))}
                      <th style={{width:60,borderBottom:`2px solid ${G200}`,background:G50}}/>
                    </tr>
                  </thead>
                  <tbody>
                    {S.map((stage,idx)=>{
                      const isExp=exp===stage.id;
                      const sc=SC[stage.segment]||G400;
                      const actV=V.filter(v=>stage.vc[v.id]?.on);
                      const rowBg=isExp?sc+"08":idx%2===0?"#fff":G50;
                      const rows=[
                        <tr key={stage.id} onClick={()=>setExp(isExp?null:stage.id)} style={{cursor:"pointer",background:rowBg,transition:"background .15s"}}>
                          <td style={{padding:"10px 12px",borderBottom:`1px solid ${G100}`,borderLeft:`3px solid ${sc}`,verticalAlign:"middle"}}>
                            <div style={{fontWeight:700,fontSize:13,color:DK}}>{stage.range}</div>
                            <div style={{fontSize:11,color:G500,marginTop:1}}>{stage.label}</div>
                            <div style={{marginTop:3}}><SB s={stage.segment}/></div>
                          </td>
                          {V.map(v=>{
                            const vc=stage.vc[v.id];
                            return(
                              <td key={v.id} style={{padding:"6px 4px",borderBottom:`1px solid ${G100}`,textAlign:"center",verticalAlign:"middle"}}>
                                {vc?.on?(
                                  <div style={{display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center"}}>{vc.ch.map(c=><ChT key={c} ch={c} sm/>)}</div>
                                ):(
                                  <span style={{color:G300,fontSize:14}}>—</span>
                                )}
                              </td>
                            );
                          })}
                          <td style={{padding:"6px 8px",borderBottom:`1px solid ${G100}`,textAlign:"right",verticalAlign:"middle"}}>
                            <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
                              {edit&&<Btn small ghost onClick={e=>{e.stopPropagation();setMod({type:"stage",data:{...stage}});}}>Edit</Btn>}
                              <span style={{fontSize:18,color:G400,transform:isExp?"rotate(90deg)":"none",transition:"transform .2s",display:"inline-block"}}>{"\u203A"}</span>
                            </div>
                          </td>
                        </tr>
                      ];
                      if(isExp){
                        rows.push(
                          <tr key={stage.id+"-exp"}>
                            <td colSpan={V.length+2} style={{padding:0,borderBottom:`1px solid ${G100}`}}>
                              <div onClick={e=>e.stopPropagation()} style={{padding:"16px 20px",background:sc+"04",cursor:"default"}}>
                                <div style={{padding:"12px 14px",background:"#fff",borderRadius:8,border:`1px solid ${G200}`,marginBottom:14}}>
                                  <div style={{fontSize:10,fontWeight:700,color:G400,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Strategy</div>
                                  <div style={{fontSize:13,color:G700,lineHeight:1.6}}>{stage.goal}</div>
                                </div>
                                <div style={{fontSize:10,fontWeight:700,color:G400,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Communication Details</div>
                                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8,marginBottom:14}}>
                                  {actV.map(v=>{
                                    const vc=stage.vc[v.id];
                                    return(
                                      <div key={v.id} style={{padding:"10px 12px",borderRadius:8,background:"#fff",border:`1px solid ${G200}`,borderLeft:`3px solid ${v.color}`}}>
                                        <div style={{fontSize:12,fontWeight:700,color:v.color,marginBottom:4}}>{v.name}</div>
                                        <div style={{fontSize:11,color:G500,lineHeight:1.5}}>{vc.note}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                                {(stage.offers.length>0||stage.financing.length>0)&&(
                                  <div>
                                    <div style={{fontSize:10,fontWeight:700,color:G400,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Offers & Financing</div>
                                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                                      {stage.offers.map((o,i)=><span key={i} style={{fontSize:10,fontWeight:600,padding:"4px 12px",borderRadius:99,background:RED+"08",color:RED,border:`1px solid ${RED}18`}}>{o}</span>)}
                                      {stage.financing.map((f,i)=><span key={i} style={{fontSize:10,fontWeight:600,padding:"4px 12px",borderRadius:99,background:BL+"08",color:BL,border:`1px solid ${BL}18`}}>{f}</span>)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return rows;
                    })}
                  </tbody>
                </table>
              </div>

              {edit&&(
                <div style={{marginTop:12}}>
                  <Btn primary onClick={()=>setMod({type:"stage",data:{id:uid(),range:"",label:"",segment:"Active",goal:"",vc:Object.fromEntries(V.map(v=>[v.id,{on:false,ch:[],note:""}])),creatives:[],offers:[],financing:[]}})}>+ Add Stage</Btn>
                </div>
              )}
            </div>
          )}

          {/* ========== CREATIVE GALLERY ========== */}
          {tab==="creatives"&&(
            <div>
              {S.map(stage=>{
                if(stage.creatives.length===0 && !edit) return null;
                const sc=SC[stage.segment]||G400;
                return (
                  <div key={stage.id} style={{marginBottom:28}}>
                    {/* Stage header */}
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:8,borderBottom:`2px solid ${sc}20`}}>
                      <div style={{width:4,height:24,borderRadius:2,background:sc}}/>
                      <span style={{fontSize:15,fontWeight:700,color:DK}}>{stage.range}</span>
                      <span style={{fontSize:12,color:G500}}>{stage.label}</span>
                      <SB s={stage.segment}/>
                      {edit&&<Btn small ghost onClick={()=>setMod({type:"stage",data:{...stage}})} sx={{marginLeft:"auto"}}>Edit Creatives</Btn>}
                    </div>

                    {/* Creative cards */}
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
                      {stage.creatives.map(cr=>(
                        <div key={cr.id} style={{borderRadius:10,border:`1px solid ${G200}`,overflow:"hidden",background:"#fff",transition:"box-shadow .2s"}} className="tl-card">
                          {/* Image area */}
                          <div
                            onClick={()=>cr.img&&setPreview(cr.img)}
                            style={{
                              height:160,background:cr.img?`url(${cr.img}) center/cover`:sc+"08",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              cursor:cr.img?"pointer":"default",position:"relative",
                            }}
                          >
                            {!cr.img&&(
                              <div style={{textAlign:"center",color:sc,opacity:.4}}>
                                <div style={{fontSize:32,marginBottom:4}}>+</div>
                                <div style={{fontSize:10,fontWeight:600}}>No creative uploaded</div>
                              </div>
                            )}
                            {cr.img&&<div style={{position:"absolute",bottom:6,right:6,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:9,padding:"2px 8px",borderRadius:4,fontWeight:600}}>Click to preview</div>}
                          </div>
                          {/* Info */}
                          <div style={{padding:"12px 14px"}}>
                            <div style={{fontSize:13,fontWeight:700,color:DK,marginBottom:2}}>{cr.title}</div>
                            <div style={{display:"flex",gap:3,marginBottom:6,flexWrap:"wrap"}}>
                              {cr.channels.split(/\s*\+\s*/).map(ch=><ChT key={ch} ch={ch.trim()} sm/>)}
                            </div>
                            <div style={{fontSize:11,color:G500,lineHeight:1.5}}>{cr.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Offers row */}
                    {(stage.offers.length>0||stage.financing.length>0)&&(
                      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:10}}>
                        {stage.offers.map((o,i)=><span key={i} style={{fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:99,background:RED+"08",color:RED,border:`1px solid ${RED}18`}}>{o}</span>)}
                        {stage.financing.map((f,i)=><span key={i} style={{fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:99,background:BL+"08",color:BL,border:`1px solid ${BL}18`}}>{f}</span>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ========== VENDORS ========== */}
          {tab==="vendors"&&(<>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14}}>
              {V.map(v=>(
                <div key={v.id} style={{border:`1px solid ${G200}`,borderRadius:10,padding:18,borderTop:`3px solid ${v.color}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{fontSize:16,fontWeight:700}}>{v.name}</div>
                    {edit&&<div style={{display:"flex",gap:4}}>
                      <Btn small ghost onClick={()=>setMod({type:"vendor",data:{...v}})}>Edit</Btn>
                      <Btn small danger onClick={()=>{if(confirm(`Delete ${v.name}?`))delVendor(v.id);}}>Del</Btn>
                    </div>}
                  </div>
                  <p style={{fontSize:12,color:G500,lineHeight:1.6,margin:"6px 0 0"}}>{v.desc}</p>
                </div>
              ))}
              {edit&&<div style={{border:`2px dashed ${G300}`,borderRadius:10,padding:18,display:"flex",alignItems:"center",justifyContent:"center",minHeight:100}}>
                <Btn primary onClick={()=>setMod({type:"vendor",data:{id:uid(),name:"",color:VCOLS[V.length%VCOLS.length],desc:""}})}>+ Add Vendor</Btn>
              </div>}
            </div>

            {/* Key Terms */}
            <div style={{marginTop:24}}>
              <button onClick={()=>setShowTerms(!showTerms)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,padding:0,marginBottom:showTerms?12:0}}>
                <span style={{fontSize:12,fontWeight:700,color:G500}}>Key Terms</span>
                <span style={{fontSize:14,color:G400,transform:showTerms?"rotate(90deg)":"none",transition:"transform .2s",display:"inline-block"}}>{"\u203A"}</span>
              </button>
              {showTerms&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:8}}>
                {GLOSS.map((g,i)=><div key={i} style={{padding:"8px 12px",background:G50,borderRadius:6,border:`1px solid ${G100}`}}>
                  <span style={{fontSize:11,fontWeight:700,color:RED}}>{g.t}</span>
                  <span style={{fontSize:11,color:G500,marginLeft:6}}>{g.d}</span>
                </div>)}
              </div>}
            </div>
          </>)}
        </main>
      </div>

      {/* IMAGE PREVIEW */}
      {preview&&<div onClick={()=>setPreview(null)} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.8)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:40}}>
        <img src={preview} style={{maxWidth:"90%",maxHeight:"90%",borderRadius:8,boxShadow:"0 20px 60px rgba(0,0,0,.5)"}}/>
      </div>}

      {/* PASSWORD MODAL */}
      {showPwModal&&(
        <div style={{position:"fixed",inset:0,zIndex:1500,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div onClick={()=>{setShowPwModal(false);setPw("");setPwErr(false);}} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
          <div style={{position:"relative",background:"#fff",borderRadius:14,padding:28,width:340,boxShadow:"0 20px 60px rgba(0,0,0,.2)",textAlign:"center"}}>
            <div style={{marginBottom:16}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div style={{fontSize:16,fontWeight:700,color:DK,marginBottom:4}}>Unlock Editing</div>
            <div style={{fontSize:12,color:G500,marginBottom:16}}>Enter password to make changes</div>
            <input
              type="password" value={pw} onChange={e=>{setPw(e.target.value);setPwErr(false);}}
              onKeyDown={e=>e.key==="Enter"&&tryUnlock()}
              placeholder="Password"
              autoFocus
              style={{width:"100%",padding:"10px 14px",border:`1px solid ${pwErr?RED:G200}`,borderRadius:8,fontSize:14,textAlign:"center",marginBottom:pwErr?4:14,fontFamily:"inherit",outline:"none"}}
            />
            {pwErr&&<div style={{fontSize:11,color:RED,marginBottom:10}}>Incorrect password</div>}
            <div style={{display:"flex",gap:8}}>
              <Btn sx={{flex:1}} onClick={()=>{setShowPwModal(false);setPw("");setPwErr(false);}}>Cancel</Btn>
              <Btn primary sx={{flex:1}} onClick={tryUnlock}>Unlock</Btn>
            </div>
          </div>
        </div>
      )}

      {/* STAGE MODAL */}
      {mod?.type==="stage"&&<StageModal s={mod.data} vendors={V} onSave={saveStage} onDel={delStage} onClose={()=>setMod(null)}/>}

      {/* VENDOR MODAL */}
      {mod?.type==="vendor"&&<VendorModal v={mod.data} onSave={saveVendor} onDel={delVendor} onClose={()=>setMod(null)}/>}

      {/* SAVE TOAST */}
      <Toast show={showToast}/>
    </div>
  );
}

// ===================== STAGE MODAL =====================
function StageModal({s:init,vendors,onSave,onDel,onClose}){
  const [s,setS]=useState(JSON.parse(JSON.stringify(init)));
  const isNew=!init.range;
  const u=(k,v)=>setS({...s,[k]:v});
  const sVC=(vid,k,val)=>setS({...s,vc:{...s.vc,[vid]:{...s.vc[vid],[k]:val}}});
  const tCh=(vid,ch)=>{const c=s.vc[vid]?.ch||[];sVC(vid,"ch",c.includes(ch)?c.filter(x=>x!==ch):[...c,ch]);};
  const addCr=()=>u("creatives",[...s.creatives,{id:uid(),title:"",channels:"",desc:"",img:""}]);
  const uCr=(id,k,v)=>u("creatives",s.creatives.map(c=>c.id===id?{...c,[k]:v}:c));
  const rmCr=id=>u("creatives",s.creatives.filter(c=>c.id!==id));
  const [nO,sNO]=useState("");const [nF,sNF]=useState("");

  const handleImg=async(crId,file)=>{
    if(!file)return;
    // For small images (<100KB), keep base64 as fallback
    if(file.size < 100*1024){
      const r=new FileReader();
      r.onload=()=>uCr(crId,"img",r.result);
      r.readAsDataURL(file);
      return;
    }
    // Upload larger images to Firebase Storage
    const url = await uploadImage(file);
    if(url){
      uCr(crId,"img",url);
    } else {
      // Fallback to base64 if storage upload fails
      const r=new FileReader();
      r.onload=()=>uCr(crId,"img",r.result);
      r.readAsDataURL(file);
    }
  };

  return(
    <Modal title={isNew?"Add Lifecycle Stage":`Edit: ${init.range} \u2014 ${init.label}`} onClose={onClose} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <div><label style={{fontSize:11,fontWeight:600,color:G500,display:"block",marginBottom:4}}>Time Range</label><Inp value={s.range} onChange={v=>u("range",v)} placeholder="e.g. 12-24 Months"/></div>
        <div><label style={{fontSize:11,fontWeight:600,color:G500,display:"block",marginBottom:4}}>Label</label><Inp value={s.label} onChange={v=>u("label",v)} placeholder="e.g. Inactive"/></div>
      </div>

      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:600,color:G500,display:"block",marginBottom:4}}>Segment</label>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{Object.keys(SC).map(seg=>(
          <button key={seg} onClick={()=>u("segment",seg)} style={{padding:"5px 14px",borderRadius:99,fontSize:11,fontWeight:600,cursor:"pointer",border:s.segment===seg?`2px solid ${SC[seg]}`:`1px solid ${G200}`,background:s.segment===seg?SC[seg]+"15":"#fff",color:s.segment===seg?SC[seg]:G500}}>{seg}</button>
        ))}</div>
      </div>

      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:600,color:G500,display:"block",marginBottom:4}}>Goal / Strategy</label>
        <TA value={s.goal} onChange={v=>u("goal",v)} placeholder="What's the goal for this stage?"/>
      </div>

      {/* Vendors */}
      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:600,color:G500,display:"block",marginBottom:8}}>Vendor Coverage</label>
        {vendors.map(v=>{const vc=s.vc[v.id]||{on:false,ch:[],note:""};return(
          <div key={v.id} style={{padding:"8px 12px",border:`1px solid ${vc.on?v.color+"40":G200}`,borderRadius:8,background:vc.on?v.color+"04":"#fff",marginBottom:6}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:vc.on?6:0}}>
              <input type="checkbox" checked={vc.on} onChange={()=>sVC(v.id,"on",!vc.on)} style={{accentColor:v.color}}/>
              <span style={{fontSize:12,fontWeight:700,color:vc.on?v.color:G400}}>{v.name}</span>
            </div>
            {vc.on&&<div style={{paddingLeft:24}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:6}}>{CHANNELS.map(ch=>{const sel=vc.ch.includes(ch);const cc=CC[ch];return(
                <button key={ch} onClick={()=>tCh(v.id,ch)} style={{padding:"3px 8px",borderRadius:4,fontSize:10,fontWeight:600,cursor:"pointer",background:sel?cc.bg:"#fff",color:sel?cc.tx:G400,border:`1px solid ${sel?cc.bd:G200}`}}>{ch}</button>
              );})}</div>
              <Inp value={vc.note} onChange={v2=>sVC(v.id,"note",v2)} placeholder="What do they send?" sx={{fontSize:11}}/>
            </div>}
          </div>
        );})}
      </div>

      {/* Creatives */}
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <label style={{fontSize:11,fontWeight:600,color:G500}}>Creatives</label>
          <Btn small onClick={addCr}>+ Add Creative</Btn>
        </div>
        {s.creatives.map(cr=>(
          <div key={cr.id} style={{border:`1px solid ${G200}`,borderRadius:8,padding:12,marginBottom:8}}>
            <div style={{display:"flex",gap:8,marginBottom:6}}>
              <Inp value={cr.title} onChange={v=>uCr(cr.id,"title",v)} placeholder="Title" sx={{fontSize:12,flex:1}}/>
              <Inp value={cr.channels} onChange={v=>uCr(cr.id,"channels",v)} placeholder="Channels (e.g. Mail + Email)" sx={{fontSize:11,width:160}}/>
              <Btn small danger onClick={()=>rmCr(cr.id)}>x</Btn>
            </div>
            <TA value={cr.desc} onChange={v=>uCr(cr.id,"desc",v)} placeholder="Description" rows={1}/>
            {/* Image upload */}
            <div style={{marginTop:8,display:"flex",alignItems:"center",gap:10}}>
              {cr.img?<img src={cr.img} style={{width:60,height:40,objectFit:"cover",borderRadius:4,border:`1px solid ${G200}`}}/>:<div style={{width:60,height:40,borderRadius:4,border:`2px dashed ${G300}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:G400}}>+</div>}
              <label style={{fontSize:11,color:BL,fontWeight:600,cursor:"pointer"}}>
                {cr.img?"Replace image":"Upload image"}
                <input type="file" accept="image/*" onChange={e=>handleImg(cr.id,e.target.files[0])} style={{display:"none"}}/>
              </label>
              {cr.img&&<button onClick={()=>uCr(cr.id,"img","")} style={{fontSize:10,color:G400,background:"none",border:"none",cursor:"pointer"}}>Remove</button>}
              <div style={{flex:1}}/>
              <Inp value={cr.img&&!cr.img.startsWith("data:")?cr.img:""} onChange={v=>uCr(cr.id,"img",v)} placeholder="or paste image URL" sx={{fontSize:10,width:180}}/>
            </div>
          </div>
        ))}
      </div>

      {/* Offers */}
      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:600,color:G500,display:"block",marginBottom:6}}>Offers</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>{s.offers.map((o,i)=>(
          <span key={i} style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:RED+"08",color:RED,border:`1px solid ${RED}18`,display:"flex",alignItems:"center",gap:4}}>{o}<button onClick={()=>u("offers",s.offers.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:RED,cursor:"pointer",fontSize:13,lineHeight:1,padding:0}}>x</button></span>
        ))}</div>
        <div style={{display:"flex",gap:6}}><Inp value={nO} onChange={sNO} placeholder="Add offer..." sx={{fontSize:11,flex:1}}/><Btn small onClick={()=>{if(nO.trim()){u("offers",[...s.offers,nO.trim()]);sNO("");}}}> Add</Btn></div>
      </div>

      {/* Financing */}
      <div style={{marginBottom:18}}>
        <label style={{fontSize:11,fontWeight:600,color:G500,display:"block",marginBottom:6}}>Financing</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>{s.financing.map((f,i)=>(
          <span key={i} style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:BL+"08",color:BL,border:`1px solid ${BL}18`,display:"flex",alignItems:"center",gap:4}}>{f}<button onClick={()=>u("financing",s.financing.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:BL,cursor:"pointer",fontSize:13,lineHeight:1,padding:0}}>x</button></span>
        ))}</div>
        <div style={{display:"flex",gap:6}}><Inp value={nF} onChange={sNF} placeholder="Add financing..." sx={{fontSize:11,flex:1}}/><Btn small onClick={()=>{if(nF.trim()){u("financing",[...s.financing,nF.trim()]);sNF("");}}}> Add</Btn></div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",borderTop:`1px solid ${G200}`,paddingTop:14}}>
        {!isNew?<Btn danger onClick={()=>{if(confirm("Delete this stage?"))onDel(s.id);}}>Delete Stage</Btn>:<div/>}
        <div style={{display:"flex",gap:8}}><Btn onClick={onClose}>Cancel</Btn><Btn primary onClick={()=>onSave(s)} disabled={!s.range.trim()}>Save</Btn></div>
      </div>
    </Modal>
  );
}

// ===================== VENDOR MODAL =====================
function VendorModal({v:init,onSave,onDel,onClose}){
  const [v,setV]=useState({...init});
  const isNew=!init.name;
  return(
    <Modal title={isNew?"Add Vendor":`Edit: ${init.name}`} onClose={onClose}>
      <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:G500,display:"block",marginBottom:4}}>Name</label><Inp value={v.name} onChange={val=>setV({...v,name:val})} placeholder="Vendor name"/></div>
      <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:G500,display:"block",marginBottom:6}}>Color</label><div style={{display:"flex",gap:6}}>{VCOLS.map(c=><button key={c} onClick={()=>setV({...v,color:c})} style={{width:28,height:28,borderRadius:6,background:c,border:v.color===c?"3px solid #000":"2px solid transparent",cursor:"pointer"}}/>)}</div></div>
      <div style={{marginBottom:18}}><label style={{fontSize:11,fontWeight:600,color:G500,display:"block",marginBottom:4}}>Description</label><TA value={v.desc} onChange={val=>setV({...v,desc:val})} placeholder="What does this vendor do?" rows={3}/></div>
      <div style={{display:"flex",justifyContent:"space-between",borderTop:`1px solid ${G200}`,paddingTop:14}}>
        {!isNew?<Btn danger onClick={()=>{if(confirm(`Delete ${v.name}?`))onDel(v.id);}}>Delete</Btn>:<div/>}
        <div style={{display:"flex",gap:8}}><Btn onClick={onClose}>Cancel</Btn><Btn primary onClick={()=>onSave(v)} disabled={!v.name.trim()}>Save</Btn></div>
      </div>
    </Modal>
  );
}
