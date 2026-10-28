import {Document,Packer,Paragraph,HeadingLevel,Table,TableRow,TableCell,TextRun} from "docx";
import {renderToBuffer,Document as PdfDocument,Page,Text,View,StyleSheet} from "@react-pdf/renderer";
import React from "react";
import {assertReport,type Report} from "./core.js";
export async function toDocx(report:Report):Promise<Buffer>{
 assertReport(report);
 const children:any[]=[new Paragraph({text:report.title,heading:HeadingLevel.TITLE}),new Paragraph(report.summary)];
 for(const b of report.blocks){
  if(b.title)children.push(new Paragraph({text:b.title,heading:HeadingLevel.HEADING_2}));
  if(b.text)children.push(new Paragraph(b.text));
  if(b.value!==undefined)children.push(new Paragraph(String(b.value)+(b.unit?" "+b.unit:"")));
  if(b.steps)for(const step of b.steps)children.push(new Paragraph({text:step,bullet:{level:0}}));
  if(b.rows?.length){const keys=Object.keys(b.rows[0]);children.push(new Table({rows:[new TableRow({children:keys.map(k=>new TableCell({children:[new Paragraph(k)]}))}),...b.rows.map(r=>new TableRow({children:keys.map(k=>new TableCell({children:[new Paragraph(String(r[k]??""))]}))}))]}));}
 }
 return Packer.toBuffer(new Document({sections:[{children}]}));
}
export async function toPdf(report:Report):Promise<Buffer>{
 assertReport(report);
 const s=StyleSheet.create({page:{padding:36,fontSize:11},title:{fontSize:20,marginBottom:16},heading:{fontSize:14,marginTop:14,marginBottom:6},body:{marginBottom:8}});
 const parts:any[]=[React.createElement(Text,{key:"title",style:s.title},report.title),React.createElement(Text,{key:"summary",style:s.body},report.summary)];
 for(const b of report.blocks){if(b.title)parts.push(React.createElement(Text,{key:b.id+"-title",style:s.heading},b.title));if(b.text)parts.push(React.createElement(Text,{key:b.id+"-text",style:s.body},b.text));if(b.value!==undefined)parts.push(React.createElement(Text,{key:b.id+"-metric"},String(b.value)+" "+(b.unit??"")));for(const [i,step] of (b.steps??[]).entries())parts.push(React.createElement(Text,{key:b.id+"-step-"+i},(i+1)+". "+step));for(const [i,row] of (b.rows??[]).entries())parts.push(React.createElement(Text,{key:b.id+"-row-"+i},Object.entries(row).map(([k,v])=>k+": "+v).join(" | "))); }
 return renderToBuffer(React.createElement(PdfDocument,null,React.createElement(Page,{size:"A4",style:s.page},React.createElement(View,null,...parts))));
}
