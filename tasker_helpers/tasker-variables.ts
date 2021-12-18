import { declaredLocals, IDeclaredLocals } from "../src/variable-declarations/declared-locals"; 
import {UserDeclaredGlobals } from "../src/variable-declarations/declared-globals";
import { GeneralGlobals } from "./general-globals"; 

export type LocalVars = 
  | "tedddi"; 

export type GlobalVars = 
  | "NotificationTitle"
  | "ContinueNotification"
  | "RepeatTime"
  | "NotificStatus"
  | "scriptPath"
  | "matTitle"
  | "NotoficStatus"
  | "Notification"
  | "Testtt"
  | "ArrayTest"
  | "JavaVat"
  | "Array"
  | UserDeclaredGlobals 
  | GeneralGlobals; 

interface ITaskerLocals {
  tedddi: string; 
  err: string; 
  errmsg: string; 
  priority: string; 
  qtime: string; 
  caller: string; 
} 

const taskerLocals: ITaskerLocals = {
  tedddi: "", 
  err: "", 
  errmsg: "", 
  priority: "", 
  qtime: "", 
  caller: "", 
}; 

export const locals: ITaskerLocals & IDeclaredLocals = { 
...taskerLocals, 
...declaredLocals, 
}; 
