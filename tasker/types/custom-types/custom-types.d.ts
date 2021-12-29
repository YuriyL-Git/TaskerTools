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
  getconfigurl: string;
  taskerdata: string;
}