import { testingFunc } from "./test-func";
import { tk } from "tasker-types";
import { locals } from "../tasker_helpers/tasker-variables";
import { testFunc2 } from "./test-func2";

//should be uncommented in case if task auto exit is turned off
setTimeout(() => tk.exit());

testingFunc();
testFunc2();
tk.flash(tk.global("BRIGHT"));
