import { declaredLocals, IDeclaredLocals } from "../src/type-declarations/declared-locals";
export type LocalVars = 
  | "ted"
  | "testing"; 

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
  | "Array"; 

interface ITaskerLocals {
  ted: string; 
  testing: string; 
} 

const taskerLocals: ITaskerLocals = {
  ted: "", 
  testing: "", 
}; 

export const locals: ITaskerLocals & IDeclaredLocals = { 
...taskerLocals, 
...declaredLocals, 
}; 
