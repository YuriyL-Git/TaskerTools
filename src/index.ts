import { testingFunc } from "./test-func";
import { tk } from "tasker-types";
import { locals } from "../tasker_helpers/tasker-variables";

//should be uncommented in case if task auto exit is turned off
//setTimeout(() => tk.exit());

testingFunc();
tk.flash(locals.testing_var + "test");
