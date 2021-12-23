import { GlobalsDeclaration } from "declarations";

export type LocalArrays = "tedddi()";

export type CustomGlobals =
  | "NotificationTitle"
  | "TaskerToolsHostAddress"
  | "ContinueNotification"
  | "RepeatTime"
  | "NotificStatus"
  | "NotoficStatus"
  | "Notification"
  | "scriptPath"
  | "matTitle"
  | GlobalsDeclaration;

export interface ITaskerLocals {
  tedddi: string;
  err: string;
  errmsg: string;
  priority: string;
  qtime: string;
  caller: string;
}
