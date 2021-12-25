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
  requesturl: string;
  tpe_hostaddress: string;
  query: string;
  tasks: string[];
  globals: string[];
  http_cookies: string;
  http_data: string;
  http_file_output: string;
  http_response_code: string;
  http_headers: string[];
  http_response_length: string;
}