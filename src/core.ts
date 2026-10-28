export type Locale = "fa" | "en";
export type Kind = "paragraph"|"metric"|"table"|"bar"|"line"|"pie"|"timeline"|"flow"|"callout";
export type Source = { id:string; title:string; url?:string; retrievedAt?:string };
export type DataRow = Record<string,string|number|null>;
export type Block = {id:string;kind:Kind;title?:string;text?:string;value?:string|number;unit?:string;rows?:DataRow[];xKey?:string;yKey?:string;steps?:string[];sourceIds?:string[];alt?:string};
export type Report = {schemaVersion:"1.0";id:string;title:string;locale:Locale;summary:string;generatedAt:string;sources:Source[];blocks:Block[]};
export type Issue = {path:string;message:string};
const kinds:Kind[]=["paragraph","metric","table","bar","line","pie","timeline","flow","callout"];
export function validateReport(report:Report):Issue[]{
 const issues:Issue[]=[];
 if(report.schemaVersion!=="1.0")issues.push({path:"schemaVersion",message:"Unsupported version"});
 if(!report.id?.trim()||!report.title?.trim())issues.push({path:"report",message:"ID and title required"});
 if(!["fa","en"].includes(report.locale))issues.push({path:"locale",message:"Unsupported locale"});
 if(!Number.isFinite(Date.parse(report.generatedAt)))issues.push({path:"generatedAt",message:"Invalid date"});
 const ids=new Set<string>(),sources=new Set(report.sources.map(s=>s.id));
 for(const [i,b] of report.blocks.entries()){
  const p="blocks["+i+"]";
  if(!b.id||ids.has(b.id))issues.push({path:p+".id",message:"Missing or duplicate ID"});
  ids.add(b.id);
  if(!kinds.includes(b.kind))issues.push({path:p+".kind",message:"Unsupported kind"});
  if(["bar","line","pie","table"].includes(b.kind)&&!b.rows?.length)issues.push({path:p+".rows",message:"Data rows required"});
  if(["bar","line","pie"].includes(b.kind)&&(!b.xKey||!b.yKey||!b.rows?.every(r=>typeof r[b.yKey!] === "number" && Number.isFinite(r[b.yKey!] as number))))issues.push({path:p,message:"Charts require numeric yKey and xKey"});
  if(["flow","timeline"].includes(b.kind)&&!b.steps?.length)issues.push({path:p+".steps",message:"Steps required"});
  for(const s of b.sourceIds??[])if(!sources.has(s))issues.push({path:p+".sourceIds",message:"Unknown source: "+s});
 }
 return issues;
}
export function chooseVisualization(intent:"trend"|"comparison"|"proportion"|"sequence"|"process"|"detail"|"kpi",count:number):Kind{
 const map={trend:"line",comparison:"bar",proportion:"pie",sequence:"timeline",process:"flow",detail:"table",kpi:"metric"} as const;
 if(intent==="proportion"&&count>6)return "bar";
 if(intent==="comparison"&&count>20)return "table";
 return map[intent];
}
export function assertReport(report:Report):Report{const errors=validateReport(report);if(errors.length)throw new Error(errors.map(e=>e.path+": "+e.message).join("; "));return report;}
