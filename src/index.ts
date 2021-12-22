import { tk } from "./tk";
import { locals } from "../tasker_helpers/tasker-variables";

const data = new FormData();
data.append("file", locals.taskerdata);

fetch(locals.getconfigurl, {
  method: "POST",
  body: data,
}).then(() => {
  tk.exit();
});
