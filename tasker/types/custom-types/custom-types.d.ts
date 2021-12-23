import { DeclaredGlobals } from "../../../src/declarations/declared-vars";

export type LocalArrays = "tedddi";

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
  | DeclaredGlobals;

interface ITaskerLocals {
  tedddi: string;
  err: string;
  errmsg: string;
  priority: string;
  qtime: string;
  caller: string;
}

/*
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
*/
