import { GlobalsDeclaration } from "declarations"; 

export type CustomGlobals = 
  | "NotificationTitle"
  | "NotoficStatus"
  | "Notification"
  | "NotificStatus"
  | "scriptPath"
  | "RepeatTime"
  | "TaskerToolsHostAddress"
  | "ContinueNotification"
  | GlobalsDeclaration; 

export interface ITaskerLocals {
  takka: string;
  placeholder: string;
  taskervar: string;
}