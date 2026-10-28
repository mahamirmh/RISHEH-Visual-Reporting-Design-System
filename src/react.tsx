import React from "react";
import {ResponsiveContainer,BarChart,LineChart,PieChart,Pie,Bar,Line,XAxis,YAxis,Tooltip,Legend,Cell} from "recharts";
import {assertReport,type Report,type Block} from "./core.js";
const colors=["#174A3A","#12304A","#A88455","#6B7C87","#A4BBAE","#8C6A88"];
export function ReportView({report}:{report:Report}){
 assertReport(report);
 return <article dir={report.locale==="fa"?"rtl":"ltr"} lang={report.locale} style={{fontFamily:"inherit",maxWidth:1050,margin:"auto",padding:24,color:"#12304A",lineHeight:1.7}}>
  <header><h1>{report.title}</h1><p>{report.summary}</p><small>{report.generatedAt}</small></header>
  <div style={{display:"grid",gap:20}}>{report.blocks.map(b=><ReportBlock key={b.id} block={b}/>)}</div>
  {report.sources.length>0&&<footer><h2>{report.locale==="fa"?"منابع":"Sources"}</h2><ol>{report.sources.map(s=><li key={s.id}>{s.url?<a href={s.url} rel="noopener noreferrer">{s.title}</a>:s.title}</li>)}</ol></footer>}
 </article>;
}
export function ReportBlock({block:b}:{block:Block}){
 const title=b.title&&<h2 style={{fontSize:"1.2rem"}}>{b.title}</h2>;
 const card=(content:React.ReactNode)=><section aria-label={b.title??b.kind} style={{border:"1px solid #DCE5E1",borderRadius:14,padding:20,background:"#fff"}}>{title}{content}</section>;
 if(b.kind==="paragraph"||b.kind==="callout")return card(<p>{b.text}</p>);
 if(b.kind==="metric")return card(<strong style={{fontSize:32}}>{b.value} {b.unit}</strong>);
 if(b.kind==="flow"||b.kind==="timeline")return card(<ol>{b.steps?.map((s,i)=><li key={i}>{s}</li>)}</ol>);
 if(b.kind==="table")return card(<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{Object.keys(b.rows?.[0]??{}).map(k=><th key={k} scope="col" style={{textAlign:"start",borderBottom:"1px solid #ccc",padding:8}}>{k}</th>)}</tr></thead><tbody>{b.rows?.map((r,i)=><tr key={i}>{Object.values(r).map((v,j)=><td key={j} style={{padding:8,borderBottom:"1px solid #eee"}}>{v}</td>)}</tr>)}</tbody></table></div>);
 const data=b.rows??[],x=b.xKey??"",y=b.yKey??"";
 return card(<><div role="img" aria-label={b.alt??b.title??"Data chart"} style={{width:"100%",height:300}}><ResponsiveContainer width="100%" height="100%">{b.kind==="line"?<LineChart data={data}><XAxis dataKey={x}/><YAxis/><Tooltip/><Legend/><Line dataKey={y} stroke={colors[0]}/></LineChart>:b.kind==="pie"?<PieChart><Tooltip/><Legend/><Pie data={data} dataKey={y} nameKey={x} label>{data.map((_,i)=><Cell key={i} fill={colors[i%colors.length]}/>)}</Pie></PieChart>:<BarChart data={data}><XAxis dataKey={x}/><YAxis/><Tooltip/><Legend/><Bar dataKey={y} fill={colors[0]}/></BarChart>}</ResponsiveContainer></div><details><summary>View chart data</summary><table><tbody>{data.map((r,i)=><tr key={i}><th scope="row">{r[x]}</th><td>{r[y]}</td></tr>)}</tbody></table></details></>);
}
