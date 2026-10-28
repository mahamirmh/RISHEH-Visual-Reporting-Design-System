import Ajv from "ajv";
import type {Report} from "./core.js";
export const reportSchema={
 type:"object",additionalProperties:false,
 required:["schemaVersion","id","title","locale","summary","generatedAt","sources","blocks"],
 properties:{
 schemaVersion:{const:"1.0"},id:{type:"string",minLength:1},title:{type:"string",minLength:1},
 locale:{enum:["fa","en"]},summary:{type:"string"},generatedAt:{type:"string",minLength:1},
 sources:{type:"array",items:{type:"object",required:["id","title"],additionalProperties:false,properties:{id:{type:"string",minLength:1},title:{type:"string",minLength:1},url:{type:"string"},retrievedAt:{type:"string"}}}},
 blocks:{type:"array",items:{type:"object",required:["id","kind"],additionalProperties:false,properties:{
 id:{type:"string",minLength:1},kind:{enum:["paragraph","metric","table","bar","line","pie","timeline","flow","callout"]},
 title:{type:"string"},text:{type:"string"},value:{type:["string","number"]},unit:{type:"string"},
 rows:{type:"array",items:{type:"object",additionalProperties:{type:["string","number","null"]}}},
 xKey:{type:"string"},yKey:{type:"string"},steps:{type:"array",items:{type:"string"}},
 sourceIds:{type:"array",items:{type:"string"}},alt:{type:"string"}
 }}}
 }
} as const;
const ajv=new Ajv({allErrors:true,strict:false});
const validator=ajv.compile(reportSchema);
export function parseReport(input:unknown):Report{
 if(!validator(input))throw new Error("Invalid Report IR: "+ajv.errorsText(validator.errors));
 return input as Report;
}
