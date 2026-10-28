import {Document,Packer,Paragraph,HeadingLevel,Table,TableRow,TableCell,ImageRun} from "docx";
import {renderToBuffer,Document as PdfDocument,Page,Text,View,Image,Font,StyleSheet} from "@react-pdf/renderer";
import React from "react";
import sharp from "sharp";
import {assertReport,type Report,type Block} from "./core.js";
import {chartSvg} from "./chart-svg.js";

export type ExportOptions={fontPath?:string;fontFamily?:string};
const isChart=(b:Block)=>b.kind==="bar"||b.kind==="line"||b.kind==="pie";
async function chartPng(block:Block):Promise<Buffer>{
 return sharp(Buffer.from(chartSvg(block))).resize({width:1200}).png().toBuffer();
}
function rowsTable(block:Block):Table{
 const keys=Object.keys(block.rows?.[0]??{});
 return new Table({rows:[
  new TableRow({children:keys.map(k=>new TableCell({children:[new Paragraph(k)]}))}),
  ...(block.rows??[]).map(row=>new TableRow({children:keys.map(k=>new TableCell({children:[new Paragraph(String(row[k]??""))]}))}))
 ]});
}
export async function toDocx(report:Report):Promise<Buffer>{
 assertReport(report);
 const children:(Paragraph|Table)[]=[
  new Paragraph({text:report.title,heading:HeadingLevel.TITLE,bidirectional:report.locale==="fa"}),
  new Paragraph({text:report.summary,bidirectional:report.locale==="fa"})
 ];
 for(const b of report.blocks){
  if(b.title)children.push(new Paragraph({text:b.title,heading:HeadingLevel.HEADING_2,bidirectional:report.locale==="fa"}));
  if(b.text)children.push(new Paragraph({text:b.text,bidirectional:report.locale==="fa"}));
  if(b.value!==undefined)children.push(new Paragraph({text:String(b.value)+(b.unit?" "+b.unit:""),bidirectional:report.locale==="fa"}));
  if(b.steps)for(const step of b.steps)children.push(new Paragraph({text:step,bullet:{level:0},bidirectional:report.locale==="fa"}));
  if(isChart(b)){
   const data=await chartPng(b);
   children.push(new Paragraph({children:[new ImageRun({data,type:"png",transformation:{width:560,height:280},altText:{title:b.title??"Chart",description:b.alt??"Data visualization",name:b.id}})]}));
  }
  if(b.rows?.length)children.push(rowsTable(b));
 }
 if(report.sources.length){
  children.push(new Paragraph({text:report.locale==="fa"?"منابع":"Sources",heading:HeadingLevel.HEADING_2}));
  for(const source of report.sources)children.push(new Paragraph(source.title+(source.url?" — "+source.url:"")));
 }
 return Packer.toBuffer(new Document({sections:[{children}]}));
}
export async function toPdf(report:Report,options:ExportOptions={}):Promise<Buffer>{
 assertReport(report);
 if(report.locale==="fa"&&!options.fontPath)throw new Error("Persian PDF requires an embedded Unicode font. Supply fontPath.");
 const family=options.fontFamily??"RVRDS-Embedded";
 if(options.fontPath)Font.register({family,src:options.fontPath});
 const s=StyleSheet.create({
  page:{padding:38,fontSize:10,fontFamily:options.fontPath?family:"Helvetica",color:"#12304A",backgroundColor:"#FAFAF7"},
  title:{fontSize:22,marginBottom:14,color:"#174A3A"},
  heading:{fontSize:14,marginTop:16,marginBottom:8,color:"#174A3A"},
  body:{marginBottom:8,lineHeight:1.5},
  chart:{width:510,height:255,objectFit:"contain",marginVertical:12},
  row:{marginBottom:4,fontSize:9}
 });
 const nodes:React.ReactNode[]=[
  React.createElement(Text,{key:"title",style:s.title},report.title),
  React.createElement(Text,{key:"summary",style:s.body},report.summary)
 ];
 for(const b of report.blocks){
  if(b.title)nodes.push(React.createElement(Text,{key:b.id+"title",style:s.heading},b.title));
  if(b.text)nodes.push(React.createElement(Text,{key:b.id+"text",style:s.body},b.text));
  if(b.value!==undefined)nodes.push(React.createElement(Text,{key:b.id+"value",style:s.body},String(b.value)+" "+(b.unit??"")));
  for(const [i,step] of (b.steps??[]).entries())nodes.push(React.createElement(Text,{key:b.id+"step"+i,style:s.row},(i+1)+". "+step));
  if(isChart(b)){
   const png=await chartPng(b);
   nodes.push(React.createElement(Image,{key:b.id+"image",src:{data:png,format:"png"},style:s.chart}));
  }
  if(b.rows?.length){
   const keys=Object.keys(b.rows[0]);
   nodes.push(React.createElement(Text,{key:b.id+"headers",style:s.row},keys.join(" | ")));
   for(const [i,row] of b.rows.entries())nodes.push(React.createElement(Text,{key:b.id+"row"+i,style:s.row},keys.map(k=>String(row[k]??"")).join(" | ")));
  }
 }
 if(report.sources.length){
  nodes.push(React.createElement(Text,{key:"sources",style:s.heading},report.locale==="fa"?"منابع":"Sources"));
  for(const source of report.sources)nodes.push(React.createElement(Text,{key:"source"+source.id,style:s.row},source.title+(source.url?" — "+source.url:"")));
 }
 const document=React.createElement(PdfDocument,null,React.createElement(Page,{size:"A4",wrap:true,style:s.page},React.createElement(View,null,...nodes)));
 return Buffer.from(await renderToBuffer(document));
}
