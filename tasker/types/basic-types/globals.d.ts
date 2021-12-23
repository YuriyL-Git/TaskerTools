import { CustomGlobals } from "../custom-types";

export type Globals =
  | "AIR"
  | "AIRR"
  | "BATT"
  | "BLUE"
  | "CALS"
  | "CALS"
  | "CALS"
  | "CALS"
  | "CALTITLE"
  | "CALDESCR"
  | "CALLOC"
  | "TIMES"
  | "CNAME"
  | "CNUM"
  | "CDATE"
  | "CTIME"
  | "CONAME"
  | "CONUM"
  | "CODATE"
  | "COTIME"
  | "CODUR"
  | "CELLID"
  | "CELLID"
  | "CELLSIG"
  | "CELLSRV"
  | "CLIP"
  | "CPUFREQ"
  | "CPUGOV"
  | "DATE"
  | "DAYM"
  | "DAYW"
  | "DEVID"
  | "DEVMAN"
  | "DEVMOD"
  | "DEVPROD"
  | "DEVTID"
  | "DEVTID"
  | "BRIGHT"
  | "DTOUT"
  | "EFROM"
  | "ECC"
  | "ESUBJ"
  | "EDATE"
  | "ETIME"
  | "MEMF"
  | "GPS"
  | "HEART"
  | "HTTPR"
  | "HTTPD"
  | "HTTPL"
  | "HTTPL"
  | "HUMIDITY"
  | "IMETHOD"
  | "INTERRUPT"
  | "KEYG"
  | "LAPP"
  | "FOTO"
  | "LIGHT"
  | "LOC"
  | "LOCACC"
  | "LOCALT"
  | "LOCSPD"
  | "LOCTMS"
  | "TIMES"
  | "LOCN"
  | "LOCNACC"
  | "LOCNTMS"
  | "TIMES"
  | "MFIELD"
  | "MTRACK"
  | "MUTED"
  | "NIGHT"
  | "NTITLE"
  | "NTITLE"
  | "PNUM"
  | "PRESSURE"
  | "PACTIVE"
  | "PENABLED"
  | "ROAM"
  | "ROOT"
  | "SCREEN"
  | "SDK"
  | "SILENT"
  | "INTERRUPT"
  | "SIMNUM"
  | "SIMSTATE"
  | "SPHONE"
  | "SPEECH"
  | "TRUN"
  | "TNET"
  | "TEMP"
  | "SMSRF"
  | "SMSRN"
  | "SMSRB"
  | "MMSRS"
  | "SMSRD"
  | "SMSRT"
  | "SMSRB"
  | "MMSRS"
  | "TIME"
  | "TETHER"
  | "TIMEMS"
  | "TIMES"
  | "UIMODE"
  | "UPS"
  | "VOLA"
  | "VOLC"
  | "VOLD"
  | "VOLM"
  | "VOLN"
  | "VOLR"
  | "VOLS"
  | "WIFII"
  | "WIFI"
  | "WIMAX"
  | "WIN"
  | GlobalDescr
  | CustomGlobals;

export const enum GlobalDescr {
  "Airplane Mode Status" = "AIR",
  "Airplane Radios" = "AIRR",
  "Battery Level" = "BATT",
  "Bluetooth Status" = "BLUE",
  "Calendar List" = "CALS",
  "Call Name (In)" = "CNAME",
  "Call Number (In)" = "CNUM ",
  "Call Date (In)" = "CDATE",
  "Call Time (In)" = "CTIME",
  "Call Name (Out)" = "CONAME",
  "Call Number (Out)" = "CONUM",
  "Call Date (Out)" = "CODATE",
  "Call Time (Out)" = "COTIME",
  "Call Duration (Out)" = "CODUR",
  "Cell ID" = "CELLID",
  "Cell Signal Strength" = "CELLSIG",
  "Cell Service State" = "CELLSRV",
  "CPU Frequency" = "CPUFREQ",
  "CPU Governor" = "CPUGOV",
  "Date" = "DATE",
  "Day of the Month" = "DAYM",
  "Day of the Week" = "DAYW",
  "Device ID " = "DEVID ",
  "Device Manufacturer" = "DEVMAN",
  "Device Model" = "DEVMOD",
  "Device Product" = "DEVPRO",
  "Device Telephony ID" = "DEVTID",
  "Email From " = "EFROM ",
  "Email Cc " = "ECC",
  "Email Subject" = "ESUBJ",
  "Email Date" = "EDATE",
  "Email Time" = "ETIME",
  "Free Memory" = "MEMF",
  "Heart Rate" = "HEART",
  "Humidity" = "HUMIDITY",
  "Input Method" = "IMETHOD",
  "Interrupt Mode" = "INTERRUPT",
  "Keyguard Status" = "KEYG",
  "Last Application" = "LAPP",
  "Last Photo" = "FOTO",
  "Light Level" = "LIGHT",
  "Location" = "LOC",
  "Location Accuracy" = "LOCACC",
  "Location Altitude" = "LOCALT",
  "Location Speed" = "LOCSPD",
  "Location Fix Time Seconds" = "LOCTMS",
  "Location (Net)" = "LOCN",
  "Location Accuracy (Net)" = "LOCNACC",
  "Location Fix Time (Net)" = "LOCNTMS",
  "Magnetic Field Strength" = "MFIELD",
  "Music Track" = "MTRACK",
  "Muted" = "MUTED",
  "Night Mode" = "NIGHT",
  "Notification Title (monitored, )" = "NTITLE",
  "Phone Number" = "PNUM",
  "Pressure" = "PRESSURE",
  "Profiles Active" = "PACTIVE",
  "Profiles Enabled" = "PENABLED",
  "Roaming" = "ROAM",
  "Root Available" = "ROOT",
  "Screen" = "SCREEN",
  "SDK Version" = "SDK",
  "Silent Mode" = "SILENT",
  "SIM Serial Number" = "SIMNUM",
  "SIM State" = "SIMSTATE",
  "Speakerphone" = "SPHONE",
  "Speech" = "SPEECH",
  "Tasks Running" = "TRUN",
  "Telephone Network (, monitored)" = "TNET",
  "Temperature" = "TEMP",
  "Text From" = "SMSRF ",
  "Text Date" = "SMSRD",
  "Text Subject" = "MMSRS",
  "Text Time" = "SMSRT",
  "Time" = "TIME",
  "Tether" = "TETHER",
  "Time MilliSeconds" = "TIMEMS",
  "Time Seconds" = "TIMES",
  "UI Mode" = "UIMODE",
  "Uptime Seconds" = "UPS",
  "Volume - Alarm" = "VOLA ",
  "Volume - Call" = "VOLC",
  "Volume - DTMF" = "VOLD",
  "Volume - Media" = "VOLM",
  "Volume - Notification" = "VOLN",
  "Volume - Ringer" = "VOLR",
  "Volume - System" = "VOLS",
  "WiFi Info" = "WIFII",
  "WiFi Status" = "WIFI",
  "Wimax Status" = "WIMAX",
  "Window Label" = "WIN",
}
