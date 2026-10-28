import {describe,it,expect} from "vitest";
import {validateReport,type Report} from "../src/core.js";
import {chartSvg} from "../src/chart-svg.js";
const base:Report={schemaVersion:"1.0",id:"r",title:"Report",locale:"en",summary:"Synthetic",generatedAt:"2026-10-28T00:00:00Z",sources:[],blocks:[]};
describe("release audit regression coverage",()=>{
 it("rejects duplicate source identifiers",()=>expect(validateReport({...base,sources:[{id:"same",title:"One"},{id:"same",title:"Two"}]}).some(e=>e.path==="sources")).toBe(true));
 it("rejects metric without a value",()=>expect(validateReport({...base,blocks:[{id:"m",kind:"metric"}]}).some(e=>e.path==="blocks[0].value")).toBe(true));
 it("rejects empty paragraph",()=>expect(validateReport({...base,blocks:[{id:"p",kind:"paragraph",text:"  "}]}).length).toBeGreaterThan(0));
 it("rejects oversized static charts",()=>expect(()=>chartSvg({id:"c",kind:"bar",xKey:"x",yKey:"y",rows:Array.from({length:25},(_,i)=>({x:String(i),y:i}))})).toThrow(/Too many/));
 it("rejects oversized labels",()=>expect(()=>chartSvg({id:"c",kind:"bar",xKey:"x",yKey:"y",rows:[{x:"x".repeat(61),y:2}]})).toThrow(/label too long/));
});
