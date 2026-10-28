import type {Block} from "./core.js";
const escapeXml=(s:unknown)=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
/** Deterministic SVG chart asset; consumers should rasterize SVG for PDF/DOCX if required. */
export function chartSvg(b:Block):string{
 if(!["bar","line","pie"].includes(b.kind))throw new Error("Unsupported chart type");
 const rows=b.rows??[],x=b.xKey??"",y=b.yKey??"";
 if(!rows.length||!x||!y||rows.some(r=>typeof r[y]!=="number"||!Number.isFinite(r[y])))throw new Error("Invalid chart data");
 const width=800,height=400,pad=60,plotW=width-2*pad,plotH=height-2*pad;
 const vals=rows.map(r=>r[y] as number),labels=rows.map(r=>escapeXml(r[x]));
 if(rows.length>24)throw new Error("Too many chart categories for static export; use a table");
 if(labels.some(l=>l.length>60))throw new Error("Chart label too long for static export; use a table");
 const colors=["#174A3A","#12304A","#A88455","#6B7C87","#A4BBAE","#8C6A88"];
 let content="";
 if(b.kind==="pie"){
  if(vals.some(v=>v<0)||vals.reduce((a,c)=>a+c,0)<=0)throw new Error("Pie values must be nonnegative with positive total");
  const total=vals.reduce((a,c)=>a+c,0);let offset=0;
  content=vals.map((v,i)=>{const a=offset/total*2*Math.PI-Math.PI/2;offset+=v;const z=offset/total*2*Math.PI-Math.PI/2;const cx=270,cy=205,r=135;if(v===total)return '<circle cx="270" cy="205" r="135" fill="'+colors[i%colors.length]+'"/>';const p1=[cx+r*Math.cos(a),cy+r*Math.sin(a)],p2=[cx+r*Math.cos(z),cy+r*Math.sin(z)];return '<path d="M '+cx+' '+cy+' L '+p1.join(" ")+' A '+r+' '+r+' 0 '+(z-a>Math.PI?1:0)+' 1 '+p2.join(" ")+' Z" fill="'+colors[i%colors.length]+'"/>';}).join("");
  content+=labels.map((l,i)=>'<rect x="520" y="'+(75+i*30)+'" width="14" height="14" fill="'+colors[i%colors.length]+'"/><text x="543" y="'+(87+i*30)+'" font-size="15" fill="#12304A">'+l+': '+vals[i]+'</text>').join("");
 }else{
  const step=plotW/rows.length;const scale=plotH/(Math.max(...vals,0)-Math.min(...vals,0)||1);const maxV=Math.max(...vals,0);
  const sy=(v:number)=>pad+(maxV-v)*scale;
  content='<path d="M '+pad+' '+sy(0)+' H '+(width-pad)+'" stroke="#6B7C87" stroke-width="2"/>';
  if(b.kind==="bar")content+=vals.map((v,i)=>{const y0=sy(0),yv=sy(v);return '<rect x="'+(pad+i*step+step*.2)+'" y="'+Math.min(y0,yv)+'" width="'+(step*.6)+'" height="'+Math.max(1,Math.abs(y0-yv))+'" fill="'+colors[i%colors.length]+'"/>';}).join("");
  else content+='<polyline fill="none" stroke="#174A3A" stroke-width="4" points="'+vals.map((v,i)=>(pad+step*(i+.5))+','+sy(v)).join(" ")+'"/>';
  content+=labels.map((l,i)=>'<text x="'+(pad+step*(i+.5))+'" y="370" text-anchor="middle" font-size="13" fill="#12304A">'+l+'</text>').join("");
 }
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" role="img" aria-label="'+escapeXml(b.alt??b.title??"Chart")+'"><rect width="800" height="400" fill="#FAFAF7"/>'+content+'</svg>';
}
