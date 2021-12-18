import { testingFunc } from "./test-func";
import { tk } from "tasker-types";
import { GlobalDescr } from "../tasker_helpers/general-globals";

//should be uncommented in case if task auto exit is turned off
setTimeout(() => tk.exit()); //

testingFunc();

tk.flash(tk.global(GlobalDescr["Bluetooth Status"]));
